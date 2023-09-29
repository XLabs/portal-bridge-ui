import {
  ChainId,
  CHAIN_ID_ACALA,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_KARURA,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  createWrappedOnAlgorand,
  createWrappedOnAptos,
  createWrappedOnEth,
  createWrappedOnInjective,
  createWrappedOnSolana,
  createWrappedOnTerra,
  createWrappedOnXpla,
  createWrappedTypeOnAptos,
  isEVMChain,
  isTerraChain,
  postVaaSolanaWithRetry,
  TerraChainId,
  updateWrappedOnEth,
  updateWrappedOnInjective,
  updateWrappedOnSolana,
  updateWrappedOnTerra,
  updateWrappedOnXpla,
  CHAIN_ID_SUI,
  parseAttestMetaVaa,
  createWrappedOnSui,
  CHAIN_ID_SEI,
} from "@certusone/wormhole-sdk";

import { Alert } from "@material-ui/lab";
import { Connection } from "@solana/web3.js";
import algosdk from "algosdk";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlgorandWallet } from "../contexts/AlgorandWalletContext";
import { useAptosContext } from "../contexts/AptosWalletContext";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import { setCreateTx, setIsCreating } from "../store/attestSlice";
import {
  selectAttestIsCreating,
  selectAttestTargetChain,
  selectTerraFeeDenom,
} from "../store/selectors";
import { signSendAndConfirmAlgorand } from "../utils/algorand";
import { waitForSignAndSubmitTransaction } from "../utils/aptos";
import {
  ACALA_HOST,
  ALGORAND_BRIDGE_ID,
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
  KARURA_HOST,
  MAX_VAA_UPLOAD_RETRIES_SOLANA,
  NEAR_TOKEN_BRIDGE_ACCOUNT,
  SOLANA_HOST,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
  getBridgeAddressForChain,
} from "../utils/consts";
import { getKaruraGasParams } from "../utils/karura";
import {
  createWrappedOnNear,
  makeNearAccount,
  signAndSendTransactions,
} from "../utils/near";
import { postWithFeesXpla } from "../utils/xpla";
import parseError from "../utils/parseError";
import { signSendAndConfirm } from "../utils/solana";
import { postWithFees } from "../utils/terra";
import useAttestSignedVAA from "./useAttestSignedVAA";
import { broadcastInjectiveTx } from "../utils/injective";
import { useInjectiveContext } from "../contexts/InjectiveWalletContext";
import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import { InjectiveWallet } from "@xlabs-libs/wallet-aggregator-injective";
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";
import { useTerraWallet } from "../contexts/TerraWalletContext";
import { TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import { XplaWallet } from "@xlabs-libs/wallet-aggregator-xpla";
import { useXplaWallet } from "../contexts/XplaWalletContext";
import {
  JsonRpcProvider,
  SUI_CLOCK_OBJECT_ID,
  SuiTransactionBlockResponse,
  TransactionBlock,
  getPublishedObjectChanges,
} from "@mysten/sui.js";
import {
  getPackageId,
  getWrappedCoinType,
} from "@certusone/wormhole-sdk/lib/cjs/sui";
import { getSuiProvider } from "../utils/sui";
import { sleep } from "../utils/sleep";
import { useSuiWallet } from "../contexts/SuiWalletContext";
import { SuiWallet } from "@xlabs-libs/wallet-aggregator-sui";
import { createWrappedOnSuiPrepare } from "../utils/suiPublishHotfix";
import {
  calculateFeeForContractExecution,
  createWrappedOnSei,
  updateWrappedOnSei,
} from "../utils/sei";
import { useSeiWallet } from "../contexts/SeiWalletContext";
import { SeiWallet } from "@xlabs-libs/wallet-aggregator-sei";

// TODO: replace with SDK method -
export async function updateWrappedOnSui(
  provider: JsonRpcProvider,
  coreBridgeStateObjectId: string,
  tokenBridgeStateObjectId: string,
  coinPackageId: string,
  attestVAA: Uint8Array
): Promise<TransactionBlock> {
  const coreBridgePackageId = await getPackageId(
    provider,
    coreBridgeStateObjectId
  );
  const tokenBridgePackageId = await getPackageId(
    provider,
    tokenBridgeStateObjectId
  );

  // Get coin metadata
  const coinType = getWrappedCoinType(coinPackageId);
  const coinMetadataObjectId = (await provider.getCoinMetadata({ coinType }))
    ?.id;
  if (!coinMetadataObjectId) {
    throw new Error(
      `Coin metadata object not found for coin type ${coinType}.`
    );
  }

  // Get TokenBridgeMessage
  const tx = new TransactionBlock();
  const [vaa] = tx.moveCall({
    target: `${coreBridgePackageId}::vaa::parse_and_verify`,
    arguments: [
      tx.object(coreBridgeStateObjectId),
      tx.pure([...attestVAA]),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });
  const [message] = tx.moveCall({
    target: `${tokenBridgePackageId}::vaa::verify_only_once`,
    arguments: [tx.object(tokenBridgeStateObjectId), vaa],
  });

  // Construct complete registration payload
  tx.moveCall({
    target: `${tokenBridgePackageId}::create_wrapped::update_attestation`,
    arguments: [
      tx.object(tokenBridgeStateObjectId),
      tx.object(coinMetadataObjectId),
      message,
    ],
    typeArguments: [coinType],
  });
  return tx;
}

async function algo(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: AlgorandWallet,
  signedVAA: Uint8Array
) {
  dispatch(setIsCreating(true));
  try {
    const algodClient = new algosdk.Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const txs = await createWrappedOnAlgorand(
      algodClient as any,
      ALGORAND_TOKEN_BRIDGE_ID,
      ALGORAND_BRIDGE_ID,
      wallet.getAddress()!,
      signedVAA
    );
    const result = await signSendAndConfirmAlgorand(wallet, algodClient, txs);
    dispatch(
      setCreateTx({
        id: txs[txs.length - 1].tx.txID(),
        block: result["confirmed-round"],
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function aptos(
  dispatch: any,
  enqueueSnackbar: any,
  senderAddr: string,
  signedVAA: Uint8Array,
  shouldUpdate: boolean,
  wallet: AptosWallet
) {
  dispatch(setIsCreating(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_APTOS);
  // const client = getAptosClient();
  try {
    // create coin type (it's possible this was already done)
    // TODO: can this be detected? otherwise the user has to click cancel twice
    try {
      const createWrappedCoinTypePayload = createWrappedTypeOnAptos(
        tokenBridgeAddress,
        signedVAA
      );
      await waitForSignAndSubmitTransaction(
        createWrappedCoinTypePayload,
        wallet
      );
    } catch (e) {}
    // create coin
    const createWrappedCoinPayload = createWrappedOnAptos(
      tokenBridgeAddress,
      signedVAA
    );
    const result = await waitForSignAndSubmitTransaction(
      createWrappedCoinPayload,
      wallet
    );
    dispatch(setCreateTx({ id: result, block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  signedVAA: Uint8Array,
  chainId: ChainId,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  try {
    // Karura and Acala need gas params for contract deploys
    // Klaytn requires specifying gasPrice
    const overrides =
      chainId === CHAIN_ID_KARURA
        ? await getKaruraGasParams(KARURA_HOST)
        : chainId === CHAIN_ID_ACALA
        ? await getKaruraGasParams(ACALA_HOST)
        : chainId === CHAIN_ID_KLAYTN
        ? { gasPrice: (await signer.getGasPrice()).toString() }
        : {};
    const receipt = shouldUpdate
      ? await updateWrappedOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        )
      : await createWrappedOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        );
    dispatch(
      setCreateTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function near(
  dispatch: any,
  enqueueSnackbar: any,
  senderAddr: string,
  signedVAA: Uint8Array,
  wallet: NearWallet
) {
  dispatch(setIsCreating(true));
  try {
    const account = await makeNearAccount(senderAddr);
    const msgs = await createWrappedOnNear(
      account,
      NEAR_TOKEN_BRIDGE_ACCOUNT,
      signedVAA
    );
    const receipt = await signAndSendTransactions(account, wallet, msgs);
    dispatch(
      setCreateTx({
        id: receipt.transaction_outcome.id,
        block: 0,
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function xpla(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: XplaWallet,
  signedVAA: Uint8Array,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_XPLA);
  try {
    const msg = shouldUpdate
      ? await updateWrappedOnXpla(
          tokenBridgeAddress,
          wallet.getAddress()!,
          signedVAA
        )
      : await createWrappedOnXpla(
          tokenBridgeAddress,
          wallet.getAddress()!,
          signedVAA
        );
    const result = await postWithFeesXpla(
      wallet,
      [msg],
      "Wormhole - Create Wrapped"
    );
    dispatch(
      setCreateTx({ id: result.result.txhash, block: result.result.height })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function sei(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SeiWallet,
  signedVAA: Uint8Array,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_SEI);
  try {
    const msg = shouldUpdate
      ? await updateWrappedOnSei(signedVAA)
      : await createWrappedOnSei(signedVAA);
    const instructions = [{ msg: msg, contractAddress: tokenBridgeAddress }];
    const memo = "Wormhole - Create Wrapped";
    const fee = await calculateFeeForContractExecution(
      instructions,
      wallet,
      memo
    );

    // Increase timeout to 3 minutes
    const tx = await wallet.executeMultiple(
      {
        instructions,
        fee,
        memo,
      },
      { broadcastTimeoutMs: 180000 }
    );

    if (!tx.data?.height) {
      console.error("Error: No tx height [sei create wrapped]");
      return;
    }

    dispatch(setCreateTx({ id: tx.id, block: tx.data?.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function solana(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SolanaWallet,
  payerAddress: string, // TODO: we may not need this since we have wallet
  signedVAA: Uint8Array,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  try {
    if (!wallet.signTransaction) {
      throw new Error("wallet.signTransaction is undefined");
    }
    const connection = new Connection(SOLANA_HOST, "confirmed");
    await postVaaSolanaWithRetry(
      connection,
      wallet.signTransaction.bind(wallet),
      SOL_BRIDGE_ADDRESS,
      payerAddress,
      Buffer.from(signedVAA),
      MAX_VAA_UPLOAD_RETRIES_SOLANA
    );
    const transaction = shouldUpdate
      ? await updateWrappedOnSolana(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          signedVAA
        )
      : await createWrappedOnSolana(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          signedVAA
        );
    const txid = await signSendAndConfirm(wallet, transaction);
    // TODO: didn't want to make an info call we didn't need, can we get the block without it by modifying the above call?
    dispatch(setCreateTx({ id: txid, block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: TerraWallet,
  signedVAA: Uint8Array,
  shouldUpdate: boolean,
  feeDenom: string,
  chainId: TerraChainId
) {
  dispatch(setIsCreating(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(chainId);
  try {
    const msg = shouldUpdate
      ? await updateWrappedOnTerra(
          tokenBridgeAddress,
          wallet.getAddress()!,
          signedVAA
        )
      : await createWrappedOnTerra(
          tokenBridgeAddress,
          wallet.getAddress()!,
          signedVAA
        );
    const result = await postWithFees(
      wallet,
      [msg],
      "Wormhole - Create Wrapped",
      [feeDenom],
      chainId
    );
    dispatch(
      setCreateTx({ id: result.result.txhash, block: result.result.height })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function injective(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: InjectiveWallet,
  walletAddress: string,
  signedVAA: Uint8Array,
  shouldUpdate: boolean
) {
  dispatch(setIsCreating(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_INJECTIVE);
  try {
    const msg = shouldUpdate
      ? await updateWrappedOnInjective(
          tokenBridgeAddress,
          walletAddress,
          signedVAA
        )
      : await createWrappedOnInjective(
          tokenBridgeAddress,
          walletAddress,
          signedVAA
        );
    const tx = await broadcastInjectiveTx(
      wallet,
      walletAddress,
      msg,
      "Wormhole - Create Wrapped"
    );
    dispatch(setCreateTx({ id: tx.txHash, block: tx.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

async function sui(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SuiWallet,
  signedVAA: Uint8Array,
  foreignAddress: string | null | undefined
) {
  dispatch(setIsCreating(true));
  try {
    const address = wallet.getAddress();
    if (!address) {
      throw new Error("No wallet address");
    }
    const provider = getSuiProvider();
    let response: any;
    if (foreignAddress) {
      const suiUpdateWrappedTxPayload = await updateWrappedOnSui(
        provider,
        getBridgeAddressForChain(CHAIN_ID_SUI),
        getTokenBridgeAddressForChain(CHAIN_ID_SUI),
        foreignAddress.split("::")[0],
        signedVAA
      );
      response = await wallet.signAndSendTransaction({
        transactionBlock: suiUpdateWrappedTxPayload,
        options: {
          showEvents: true,
        },
      });
      if (!response) {
        throw new Error("Error parsing transaction results");
      }
    } else {
      const suiPrepareRegistrationTxPayload = await createWrappedOnSuiPrepare(
        provider,
        getBridgeAddressForChain(CHAIN_ID_SUI),
        getTokenBridgeAddressForChain(CHAIN_ID_SUI),
        parseAttestMetaVaa(signedVAA).decimals,
        address
      );
      const suiPrepareRegistrationTxRes = (
        await wallet.signAndSendTransaction({
          transactionBlock: suiPrepareRegistrationTxPayload,
          options: {
            showObjectChanges: true,
          },
        })
      ).data;
      if (!suiPrepareRegistrationTxRes) {
        throw new Error("Error parsing transaction results");
      }
      const wrappedAssetSetupEvent =
        suiPrepareRegistrationTxRes.objectChanges?.find(
          (oc) =>
            oc.type === "created" && oc.objectType.includes("WrappedAssetSetup")
        );
      const wrappedAssetSetupType =
        (wrappedAssetSetupEvent?.type === "created" &&
          wrappedAssetSetupEvent.objectType) ||
        undefined;
      if (!wrappedAssetSetupType) {
        throw new Error("Error parsing wrappedAssetSetupType");
      }
      const publishEvents = getPublishedObjectChanges(
        suiPrepareRegistrationTxRes as SuiTransactionBlockResponse
      );
      if (publishEvents.length < 1) {
        throw new Error("Error parsing publishEvents");
      }
      const coinPackageId = publishEvents[0].packageId;
      let attempts = 0;
      let suiCompleteRegistrationTxPayload: TransactionBlock | null = null;
      while (!suiCompleteRegistrationTxPayload) {
        try {
          suiCompleteRegistrationTxPayload = await createWrappedOnSui(
            provider,
            getBridgeAddressForChain(CHAIN_ID_SUI),
            getTokenBridgeAddressForChain(CHAIN_ID_SUI),
            address,
            coinPackageId,
            wrappedAssetSetupType,
            signedVAA
          );
        } catch (e) {
          console.error(`Error on attempt ${++attempts}`);
          console.error(e);
          if (attempts > 15) {
            throw e;
          } else {
            await sleep(2000);
          }
        }
      }

      response = (
        await wallet.signAndSendTransaction({
          transactionBlock: suiCompleteRegistrationTxPayload,
          options: {
            showObjectChanges: true,
          },
        })
      ).data;
      if (!response) {
        throw new Error("Error parsing transaction results");
      }
    }

    dispatch(
      setCreateTx({
        id: response.digest,
        block: Number(response.checkpoint || 0),
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsCreating(false));
  }
}

export function useHandleCreateWrapped(
  shouldUpdate: boolean,
  foreignAddress: string | null | undefined
) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const targetChain = useSelector(selectAttestTargetChain);
  const { publicKey: solPK, wallet: solanaWallet } = useSolanaWallet();
  const signedVAA = useAttestSignedVAA();
  const isCreating = useSelector(selectAttestIsCreating);
  const { signer } = useEthereumProvider(targetChain as any);
  const terraWallet = useTerraWallet(targetChain as any);
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const xplaWallet = useXplaWallet();
  const { address: algoAccount, wallet: algoWallet } = useAlgorandWallet();
  const { account: aptosAddress, wallet: aptosWallet } = useAptosContext();
  const { wallet: injWallet, address: injAddress } = useInjectiveContext();
  const { accountId: nearAccountId, wallet } = useNearContext();
  const suiWallet = useSuiWallet();
  const seiWallet = useSeiWallet();
  const seiAddress = seiWallet?.getAddress();
  const handleCreateClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && !!signedVAA) {
      evm(
        dispatch,
        enqueueSnackbar,
        signer,
        signedVAA,
        targetChain,
        shouldUpdate
      );
    } else if (
      targetChain === CHAIN_ID_SOLANA &&
      !!solanaWallet &&
      !!solPK &&
      !!signedVAA
    ) {
      solana(
        dispatch,
        enqueueSnackbar,
        solanaWallet,
        solPK,
        signedVAA,
        shouldUpdate
      );
    } else if (
      isTerraChain(targetChain) &&
      !!terraWallet.walletAddress &&
      !!terraWallet.wallet &&
      !!signedVAA
    ) {
      terra(
        dispatch,
        enqueueSnackbar,
        terraWallet.wallet,
        signedVAA,
        shouldUpdate,
        terraFeeDenom,
        targetChain
      );
    } else if (targetChain === CHAIN_ID_XPLA && !!xplaWallet && !!signedVAA) {
      xpla(dispatch, enqueueSnackbar, xplaWallet, signedVAA, shouldUpdate);
    } else if (
      targetChain === CHAIN_ID_SEI &&
      seiWallet &&
      seiAddress &&
      !!signedVAA
    ) {
      sei(dispatch, enqueueSnackbar, seiWallet, signedVAA, shouldUpdate);
    } else if (
      targetChain === CHAIN_ID_APTOS &&
      !!aptosAddress &&
      !!signedVAA
    ) {
      aptos(
        dispatch,
        enqueueSnackbar,
        aptosAddress,
        signedVAA,
        shouldUpdate,
        aptosWallet!
      );
    } else if (
      targetChain === CHAIN_ID_ALGORAND &&
      algoAccount &&
      !!signedVAA
    ) {
      algo(dispatch, enqueueSnackbar, algoWallet, signedVAA);
    } else if (
      targetChain === CHAIN_ID_NEAR &&
      nearAccountId &&
      wallet &&
      !!signedVAA
    ) {
      near(dispatch, enqueueSnackbar, nearAccountId, signedVAA, wallet);
    } else if (
      targetChain === CHAIN_ID_INJECTIVE &&
      injWallet &&
      injAddress &&
      !!signedVAA
    ) {
      injective(
        dispatch,
        enqueueSnackbar,
        injWallet,
        injAddress,
        signedVAA,
        shouldUpdate
      );
    } else if (
      targetChain === CHAIN_ID_SUI &&
      suiWallet &&
      suiWallet.isConnected() &&
      suiWallet.getAddress() &&
      !!signedVAA
    ) {
      sui(dispatch, enqueueSnackbar, suiWallet, signedVAA, foreignAddress);
    } else {
      // enqueueSnackbar(
      //   "Creating wrapped tokens on this chain is not yet supported",
      //   {
      //     variant: "error",
      //   }
      // );
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    solanaWallet,
    solPK,
    terraWallet,
    signedVAA,
    signer,
    shouldUpdate,
    terraFeeDenom,
    algoAccount,
    algoWallet,
    nearAccountId,
    wallet,
    xplaWallet,
    aptosAddress,
    aptosWallet,
    injWallet,
    injAddress,
    foreignAddress,
    suiWallet,
    seiWallet,
    seiAddress,
  ]);
  return useMemo(
    () => ({
      handleClick: handleCreateClick,
      disabled: !!isCreating,
      showLoader: !!isCreating,
    }),
    [handleCreateClick, isCreating]
  );
}

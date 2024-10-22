import {
  attestFromAlgorand,
  attestFromAptos,
  attestFromEth,
  attestFromSolana,
  attestFromTerra,
  attestFromXpla,
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  CHAIN_ID_SEI,
  getEmitterAddressAlgorand,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  getEmitterAddressTerra,
  getEmitterAddressXpla,
  getSignedVAAWithRetry,
  isEVMChain,
  isTerraChain,
  parseSequenceFromLogAlgorand,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  parseSequenceFromLogTerra,
  parseSequenceFromLogXpla,
  TerraChainId,
  uint8ArrayToHex,
  attestFromSui,
  CHAIN_ID_SUI,
} from "@certusone/wormhole-sdk";
import { Alert } from "@material-ui/lab";
import { Connection, PublicKey } from "@solana/web3.js";
import algosdk from "algosdk";
import { Types } from "aptos";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlgorandWallet } from "../contexts/AlgorandWalletContext";
import { useAptosContext } from "../contexts/AptosWalletContext";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import {
  setAttestTx,
  setIsSending,
  setSignedVAAHex,
} from "../store/attestSlice";
import {
  selectAttestIsSendComplete,
  selectAttestIsSending,
  selectAttestIsTargetComplete,
  selectAttestSourceAsset,
  selectAttestSourceChain,
  selectAttestTargetChain,
  selectTerraFeeDenom,
} from "../store/selectors";
import { signSendAndConfirmAlgorand } from "../utils/algorand";
import {
  getAptosClient,
  getEmitterAddressAndSequenceFromResult,
  waitForSignAndSubmitTransaction,
} from "../utils/aptos";
import {
  ALGORAND_BRIDGE_ID,
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  NATIVE_NEAR_PLACEHOLDER,
  NEAR_CORE_BRIDGE_ACCOUNT,
  NEAR_TOKEN_BRIDGE_ACCOUNT,
  SOLANA_HOST,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
  WORMHOLE_RPC_HOSTS,
  SEI_NATIVE_DENOM,
} from "../utils/consts";
import {
  attestNearFromNear,
  attestTokenFromNear,
  getEmitterAddressNear,
  makeNearAccount,
  parseSequenceFromLogNear,
  signAndSendTransactions,
} from "../utils/near";
import parseError from "../utils/parseError";
import { signSendAndConfirm } from "../utils/solana";
import { postWithFees, waitForTerraExecution } from "../utils/terra";
import { postWithFeesXpla, waitForXplaExecution } from "../utils/xpla";
import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";
import { useTerraWallet } from "../contexts/TerraWalletContext";
import { TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import { XplaWallet } from "@xlabs-libs/wallet-aggregator-xpla";
import { useXplaWallet } from "../contexts/XplaWalletContext";
import { SuiWallet } from "@xlabs-libs/wallet-aggregator-sui";
import { getSuiProvider } from "../utils/sui";

import {
  getEmitterAddressAndSequenceFromResponseSui,
  getOriginalPackageId,
} from "@certusone/wormhole-sdk/lib/cjs/sui";
import { useSuiWallet } from "../contexts/SuiWalletContext";
import { useSeiWallet } from "../contexts/SeiWalletContext";
import { SeiWallet } from "@xlabs-libs/wallet-aggregator-sei";
import {
  calculateFeeForContractExecution,
  parseSequenceFromLogSei,
} from "../utils/sei";
import { SuiTransactionBlockResponse } from "@mysten/sui.js";
import { telemetry, TelemetryTxEvent } from "../utils/telemetry";

async function algo(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: AlgorandWallet,
  sourceAsset: string,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const algodClient = new algosdk.Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const txs = await attestFromAlgorand(
      algodClient as any,
      ALGORAND_TOKEN_BRIDGE_ID,
      ALGORAND_BRIDGE_ID,
      wallet.getAddress()!,
      BigInt(sourceAsset)
    );
    const result = await signSendAndConfirmAlgorand(wallet, algodClient, txs);
    const sequence = parseSequenceFromLogAlgorand(result);
    const txId = txs[txs.length - 1].tx.txID();
    onStart?.({ txId });
    // TODO: fill these out correctly
    dispatch(
      setAttestTx({
        id: txId,
        block: result["confirmed-round"],
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const emitterAddress = getEmitterAddressAlgorand(ALGORAND_TOKEN_BRIDGE_ID);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_ALGORAND,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function aptos(
  dispatch: any,
  enqueueSnackbar: any,
  sourceAsset: string,
  wallet: AptosWallet,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_APTOS);
  try {
    const attestPayload = attestFromAptos(
      tokenBridgeAddress,
      CHAIN_ID_APTOS,
      sourceAsset
    );
    const hash = await waitForSignAndSubmitTransaction(attestPayload, wallet);
    onStart?.({ txId: hash });
    dispatch(setAttestTx({ id: hash, block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const result = (await getAptosClient().waitForTransactionWithResult(
      hash
    )) as Types.UserTransaction;
    const { emitterAddress, sequence } =
      getEmitterAddressAndSequenceFromResult(result);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_APTOS,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  sourceAsset: string,
  chainId: ChainId,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    // Klaytn requires specifying gasPrice
    const overrides =
      chainId === CHAIN_ID_KLAYTN
        ? { gasPrice: (await signer.getGasPrice()).toString() }
        : {};
    const receipt = await attestFromEth(
      getTokenBridgeAddressForChain(chainId),
      signer,
      sourceAsset,
      overrides
    );
    onStart?.({ txId: receipt.transactionHash });
    dispatch(
      setAttestTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogEth(
      receipt,
      getBridgeAddressForChain(chainId)
    );
    const emitterAddress = getEmitterAddressEth(
      getTokenBridgeAddressForChain(chainId)
    );
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      chainId,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function near(
  dispatch: any,
  enqueueSnackbar: any,
  senderAddr: string,
  sourceAsset: string,
  wallet: NearWallet,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const account = await makeNearAccount(senderAddr);
    const msgs =
      sourceAsset === NATIVE_NEAR_PLACEHOLDER
        ? await attestNearFromNear(
            account,
            NEAR_CORE_BRIDGE_ACCOUNT,
            NEAR_TOKEN_BRIDGE_ACCOUNT
          )
        : await attestTokenFromNear(
            account,
            NEAR_CORE_BRIDGE_ACCOUNT,
            NEAR_TOKEN_BRIDGE_ACCOUNT,
            sourceAsset
          );
    const receipt = await signAndSendTransactions(account, wallet, msgs);
    const sequence = parseSequenceFromLogNear(receipt);
    onStart?.({ txId: receipt.transaction_outcome.id });
    dispatch(
      setAttestTx({
        id: receipt.transaction_outcome.id,
        block: 0,
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const emitterAddress = getEmitterAddressNear(NEAR_TOKEN_BRIDGE_ACCOUNT);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_NEAR,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function xpla(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: XplaWallet,
  asset: string,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_XPLA);
    const msg = attestFromXpla(tokenBridgeAddress, wallet.getAddress()!, asset);
    const result = await postWithFeesXpla(wallet, [msg], "Create Wrapped");
    const info = await waitForXplaExecution(result);
    onStart?.({ txId: info.txhash });
    dispatch(setAttestTx({ id: info.txhash, block: info.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogXpla(info);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressXpla(tokenBridgeAddress);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_XPLA,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function solana(
  dispatch: any,
  enqueueSnackbar: any,
  solPK: PublicKey,
  sourceAsset: string,
  wallet: SolanaWallet,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const connection = new Connection(SOLANA_HOST, "confirmed");
    const transaction = await attestFromSolana(
      connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      solPK,
      sourceAsset
    );
    const txid = await signSendAndConfirm(wallet, transaction);
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const info = await connection.getTransaction(txid);
    if (!info) {
      // TODO: error state
      throw new Error("An error occurred while fetching the transaction info");
    }
    onStart?.({ txId: txid });
    dispatch(setAttestTx({ id: txid, block: info.slot }));
    const sequence = parseSequenceFromLogSolana(info);
    const emitterAddress = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_SOLANA,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: TerraWallet,
  asset: string,
  feeDenom: string,
  chainId: TerraChainId,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const tokenBridgeAddress = getTokenBridgeAddressForChain(chainId);
    const msg = await attestFromTerra(
      tokenBridgeAddress,
      wallet.getAddress()!,
      asset
    );
    const result = await postWithFees(
      wallet,
      [msg],
      "Create Wrapped",
      [feeDenom],
      chainId
    );
    const info = await waitForTerraExecution(result, chainId);
    onStart?.({ txId: info.txhash });
    dispatch(setAttestTx({ id: info.txhash, block: info.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogTerra(info);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressTerra(tokenBridgeAddress);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      chainId,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function sui(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SuiWallet,
  asset: string,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const provider = getSuiProvider();
    const tx = await attestFromSui(
      provider,
      getBridgeAddressForChain(CHAIN_ID_SUI),
      getTokenBridgeAddressForChain(CHAIN_ID_SUI),
      asset
    );
    const response = (
      await wallet.signAndSendTransaction({
        transactionBlock: tx,
        options: {
          showEvents: true,
        },
      })
    ).data as SuiTransactionBlockResponse;
    if (!response) {
      throw new Error("Error parsing transaction results");
    }
    onStart?.({ txId: response.digest });
    dispatch(
      setAttestTx({
        id: response.digest,
        block: Number(response.checkpoint || 0),
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const coreBridgePackageId = await getOriginalPackageId(
      provider,
      getBridgeAddressForChain(CHAIN_ID_SUI)
    );
    if (!coreBridgePackageId)
      throw new Error("Unable to retrieve original package id");
    const { sequence, emitterAddress } =
      getEmitterAddressAndSequenceFromResponseSui(
        coreBridgePackageId,
        response
      );
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_SUI,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

async function sei(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SeiWallet,
  asset: string,
  onError: (error: any) => void,
  onStart: (extra?: Partial<TelemetryTxEvent>) => void
) {
  dispatch(setIsSending(true));
  try {
    const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_SEI);
    const nonce = Math.round(Math.random() * 100000);
    const msg = {
      create_asset_meta: {
        asset_info:
          asset === SEI_NATIVE_DENOM
            ? { native_token: { denom: asset } }
            : { token: { contract_addr: asset } },
        nonce,
      },
    };
    const instructions = [{ contractAddress: tokenBridgeAddress, msg }];
    const memo = "Wormhole - Attest Token";
    const fee = await calculateFeeForContractExecution(
      instructions,
      wallet,
      memo
    );
    const tx = await wallet.executeMultiple({
      instructions,
      fee,
      memo,
    });
    onStart?.({ txId: tx.id });
    dispatch(setAttestTx({ id: tx.id, block: tx.data!.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogSei(tx.data!);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressTerra(tokenBridgeAddress);
    enqueueSnackbar(null, {
      content: <Alert severity="info">Fetching VAA</Alert>,
    });
    const { vaaBytes } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_SEI,
      emitterAddress,
      sequence
    );
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } catch (e) {
    console.error(e);
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
    onError(e);
  }
}

export function useHandleAttest() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const sourceChain = useSelector(selectAttestSourceChain);
  const targetChain = useSelector(selectAttestTargetChain);
  const sourceAsset = useSelector(selectAttestSourceAsset);
  const isTargetComplete = useSelector(selectAttestIsTargetComplete);
  const isSending = useSelector(selectAttestIsSending);
  const isSendComplete = useSelector(selectAttestIsSendComplete);
  const { signer } = useEthereumProvider(sourceChain as any);
  const { publicKey: solPK, wallet: solanaWallet } = useSolanaWallet();
  const { walletAddress: terraAddress, wallet: terraWallet } = useTerraWallet(
    sourceChain as any
  );
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const xplaWallet = useXplaWallet();
  const { address: algoAccount, wallet: algoWallet } = useAlgorandWallet();
  const { account: aptosAddress, wallet: aptosWallet } = useAptosContext();
  const { accountId: nearAccountId, wallet } = useNearContext();
  const seiWallet = useSeiWallet();
  const seiAddress = seiWallet?.getAddress();
  const suiWallet = useSuiWallet();
  const disabled = !isTargetComplete || isSending || isSendComplete;
  const handleAttestClick = useCallback(() => {
    const telemetryProps: TelemetryTxEvent = {
      fromChainId: sourceChain,
      toChainId: targetChain,
      fromTokenSymbol: undefined,
      toTokenSymbol: undefined,
      fromTokenAddress: sourceAsset,
      toTokenAddress: undefined,
      amount: undefined,
    };
    telemetry.on.transferInit(telemetryProps);

    const onError = (error: any) => {
      telemetry.on.error({ ...telemetryProps, error });
    };

    const onStart = (extra?: Partial<TelemetryTxEvent>) => {
      telemetry.on.transferStart({ ...telemetryProps, ...extra });
    };

    if (isEVMChain(sourceChain) && !!signer) {
      evm(
        dispatch,
        enqueueSnackbar,
        signer,
        sourceAsset,
        sourceChain,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_SOLANA && !!solanaWallet && !!solPK) {
      solana(
        dispatch,
        enqueueSnackbar,
        new PublicKey(solPK),
        sourceAsset,
        solanaWallet,
        onError,
        onStart
      );
    } else if (isTerraChain(sourceChain) && !!terraAddress && terraWallet) {
      terra(
        dispatch,
        enqueueSnackbar,
        terraWallet,
        sourceAsset,
        terraFeeDenom,
        sourceChain,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_XPLA && !!xplaWallet) {
      xpla(
        dispatch,
        enqueueSnackbar,
        xplaWallet,
        sourceAsset,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_ALGORAND && algoAccount) {
      algo(
        dispatch,
        enqueueSnackbar,
        algoWallet,
        sourceAsset,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_APTOS && aptosAddress) {
      aptos(
        dispatch,
        enqueueSnackbar,
        sourceAsset,
        aptosWallet!,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_NEAR && nearAccountId && wallet) {
      near(
        dispatch,
        enqueueSnackbar,
        nearAccountId,
        sourceAsset,
        wallet,
        onError,
        onStart
      );
    } else if (sourceChain === CHAIN_ID_SEI && seiWallet && seiAddress) {
      sei(dispatch, enqueueSnackbar, seiWallet, sourceAsset, onError, onStart);
    } else if (
      sourceChain === CHAIN_ID_SUI &&
      suiWallet?.isConnected() &&
      suiWallet.getAddress()
    ) {
      sui(dispatch, enqueueSnackbar, suiWallet, sourceAsset, onError, onStart);
    }
  }, [
    sourceChain,
    targetChain,
    sourceAsset,
    signer,
    solanaWallet,
    solPK,
    terraAddress,
    terraWallet,
    xplaWallet,
    algoAccount,
    aptosAddress,
    nearAccountId,
    wallet,
    seiWallet,
    seiAddress,
    suiWallet,
    dispatch,
    enqueueSnackbar,
    terraFeeDenom,
    algoWallet,
    aptosWallet,
  ]);
  return useMemo(
    () => ({
      handleClick: handleAttestClick,
      disabled,
      showLoader: isSending,
    }),
    [handleAttestClick, disabled, isSending]
  );
}

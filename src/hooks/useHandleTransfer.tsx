import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  createNonce,
  getEmitterAddressAlgorand,
  getEmitterAddressEth,
  getEmitterAddressInjective,
  getEmitterAddressSolana,
  getEmitterAddressTerra,
  getEmitterAddressXpla,
  hexToUint8Array,
  isEVMChain,
  isTerraChain,
  parseSequenceFromLogAlgorand,
  parseSequenceFromLogEth,
  parseSequenceFromLogInjective,
  parseSequenceFromLogSolana,
  parseSequenceFromLogTerra,
  parseSequenceFromLogXpla,
  TerraChainId,
  transferFromAlgorand,
  transferFromEth,
  transferFromEthNative,
  transferFromInjective,
  transferFromSolana,
  transferFromTerra,
  transferFromXpla,
  transferNativeSol,
  uint8ArrayToHex,
  transferFromSui,
  CHAIN_ID_SUI,
  CHAIN_ID_ETH,
  CHAIN_ID_POLYGON,
} from "@certusone/wormhole-sdk";
import { transferTokens } from "@certusone/wormhole-sdk/lib/esm/aptos/api/tokenBridge";
import { CHAIN_ID_NEAR } from "@certusone/wormhole-sdk/lib/esm";
import { Alert } from "@material-ui/lab";
import { Connection } from "@solana/web3.js";
import algosdk from "algosdk";
import { Types } from "aptos";
import { BigNumber, Contract, Signer } from "ethers";
import { arrayify, parseUnits, zeroPad } from "ethers/lib/utils";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlgorandWallet } from "../contexts/AlgorandWalletContext";
import { useAptosContext } from "../contexts/AptosWalletContext";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import {
  selectTerraFeeDenom,
  selectTransferAmount,
  selectTransferIsSendComplete,
  selectTransferIsSending,
  selectTransferIsTargetComplete,
  selectTransferOriginAsset,
  selectTransferOriginChain,
  selectTransferRelayerFee,
  selectTransferSourceAsset,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetChain,
  selectTransferThreshold,
} from "../store/selectors";
import {
  Threshold,
  setIsSending,
  setIsVAAPending,
  setSignedVAAHex,
  setTransferTx,
} from "../store/transferSlice";
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
  THRESHOLD_ARBITER_FEE,
  THRESHOLD_NONCE,
  THRESHOLD_GATEWAYS,
} from "../utils/consts";
import { getSignedVAAWithRetry } from "../utils/getSignedVAAWithRetry";
import {
  getEmitterAddressNear,
  makeNearAccount,
  parseSequenceFromLogNear,
  signAndSendTransactions,
  transferNearFromNear,
  transferTokenFromNear,
} from "../utils/near";
import parseError from "../utils/parseError";
import { signSendAndConfirm } from "../utils/solana";
import { postWithFees, waitForTerraExecution } from "../utils/terra";
import useTransferTargetAddressHex from "./useTransferTargetAddress";
import { postWithFeesXpla, waitForXplaExecution } from "../utils/xpla";
import { broadcastInjectiveTx } from "../utils/injective";
import { useInjectiveContext } from "../contexts/InjectiveWalletContext";
import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import { InjectiveWallet } from "@xlabs-libs/wallet-aggregator-injective";
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";
import { useTerraWallet } from "../contexts/TerraWalletContext";
import { TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import { useXplaWallet } from "../contexts/XplaWalletContext";
import { XplaWallet } from "@xlabs-libs/wallet-aggregator-xpla";
import { SuiWallet } from "@xlabs-libs/wallet-aggregator-sui";
import { getSuiProvider } from "../utils/sui";
import {
  getEmitterAddressAndSequenceFromResponseSui,
  getOriginalPackageId,
} from "@certusone/wormhole-sdk/lib/cjs/sui";
import { useSuiWallet } from "../contexts/SuiWalletContext";
import { ThresholdL2WormholeGateway } from "../utils/ThresholdL2WormholeGateway";
import { useTargetInfo } from "../components/Transfer/Target";

async function fetchSignedVAA(
  chainId: ChainId,
  emitterAddress: string,
  sequence: string,
  enqueueSnackbar: any,
  dispatch: any
) {
  enqueueSnackbar(null, {
    content: <Alert severity="info">Fetching VAA</Alert>,
  });
  const { vaaBytes, isPending } = await getSignedVAAWithRetry(
    chainId,
    emitterAddress,
    sequence
  );
  if (vaaBytes !== undefined) {
    dispatch(setSignedVAAHex(uint8ArrayToHex(vaaBytes)));
    dispatch(setIsVAAPending(false));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Fetched Signed VAA</Alert>,
    });
  } else if (isPending) {
    dispatch(setIsVAAPending(isPending));
    enqueueSnackbar(null, {
      content: <Alert severity="warning">VAA is Pending</Alert>,
    });
  } else {
    throw new Error("Error retrieving VAA info");
  }
}

function handleError(e: any, enqueueSnackbar: any, dispatch: any) {
  console.error(e);
  enqueueSnackbar(null, {
    content: <Alert severity="error">{parseError(e)}</Alert>,
  });
  dispatch(setIsSending(false));
  dispatch(setIsVAAPending(false));
}

async function algo(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: AlgorandWallet,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  chainId: ChainId,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const algodClient = new algosdk.Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const txs = await transferFromAlgorand(
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      ALGORAND_BRIDGE_ID,
      wallet.getAddress()!,
      BigInt(tokenAddress),
      transferAmountParsed.toBigInt(),
      uint8ArrayToHex(recipientAddress),
      recipientChain,
      feeParsed.toBigInt()
    );
    const result = await signSendAndConfirmAlgorand(wallet, algodClient, txs);
    const sequence = parseSequenceFromLogAlgorand(result);
    dispatch(
      setTransferTx({
        id: txs[txs.length - 1].tx.txID(),
        block: result["confirmed-round"],
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const emitterAddress = getEmitterAddressAlgorand(ALGORAND_TOKEN_BRIDGE_ID);
    await fetchSignedVAA(
      chainId,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function aptos(
  dispatch: any,
  enqueueSnackbar: any,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  chainId: ChainId,
  wallet: AptosWallet,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_APTOS);
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const transferPayload = transferTokens(
      tokenBridgeAddress,
      tokenAddress,
      transferAmountParsed.toString(),
      recipientChain,
      recipientAddress,
      feeParsed.toString(),
      createNonce().readUInt32LE(0)
    );
    const hash = await waitForSignAndSubmitTransaction(transferPayload, wallet);
    dispatch(setTransferTx({ id: hash, block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const result = (await getAptosClient().waitForTransactionWithResult(
      hash
    )) as Types.UserTransaction;
    const { emitterAddress, sequence } =
      getEmitterAddressAndSequenceFromResult(result);
    await fetchSignedVAA(
      chainId,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsSending(false));
  }
}

// Threshold normalize amounts

function normalizeAmount(amount: BigNumber, decimals: number): BigNumber {
  if (decimals > 8) {
    amount = amount.div(BigNumber.from(10).pow(decimals - 8));
  }
  return amount;
}

function deNormalizeAmount(amount: BigNumber, decimals: number): BigNumber {
  if (decimals > 8) {
    amount = amount.mul(BigNumber.from(10).pow(decimals - 8));
  }
  return amount;
}

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  isNative: boolean,
  chainId: ChainId,
  relayerFee?: string,
  thresholdData?: Threshold,
  readableTargetAddress?: string
) {
  dispatch(setIsSending(true));

  try {
    // THRESHOLD TBTC FLOW
    const threshold = thresholdData;

    if (threshold?.isTBTC) {
      console.log("IS TBTC!");

      const isEthSource = chainId === CHAIN_ID_ETH;
      const isEthTarget = recipientChain === CHAIN_ID_ETH;
      const isCanonicalSource = Object.keys(THRESHOLD_GATEWAYS).includes(
        `${chainId}`
      );
      const isCanonicalTarget = Object.keys(THRESHOLD_GATEWAYS).includes(
        `${recipientChain}`
      );

      const baseAmountParsed = parseUnits(amount, decimals);
      const relayerFeeParsed = parseUnits(relayerFee || "0", decimals);
      const transferAmountParsed = baseAmountParsed.add(relayerFeeParsed);

      if (isEthSource && isCanonicalTarget) {
        const targetAddress = THRESHOLD_GATEWAYS[recipientChain];
        console.log("Ethereum to Canonical");

        const tokenBridgeAddress = getTokenBridgeAddressForChain(chainId);
        const payload = recipientAddress;

        const receipt = await transferFromEth(
          tokenBridgeAddress,
          signer,
          tokenAddress,
          transferAmountParsed,
          recipientChain,
          zeroPad(arrayify(targetAddress), 32),
          relayerFeeParsed,
          {},
          zeroPad(arrayify(payload), 32)
        );

        console.log({ receipt });

        dispatch(
          setTransferTx({
            id: receipt.transactionHash,
            block: receipt.blockNumber,
          })
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

        await fetchSignedVAA(
          chainId,
          emitterAddress,
          sequence,
          enqueueSnackbar,
          dispatch
        );
      }

      if (isCanonicalSource && (isCanonicalTarget || isEthTarget)) {
        const sourceAddress = THRESHOLD_GATEWAYS[chainId].toLowerCase();
        console.log("Canonical to ", isCanonicalTarget ? "Canonical" : "ETH");

        try {
          const L2WormholeGateway = new Contract(
            sourceAddress,
            ThresholdL2WormholeGateway,
            signer
          );

          console.log("SEND TBTC?!?");

          const amountNormalizeAmount = deNormalizeAmount(
            normalizeAmount(transferAmountParsed, decimals),
            decimals
          );

          console.log({
            signer,
            transferAmountParsed,
            amountNormalizeAmount,
            recipientChain,
            readableTargetAddress,
          });

          console.log(
            "zeroPad(arrayify(targetAddress), 32)"
            // zeroPad(arrayify(targetAddress), 32)
          );

          const estimateGas = await L2WormholeGateway.estimateGas.sendTbtc(
            amountNormalizeAmount,
            recipientChain,
            zeroPad(arrayify(readableTargetAddress!), 32),
            THRESHOLD_ARBITER_FEE,
            THRESHOLD_NONCE
          );

          // We increase the gas limit estimation here by a factor of 10% to account for
          // some faulty public JSON-RPC endpoints.
          const gasLimit = estimateGas.mul(1100).div(1000);
          const overrides = {
            gasLimit,
            // We use the legacy tx envelope here to avoid triggering gas price autodetection using EIP1559 for polygon.
            // EIP1559 is not actually implemented in polygon. The node is only API compatible but this breaks some clients
            // like ethers when choosing fees automatically.
            ...(chainId === CHAIN_ID_POLYGON && { type: 0 }),
          };

          console.log("sendTbtc overrides", { overrides });

          const tx = await L2WormholeGateway.sendTbtc(
            amountNormalizeAmount,
            recipientChain,
            zeroPad(arrayify(readableTargetAddress!), 32),
            THRESHOLD_ARBITER_FEE,
            THRESHOLD_NONCE,
            overrides
          );

          const receipt = await tx.wait();
          console.log({ receipt });

          dispatch(
            setTransferTx({
              id: receipt.transactionHash,
              block: receipt.blockNumber,
            })
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

          console.log({ sequence, emitterAddress });

          await fetchSignedVAA(
            chainId,
            emitterAddress,
            sequence,
            enqueueSnackbar,
            dispatch
          );
        } catch (e) {
          console.error(parseError(e));
        }
      }
    } else {
      const baseAmountParsed = parseUnits(amount, decimals);
      const feeParsed = parseUnits(relayerFee || "0", decimals);
      const transferAmountParsed = baseAmountParsed.add(feeParsed);
      // Klaytn requires specifying gasPrice
      const overrides =
        chainId === CHAIN_ID_KLAYTN
          ? { gasPrice: (await signer.getGasPrice()).toString() }
          : {};
      const receipt = isNative
        ? await transferFromEthNative(
            getTokenBridgeAddressForChain(chainId),
            signer,
            transferAmountParsed,
            recipientChain,
            recipientAddress,
            feeParsed,
            overrides
          )
        : await transferFromEth(
            getTokenBridgeAddressForChain(chainId),
            signer,
            tokenAddress,
            transferAmountParsed,
            recipientChain,
            recipientAddress,
            feeParsed,
            overrides
          );
      dispatch(
        setTransferTx({
          id: receipt.transactionHash,
          block: receipt.blockNumber,
        })
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
      await fetchSignedVAA(
        chainId,
        emitterAddress,
        sequence,
        enqueueSnackbar,
        dispatch
      );
    }
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function near(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: NearWallet,
  senderAddr: string,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  chainId: ChainId,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const account = await makeNearAccount(senderAddr);
    const msgs =
      tokenAddress === NATIVE_NEAR_PLACEHOLDER
        ? await transferNearFromNear(
            account,
            NEAR_CORE_BRIDGE_ACCOUNT,
            NEAR_TOKEN_BRIDGE_ACCOUNT,
            transferAmountParsed.toBigInt(),
            recipientAddress,
            recipientChain,
            feeParsed.toBigInt()
          )
        : await transferTokenFromNear(
            account,
            NEAR_CORE_BRIDGE_ACCOUNT,
            NEAR_TOKEN_BRIDGE_ACCOUNT,
            tokenAddress,
            transferAmountParsed.toBigInt(),
            recipientAddress,
            recipientChain,
            feeParsed.toBigInt()
          );
    const receipt = await signAndSendTransactions(account, wallet, msgs);
    const sequence = parseSequenceFromLogNear(receipt);
    dispatch(
      setTransferTx({
        id: receipt.transaction_outcome.id,
        block: 0,
      })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const emitterAddress = getEmitterAddressNear(NEAR_TOKEN_BRIDGE_ACCOUNT);
    await fetchSignedVAA(
      chainId,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function xpla(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: XplaWallet,
  asset: string,
  amount: string,
  decimals: number,
  targetChain: ChainId,
  targetAddress: Uint8Array,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_XPLA);
    const msgs = await transferFromXpla(
      wallet.getAddress()!,
      tokenBridgeAddress,
      asset,
      transferAmountParsed.toString(),
      targetChain,
      targetAddress,
      feeParsed.toString()
    );

    const result = await postWithFeesXpla(
      wallet,
      msgs,
      "Wormhole - Initiate Transfer"
    );

    const info = await waitForXplaExecution(result);
    dispatch(setTransferTx({ id: info.txhash, block: info.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogXpla(info);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressXpla(tokenBridgeAddress);
    await fetchSignedVAA(
      CHAIN_ID_XPLA,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function solana(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SolanaWallet,
  payerAddress: string, //TODO: we may not need this since we have wallet
  fromAddress: string,
  mintAddress: string,
  amount: string,
  decimals: number,
  targetChain: ChainId,
  targetAddress: Uint8Array,
  isNative: boolean,
  originAddressStr?: string,
  originChain?: ChainId,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const connection = new Connection(SOLANA_HOST, "confirmed");
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const originAddress = originAddressStr
      ? zeroPad(hexToUint8Array(originAddressStr), 32)
      : undefined;
    const promise = isNative
      ? transferNativeSol(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          transferAmountParsed.toBigInt(),
          targetAddress,
          targetChain,
          feeParsed.toBigInt()
        )
      : transferFromSolana(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          fromAddress,
          mintAddress,
          transferAmountParsed.toBigInt(),
          targetAddress,
          targetChain,
          originAddress,
          originChain,
          undefined,
          feeParsed.toBigInt()
        );
    const transaction = await promise;
    const txid = await signSendAndConfirm(wallet, transaction);
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const info = await connection.getTransaction(txid);
    if (!info) {
      throw new Error("An error occurred while fetching the transaction info");
    }
    dispatch(setTransferTx({ id: txid, block: info.slot }));
    const sequence = parseSequenceFromLogSolana(info);
    const emitterAddress = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
    await fetchSignedVAA(
      CHAIN_ID_SOLANA,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function terra(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: TerraWallet,
  asset: string,
  amount: string,
  decimals: number,
  targetChain: ChainId,
  targetAddress: Uint8Array,
  feeDenom: string,
  chainId: TerraChainId,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const tokenBridgeAddress = getTokenBridgeAddressForChain(chainId);
    const msgs = await transferFromTerra(
      wallet.getAddress()!,
      tokenBridgeAddress,
      asset,
      transferAmountParsed.toString(),
      targetChain,
      targetAddress,
      feeParsed.toString()
    );

    const result = await postWithFees(
      wallet,
      msgs,
      "Wormhole - Initiate Transfer",
      [feeDenom],
      chainId
    );

    const info = await waitForTerraExecution(result, chainId);
    dispatch(setTransferTx({ id: info.txhash, block: info.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogTerra(info);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressTerra(tokenBridgeAddress);
    await fetchSignedVAA(
      chainId,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function injective(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: InjectiveWallet,
  walletAddress: string,
  asset: string,
  amount: string,
  decimals: number,
  targetChain: ChainId,
  targetAddress: Uint8Array,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const tokenBridgeAddress =
      getTokenBridgeAddressForChain(CHAIN_ID_INJECTIVE);
    const msgs = await transferFromInjective(
      walletAddress,
      tokenBridgeAddress,
      asset,
      transferAmountParsed.toString(),
      targetChain,
      targetAddress,
      feeParsed.toString()
    );
    const tx = await broadcastInjectiveTx(
      wallet,
      walletAddress,
      msgs,
      "Wormhole - Initiate Transfer"
    );
    dispatch(setTransferTx({ id: tx.txHash, block: tx.height }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
    const sequence = parseSequenceFromLogInjective(tx);
    if (!sequence) {
      throw new Error("Sequence not found");
    }
    const emitterAddress = await getEmitterAddressInjective(tokenBridgeAddress);
    await fetchSignedVAA(
      CHAIN_ID_INJECTIVE,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

async function sui(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SuiWallet,
  asset: string,
  amount: string,
  decimals: number,
  targetChain: ChainId,
  targetAddress: Uint8Array,
  relayerFee?: string
) {
  dispatch(setIsSending(true));
  try {
    const address = wallet.getAddress();
    if (!address) {
      throw new Error("No wallet address");
    }
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const provider = getSuiProvider();
    // TODO: handle pagination
    const coins = (
      await provider.getCoins({
        owner: address,
        coinType: asset,
      })
    ).data;
    const tx = await transferFromSui(
      provider,
      getBridgeAddressForChain(CHAIN_ID_SUI),
      getTokenBridgeAddressForChain(CHAIN_ID_SUI),
      coins,
      asset,
      transferAmountParsed.toBigInt(),
      targetChain,
      targetAddress
    );
    const response = (
      await wallet.signAndSendTransaction({
        transactionBlock: tx,
        options: {
          showEvents: true,
        },
      })
    ).data;
    if (!response) {
      throw new Error("Error parsing transaction results");
    }
    dispatch(
      setTransferTx({
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
    await fetchSignedVAA(
      CHAIN_ID_SUI,
      emitterAddress,
      sequence,
      enqueueSnackbar,
      dispatch
    );
  } catch (e) {
    handleError(e, enqueueSnackbar, dispatch);
  }
}

export function useHandleTransfer() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { readableTargetAddress } = useTargetInfo();
  const sourceChain = useSelector(selectTransferSourceChain);
  const sourceAsset = useSelector(selectTransferSourceAsset);
  const originChain = useSelector(selectTransferOriginChain);
  const originAsset = useSelector(selectTransferOriginAsset);
  const amount = useSelector(selectTransferAmount);
  const targetChain = useSelector(selectTransferTargetChain);
  const targetAddress = useTransferTargetAddressHex();
  const isTargetComplete = useSelector(selectTransferIsTargetComplete);
  const isSending = useSelector(selectTransferIsSending);
  const isSendComplete = useSelector(selectTransferIsSendComplete);
  const thresholdData = useSelector(selectTransferThreshold);
  const { signer } = useEthereumProvider(sourceChain);
  const { wallet: solanaWallet, publicKey: solPK } = useSolanaWallet();
  const { wallet: terraWallet } = useTerraWallet(sourceChain);
  const terraFeeDenom = useSelector(selectTerraFeeDenom);
  const xplaWallet = useXplaWallet();
  const { address: algoAccount, wallet: algoWallet } = useAlgorandWallet();
  const { accountId: nearAccountId, wallet } = useNearContext();
  const { account: aptosAddress, wallet: aptosWallet } = useAptosContext();
  const { wallet: injWallet, address: injAddress } = useInjectiveContext();
  const suiWallet = useSuiWallet();
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const relayerFee = useSelector(selectTransferRelayerFee);

  const sourceTokenPublicKey = sourceParsedTokenAccount?.publicKey;
  const decimals = sourceParsedTokenAccount?.decimals;
  const isNative = sourceParsedTokenAccount?.isNativeAsset || false;
  const disabled = !isTargetComplete || isSending || isSendComplete;

  const handleTransferClick = useCallback(() => {
    // TODO: we should separate state for transaction vs fetching vaa
    if (
      isEVMChain(sourceChain) &&
      !!signer &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      evm(
        dispatch,
        enqueueSnackbar,
        signer,
        sourceAsset,
        decimals,
        amount,
        targetChain,
        targetAddress,
        isNative,
        sourceChain,
        relayerFee,
        thresholdData,
        readableTargetAddress
      );
    } else if (
      sourceChain === CHAIN_ID_SOLANA &&
      !!solanaWallet &&
      !!solPK &&
      !!sourceAsset &&
      !!sourceTokenPublicKey &&
      !!targetAddress &&
      decimals !== undefined
    ) {
      solana(
        dispatch,
        enqueueSnackbar,
        solanaWallet,
        solPK,
        sourceTokenPublicKey,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        isNative,
        originAsset,
        originChain,
        relayerFee
      );
    } else if (
      isTerraChain(sourceChain) &&
      !!terraWallet &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      terra(
        dispatch,
        enqueueSnackbar,
        terraWallet,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        terraFeeDenom,
        sourceChain,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_XPLA &&
      !!xplaWallet &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      xpla(
        dispatch,
        enqueueSnackbar,
        xplaWallet,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_ALGORAND &&
      algoAccount &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      algo(
        dispatch,
        enqueueSnackbar,
        algoWallet,
        sourceAsset,
        decimals,
        amount,
        targetChain,
        targetAddress,
        sourceChain,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_NEAR &&
      nearAccountId &&
      wallet &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      near(
        dispatch,
        enqueueSnackbar,
        wallet,
        nearAccountId,
        sourceAsset,
        decimals,
        amount,
        targetChain,
        targetAddress,
        sourceChain,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_APTOS &&
      aptosAddress &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      aptos(
        dispatch,
        enqueueSnackbar,
        sourceAsset,
        decimals,
        amount,
        targetChain,
        targetAddress,
        sourceChain,
        aptosWallet!,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_INJECTIVE &&
      injWallet &&
      injAddress &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      injective(
        dispatch,
        enqueueSnackbar,
        injWallet,
        injAddress,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        relayerFee
      );
    } else if (
      sourceChain === CHAIN_ID_SUI &&
      suiWallet?.isConnected() &&
      suiWallet.getAddress() &&
      !!sourceAsset &&
      decimals !== undefined &&
      !!targetAddress
    ) {
      sui(
        dispatch,
        enqueueSnackbar,
        suiWallet,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        relayerFee
      );
    }
  }, [
    readableTargetAddress,
    sourceChain,
    signer,
    sourceAsset,
    decimals,
    targetAddress,
    solanaWallet,
    solPK,
    sourceTokenPublicKey,
    terraWallet,
    xplaWallet,
    algoAccount,
    nearAccountId,
    wallet,
    aptosAddress,
    injWallet,
    injAddress,
    suiWallet,
    dispatch,
    enqueueSnackbar,
    amount,
    targetChain,
    isNative,
    relayerFee,
    thresholdData,
    originAsset,
    originChain,
    terraFeeDenom,
    algoWallet,
    aptosWallet,
  ]);
  return useMemo(
    () => ({
      handleClick: handleTransferClick,
      disabled,
      showLoader: isSending,
    }),
    [handleTransferClick, disabled, isSending]
  );
}

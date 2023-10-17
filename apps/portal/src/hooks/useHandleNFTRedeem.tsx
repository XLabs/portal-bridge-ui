import {
  ChainId,
  CHAIN_ID_ACALA,
  CHAIN_ID_KARURA,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_SOLANA,
  getClaimAddressSolana,
  hexToUint8Array,
  isEVMChain,
  parseNFTPayload,
  parseVaa,
  postVaaSolanaWithRetry,
  CHAIN_ID_APTOS,
} from "@certusone/wormhole-sdk";
import {
  createMetaOnSolana,
  getForeignAssetSol,
  isNFTVAASolanaNative,
  redeemOnAptos,
  redeemOnEth,
  redeemOnSolana,
} from "@certusone/wormhole-sdk/lib/esm/nft_bridge";
import { arrayify } from "@ethersproject/bytes";
import { Alert } from "@material-ui/lab";
import { Connection } from "@solana/web3.js";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { Signer } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import { setIsRedeeming, setRedeemTx } from "../store/nftSlice";
import { selectNFTIsRedeeming, selectNFTTargetChain } from "../store/selectors";
import {
  ACALA_HOST,
  getNFTBridgeAddressForChain,
  KARURA_HOST,
  MAX_VAA_UPLOAD_RETRIES_SOLANA,
  SOLANA_HOST,
  SOL_BRIDGE_ADDRESS,
  SOL_NFT_BRIDGE_ADDRESS,
} from "../utils/consts";
import { getKaruraGasParams } from "../utils/karura";
import { getMetadataAddress } from "../utils/metaplex";
import parseError from "../utils/parseError";
import { signSendAndConfirm } from "../utils/solana";
import useNFTSignedVAA from "./useNFTSignedVAA";
import { waitForSignAndSubmitTransaction } from "../utils/aptos";
import { useAptosContext } from "../contexts/AptosWalletContext";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";

async function evm(
  dispatch: any,
  enqueueSnackbar: any,
  signer: Signer,
  signedVAA: Uint8Array,
  chainId: ChainId
) {
  dispatch(setIsRedeeming(true));
  try {
    const overrides =
      // Karura and Acala need gas params for NFT minting
      chainId === CHAIN_ID_KARURA
        ? await getKaruraGasParams(KARURA_HOST)
        : chainId === CHAIN_ID_ACALA
        ? await getKaruraGasParams(ACALA_HOST)
        : // Klaytn requires specifying gasPrice
        chainId === CHAIN_ID_KLAYTN
        ? { gasPrice: (await signer.getGasPrice()).toString() }
        : {};
    const receipt = await redeemOnEth(
      getNFTBridgeAddressForChain(chainId),
      signer,
      signedVAA,
      overrides
    );
    dispatch(
      setRedeemTx({ id: receipt.transactionHash, block: receipt.blockNumber })
    );
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsRedeeming(false));
  }
}

async function solana(
  dispatch: any,
  enqueueSnackbar: any,
  wallet: SolanaWallet,
  payerAddress: string, //TODO: we may not need this since we have wallet
  signedVAA: Uint8Array
) {
  dispatch(setIsRedeeming(true));
  try {
    if (!wallet.signTransaction) {
      throw new Error("wallet.signTransaction is undefined");
    }
    const connection = new Connection(SOLANA_HOST, "confirmed");
    const claimAddress = await getClaimAddressSolana(
      SOL_NFT_BRIDGE_ADDRESS,
      signedVAA
    );
    const claimInfo = await connection.getAccountInfo(claimAddress);
    let txid;
    if (!claimInfo) {
      await postVaaSolanaWithRetry(
        connection,
        wallet.signTransaction.bind(wallet),
        SOL_BRIDGE_ADDRESS,
        payerAddress,
        Buffer.from(signedVAA),
        MAX_VAA_UPLOAD_RETRIES_SOLANA
      );
      // TODO: how do we retry in between these steps
      const transaction = await redeemOnSolana(
        connection,
        SOL_BRIDGE_ADDRESS,
        SOL_NFT_BRIDGE_ADDRESS,
        payerAddress,
        signedVAA
      );
      txid = await signSendAndConfirm(wallet, transaction);
      // TODO: didn't want to make an info call we didn't need, can we get the block without it by modifying the above call?
    }
    const isNative = await isNFTVAASolanaNative(signedVAA);
    if (!isNative) {
      const parsedVAA = parseVaa(signedVAA);
      const { originChain, originAddress, tokenId } = parseNFTPayload(
        Buffer.from(new Uint8Array(parsedVAA.payload))
      );
      const mintAddress = await getForeignAssetSol(
        SOL_NFT_BRIDGE_ADDRESS,
        originChain as ChainId,
        hexToUint8Array(originAddress),
        arrayify(tokenId)
      );
      const [metadataAddress] = await getMetadataAddress(mintAddress);
      const metadata = await connection.getAccountInfo(metadataAddress);
      if (!metadata) {
        const transaction = await createMetaOnSolana(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_NFT_BRIDGE_ADDRESS,
          payerAddress,
          signedVAA
        );
        txid = await signSendAndConfirm(wallet, transaction);
      }
    }
    dispatch(setRedeemTx({ id: txid || "", block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsRedeeming(false));
  }
}

async function aptos(
  dispatch: any,
  enqueueSnackbar: any,
  signedVAA: Uint8Array,
  aptosWallet: AptosWallet
) {
  dispatch(setIsRedeeming(true));
  const nftBridgeAddress = getNFTBridgeAddressForChain(CHAIN_ID_APTOS);
  try {
    const msg = await redeemOnAptos(nftBridgeAddress, signedVAA);
    const result = await waitForSignAndSubmitTransaction(msg, aptosWallet);
    dispatch(setRedeemTx({ id: result, block: 1 }));
    enqueueSnackbar(null, {
      content: <Alert severity="success">Transaction confirmed</Alert>,
    });
  } catch (e) {
    enqueueSnackbar(null, {
      content: <Alert severity="error">{parseError(e)}</Alert>,
    });
    dispatch(setIsRedeeming(false));
  }
}

export function useHandleNFTRedeem() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const targetChain = useSelector(selectNFTTargetChain);
  const { publicKey: solPK, wallet: solanaWallet } = useSolanaWallet();
  const { signer } = useEthereumProvider(targetChain as any);
  const { account: aptosAccount, wallet: aptosWallet } = useAptosContext();
  const signedVAA = useNFTSignedVAA();
  const isRedeeming = useSelector(selectNFTIsRedeeming);
  const handleRedeemClick = useCallback(() => {
    if (isEVMChain(targetChain) && !!signer && signedVAA) {
      evm(dispatch, enqueueSnackbar, signer, signedVAA, targetChain);
    } else if (
      targetChain === CHAIN_ID_SOLANA &&
      !!solanaWallet &&
      !!solPK &&
      signedVAA
    ) {
      solana(dispatch, enqueueSnackbar, solanaWallet, solPK, signedVAA);
    } else if (
      targetChain === CHAIN_ID_APTOS &&
      !!aptosAccount &&
      !!aptosWallet &&
      signedVAA
    ) {
      aptos(dispatch, enqueueSnackbar, signedVAA, aptosWallet);
    }
  }, [
    dispatch,
    enqueueSnackbar,
    targetChain,
    signer,
    signedVAA,
    solanaWallet,
    solPK,
    aptosAccount,
    aptosWallet,
  ]);
  return useMemo(
    () => ({
      handleClick: handleRedeemClick,
      disabled: !!isRedeeming,
      showLoader: !!isRedeeming,
    }),
    [handleRedeemClick, isRedeeming]
  );
}

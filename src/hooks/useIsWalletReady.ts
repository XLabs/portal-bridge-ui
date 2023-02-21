import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  isEVMChain,
  isTerraChain,
} from "@certusone/wormhole-sdk";
import { useMemo } from "react";
import { useAlgorandWallet } from "../contexts/AlgorandWalletContext";
import {
  useEthereumProvider,
} from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { useSolanaWallet } from "../contexts/SolanaWalletContext";
import { APTOS_NETWORK, CLUSTER, getEvmChainId } from "../utils/consts";
import { useXplaWallet } from "../contexts/XplaWalletContext";
import { useAptosContext } from "../contexts/AptosWalletContext";
import { useInjectiveContext } from "../contexts/InjectiveWalletContext";
import { useTerraWallet } from "../contexts/TerraWalletContext";


const createWalletStatus = (
  isReady: boolean,
  statusMessage: string = "",
  walletAddress?: string
) => ({
  isReady,
  statusMessage,
  walletAddress,
});

function useIsWalletReady(
  chainId: ChainId,
  autoSwitch: boolean = true
): {
  isReady: boolean;
  statusMessage: string;
  walletAddress?: string;
} {
  const { publicKey: solPK } = useSolanaWallet();
  const terraWallet = useTerraWallet(chainId);
  const hasTerraWallet = !!terraWallet.wallet;
  const {
    provider,
    signerAddress,
    evmChainId,
    wallet: evmWallet
  } = useEthereumProvider(chainId);
  const hasEthInfo = !!provider && !!signerAddress;
  const correctEvmNetwork = getEvmChainId(chainId);
  const hasCorrectEvmNetwork = evmChainId === correctEvmNetwork;
  const { address: algoAccount } = useAlgorandWallet();
  const { accountId: nearPK } = useNearContext();
  const xplaWallet = useXplaWallet();
  const hasXplaWallet = !!xplaWallet;
  const { account: aptosAddress, network: aptosNetwork } = useAptosContext();
  const hasAptosWallet = !!aptosAddress;
  // The wallets do not all match on network names and the adapter doesn't seem to normalize this yet.
  // Petra = "Testnet"
  // Martian = "Testnet"
  // Pontam = "Aptos testnet"
  // Nightly = undefined... error on NightlyWallet.ts
  const hasCorrectAptosNetwork = aptosNetwork?.name
    ?.toLowerCase()
    .includes(APTOS_NETWORK.toLowerCase());
  const { address: injAddress } = useInjectiveContext();
  const hasInjWallet = !!injAddress;


  return useMemo(() => {
    if (isTerraChain(chainId) && hasTerraWallet && terraWallet?.walletAddress) {
      // TODO: terraWallet does not update on wallet changes
      return createWalletStatus(
        true,
        undefined,
        terraWallet.walletAddress
      );
    }
    if (chainId === CHAIN_ID_SOLANA && solPK) {
      return createWalletStatus(
        true,
        undefined,
        solPK
      );
    }
    if (chainId === CHAIN_ID_ALGORAND && algoAccount) {
      return createWalletStatus(true, undefined, algoAccount);
    }
    if (chainId === CHAIN_ID_NEAR && nearPK) {
      return createWalletStatus(true, undefined, nearPK);
    }
    if (
      chainId === CHAIN_ID_XPLA &&
      hasXplaWallet &&
      xplaWallet?.getAddress()
    ) {
      return createWalletStatus(
        true,
        undefined,
        xplaWallet.getAddress()
      );
    }
    if (chainId === CHAIN_ID_APTOS && hasAptosWallet && aptosAddress) {
      if (hasCorrectAptosNetwork) {
        return createWalletStatus(
          true,
          undefined,
          aptosAddress
        );
      } else {
        return createWalletStatus(
          false,
          `Wallet is not connected to ${APTOS_NETWORK}.`,
          undefined
        );
      }
    }
    if (chainId === CHAIN_ID_INJECTIVE && hasInjWallet && injAddress) {
      return createWalletStatus(
        true,
        undefined,
        injAddress
      );
    }
    if (isEVMChain(chainId) && hasEthInfo && signerAddress) {
      if (hasCorrectEvmNetwork) {
        return createWalletStatus(
          true,
          undefined,
          signerAddress
        );
      } else {
        if (autoSwitch && evmWallet) {
          evmWallet.switchChain(correctEvmNetwork!);
        }
        return createWalletStatus(
          false,
          `Wallet is not connected to ${CLUSTER}. Expected Chain ID: ${correctEvmNetwork}`,
          undefined
        );
      }
    }

    return createWalletStatus(
      false,
      "Wallet not connected",
      undefined
    );
  }, [
    chainId,
    hasTerraWallet,
    solPK,
    hasEthInfo,
    evmWallet,
    autoSwitch,
    correctEvmNetwork,
    hasCorrectEvmNetwork,
    signerAddress,
    terraWallet,
    algoAccount,
    nearPK,
    xplaWallet,
    hasXplaWallet,
    hasAptosWallet,
    aptosAddress,
    hasCorrectAptosNetwork,
    hasInjWallet,
    injAddress,
  ]);
}

export default useIsWalletReady;

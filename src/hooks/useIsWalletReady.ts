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
import { APTOS_NETWORK, CLUSTER, getEvmChainId } from "../utils/consts";
import { useWallet } from "../contexts/WalletContext";
import { EVMWallet } from "@xlabs-libs/wallet-aggregator-evm";

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
  const { wallet, address, connected, network } = useWallet(chainId);

  const correctEvmNetwork = getEvmChainId(chainId);

  let hasCorrectNetwork = true;
  if (isEVMChain(chainId)) {
    hasCorrectNetwork = correctEvmNetwork === network?.chainId;
  } else if (chainId === CHAIN_ID_APTOS) {
    // The wallets do not all match on network names and the adapter doesn't seem to normalize this yet.
    // Petra = "Testnet"
    // Martian = "Testnet"
    // Pontam = "Aptos testnet"
    // Nightly = undefined... error on NightlyWallet.ts
    hasCorrectNetwork = network?.name
      ?.toLowerCase()
      .includes(APTOS_NETWORK.toLowerCase());
  }

  return useMemo(() => {
    if (!wallet || !connected || !address) {
      return createWalletStatus(false, "Wallet not connected", undefined);
    }

    // no network check needed
    // TerraWallet does not update on wallet changes
    if (
      isTerraChain(chainId) ||
      chainId === CHAIN_ID_SOLANA ||
      chainId === CHAIN_ID_ALGORAND ||
      chainId === CHAIN_ID_NEAR ||
      chainId === CHAIN_ID_XPLA ||
      chainId === CHAIN_ID_INJECTIVE
    ) {
      return createWalletStatus(true, undefined, address);
    }

    if (isEVMChain(chainId)) {
      const evmWallet = wallet as EVMWallet;

      if (hasCorrectNetwork) {
        return createWalletStatus(true, undefined, address);
      } else {
        if (autoSwitch && evmWallet) {
          evmWallet.switchChain(correctEvmNetwork!).catch((err: any) => {
            // ignore "Resource unavailable" error when requesting switch multiple times
            if (err.code === -32002) {
              return Promise.resolve();
            }
            return Promise.reject(err);
          });
        }
        return createWalletStatus(
          false,
          `Wallet is not connected to ${CLUSTER}. Expected Chain ID: ${correctEvmNetwork}`,
          undefined
        );
      }
    }

    if (chainId === CHAIN_ID_APTOS) {
      if (hasCorrectNetwork) {
        return createWalletStatus(true, undefined, address);
      } else {
        return createWalletStatus(
          false,
          `Wallet is not connected to ${APTOS_NETWORK}.`,
          undefined
        );
      }
    }

    return createWalletStatus(false, "Wallet not connected", undefined);
  }, [
    chainId,
    autoSwitch,
    wallet,
    address,
    connected,
    correctEvmNetwork,
    hasCorrectNetwork,
  ]);
}

export default useIsWalletReady;

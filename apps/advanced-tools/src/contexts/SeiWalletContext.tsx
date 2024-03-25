import { CHAIN_ID_SEI } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import {
  SeiChainId,
  SeiWallet,
  getSupportedWallets,
} from "@xlabs-libs/wallet-aggregator-sei";
import { SEI_CHAIN_CONFIGURATION } from "../utils/consts";

export const getSeiWallets = () => {
  let seiWallets: SeiWallet[] = [];
  const { chainId, rpcUrl } = SEI_CHAIN_CONFIGURATION;
  try {
    seiWallets = getSupportedWallets({
      chainId: chainId as SeiChainId,
      rpcUrl,
    });
  } catch (err) {
    console.error("Failed to init sei chain wallets. Error:", err);
  }

  return seiWallets;
};

export const useSeiWallet = () => {
  return useWallet<SeiWallet>(CHAIN_ID_SEI);
};

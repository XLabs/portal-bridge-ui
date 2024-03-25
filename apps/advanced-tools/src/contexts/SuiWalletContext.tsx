import { CHAIN_ID_SUI } from "@certusone/wormhole-sdk";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { getWallets, SuiWallet } from "@xlabs-libs/wallet-aggregator-sui";

export const getSuiWallets = async () => {
  let suiWallets: SuiWallet[] = [];

  try {
    suiWallets = await getWallets();
  } catch (err) {
    console.error("Failed to init sui chain wallets. Error:", err);
  }

  return suiWallets;
};

export const useSuiWallet = () => {
  return useWallet<SuiWallet>(CHAIN_ID_SUI);
};

import { CHAIN_ID_XPLA } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { getWallets as getXplaWallets, XplaWallet } from "@xlabs-libs/wallet-aggregator-xpla";
import { ConnectType } from "@xpla/wallet-provider";

export const configureXplaWallets = async () => {
  let xplaWallets: XplaWallet[] = [];

  try {
    xplaWallets = await getXplaWallets([ ConnectType.READONLY ]);
  } catch (err) {
    console.error('Failed to init terra chain wallets. Error:', err);
  }

  return xplaWallets;
};

export const useXplaWallet = () => {
  return useWallet<XplaWallet>(CHAIN_ID_XPLA);
};

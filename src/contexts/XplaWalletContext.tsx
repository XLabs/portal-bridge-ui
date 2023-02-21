import { CHAIN_ID_XPLA } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { XplaWallet } from "@xlabs-libs/wallet-aggregator-xpla";
import { Network as XplaNetwork, getWallets as getXplaWallets } from "@xlabs-libs/wallet-aggregator-xpla";
import { ConnectType } from "@xpla/wallet-provider";
import { CLUSTER } from "../utils/consts";

export const configureXplaWallets = async () => {
  let xplaWallets: XplaWallet[] = [];

  try {
    xplaWallets = await getXplaWallets(CLUSTER === 'mainnet' ? XplaNetwork.Mainnet : XplaNetwork.Testnet, [ ConnectType.READONLY ]);
  } catch (err) {
    console.error('Failed to init terra chain wallets. Error:', err);
  }

  return xplaWallets;
};

export const useXplaWallet = () => {
  return useWallet<XplaWallet>(CHAIN_ID_XPLA);
};

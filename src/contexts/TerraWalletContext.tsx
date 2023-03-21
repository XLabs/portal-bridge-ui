import { ConnectType } from "@terra-money/wallet-provider";
import { ChainId, isTerraChain } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { getWallets, TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import { useEffect, useMemo, useState } from "react";

export interface TerraWalletState {
  walletAddress?: string;
  wallet?: TerraWallet;
}

export const getTerraWallets = async () => {
  let wallets: TerraWallet[] = [];

  try {
    wallets = await getWallets([ConnectType.READONLY]);
  } catch (err) {
    console.error("Failed to init terra chain wallets. Error:", err);
  }

  return wallets;
};

export const useTerraWallet = (chainId: ChainId) => {
  const wallet = useWallet<TerraWallet>(chainId);

  const [walletAddress, setWalletAddress] = useState<string | undefined>();

  useEffect(() => {
    if (!isTerraChain(chainId)) return () => {};

    setWalletAddress(wallet?.getAddress());

    const handleNetworkChange = () => {
      setWalletAddress(wallet?.getAddress());
    };

    wallet?.on("networkChanged", handleNetworkChange);

    return () => {
      wallet?.off("networkChanged", handleNetworkChange);
    };
  }, [wallet, chainId]);

  return useMemo(
    () => ({
      walletAddress,
      wallet,
    }),
    [walletAddress, wallet]
  );
};

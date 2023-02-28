import { ChainId, Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet as useAggregatorWallet } from "@xlabs-libs/wallet-aggregator-react";
import { useEffect, useMemo, useState } from "react";

export interface IWalletState<T extends Wallet> {
  wallet?: T;
  address?: string;
  network?: any;
  connected: boolean;
}

export const useWallet = <T extends Wallet = Wallet>(
  chainId: ChainId
): IWalletState<T> => {
  const wallet = useAggregatorWallet<T>(chainId);

  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>();
  const [network, setNetwork] = useState<any | undefined>();

  useEffect(() => {
    if (!wallet) return () => {};

    setAddress(wallet.getAddress());
    setNetwork(wallet.getNetworkInfo());
    setConnected(wallet.isConnected());

    const handleConnect = () => {
      setAddress(wallet.getAddress());
      setNetwork(wallet.getNetworkInfo());
      setConnected(true);
    };

    const handleDisconnect = () => {
      setAddress(undefined);
      setNetwork(undefined);
      setConnected(false);
    };

    const handleNetworkChanged = () => {
      setNetwork(wallet.getNetworkInfo());
    };

    const handleAccountsChanged = () => {
      setAddress(wallet.getAddress());
    };

    wallet.on("connect", handleConnect);
    wallet.on("disconnect", handleDisconnect);
    wallet.on("networkChanged", handleNetworkChanged);
    wallet.on("accountsChanged", handleAccountsChanged);

    return () => {
      wallet.off("connect", handleConnect);
      wallet.off("disconnect", handleDisconnect);
      wallet.off("networkChanged", handleNetworkChanged);
      wallet.off("accountsChanged", handleAccountsChanged);
    };
  }, [wallet]);

  return useMemo(
    () => ({
      wallet,
      address,
      network,
      connected,
    }),
    [wallet, address, network, connected]
  );
};

import { ChainId, isTerraChain } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import { useEffect, useMemo, useState } from "react";
import { Network as TerraNetwork, getWallets as getTerraWallets } from "@xlabs-libs/wallet-aggregator-terra";
import { CLUSTER } from "../utils/consts";
import { ConnectType } from "@terra-money/wallet-provider";

export interface TerraWalletState {
  walletAddress?: string;
  wallet?: TerraWallet;
}

export const configureTerraWallets = async () => {
  let terraClassicWallets: TerraWallet[] = [];
  let terraWallets: TerraWallet[]  = [];

  try {
    terraClassicWallets = await getTerraWallets(TerraNetwork.Classic, [ ConnectType.READONLY ]);
    terraWallets = await getTerraWallets(CLUSTER === 'mainnet' ? TerraNetwork.Mainnet : TerraNetwork.Testnet, [ ConnectType.READONLY ]);
  } catch (err) {
    console.error('Failed to init terra chain wallets. Error:', err);
  }

  return [ terraWallets, terraClassicWallets ];
}

export const useTerraWallet = (chainId: ChainId) => {
  const wallet = useWallet<TerraWallet>(chainId);

  const [ walletAddress, setWalletAddress ] = useState<string | undefined>();

  useEffect(() => {
    if (!isTerraChain(chainId)) return () => {};

    setWalletAddress(wallet?.getAddress());

    const handleNetworkChange = () => {
      setWalletAddress(wallet?.getAddress());
    };

    wallet?.on('networkChanged', handleNetworkChange);

    return () => {
      wallet?.off('networkChanged', handleNetworkChange);
    }
  }, [ wallet, chainId ])

  return useMemo(
    () => ({
      walletAddress,
      wallet
    }),
    [
      walletAddress,
      wallet
    ]
  )
};

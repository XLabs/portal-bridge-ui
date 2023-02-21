import {
  useMemo,
} from "react";
import { getInjectiveNetworkChainId, getInjectiveNetworkName } from "../utils/consts";
import { InjectiveWallet } from "@xlabs-libs/wallet-aggregator-injective";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { CHAIN_ID_INJECTIVE } from "@xlabs-libs/wallet-aggregator-core";
import { Wallet as InjectiveWalletType } from "@injectivelabs/wallet-ts";
import { getNetworkInfo } from "@injectivelabs/networks";

export const configureInjectiveWallets = () => {
  if (!['mainnet', 'testnet'].includes(process.env.REACT_APP_CLUSTER || '')) return [];

  const network = getInjectiveNetworkName();
  const networkInfo = getNetworkInfo(network);

  const opts = {
    networkChainId: getInjectiveNetworkChainId(),
    broadcasterOptions: {
      network,
      endpoints: {
        indexerApi: networkInfo.indexerApi,
        sentryGrpcApi: networkInfo.sentryGrpcApi,
        sentryHttpApi: networkInfo.sentryHttpApi,
      }
    }
  }

  return [
    new InjectiveWallet({
      ...opts,
      type: InjectiveWalletType.Keplr
    }),
    new InjectiveWallet({
      ...opts,
      type: InjectiveWalletType.Cosmostation
    })
  ]
}

export interface IInjectiveContext {
  wallet?: InjectiveWallet;
  address?: string;
}

export const useInjectiveContext = (): IInjectiveContext => {
  const wallet = useWallet(CHAIN_ID_INJECTIVE) as InjectiveWallet;

  const address = useMemo(() => wallet?.getAddress(), [ wallet ]);

  return useMemo(() => ({
    wallet,
    address
  }), [
    wallet,
    address
  ]);
};

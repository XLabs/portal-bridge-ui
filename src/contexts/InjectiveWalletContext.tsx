import { useMemo } from "react";
import {
  getInjectiveNetworkChainId,
  getInjectiveNetworkName,
} from "../utils/consts";
import {
  InjectiveWallet,
  KeplrWallet,
} from "@xlabs-libs/wallet-aggregator-injective";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { CHAIN_ID_INJECTIVE } from "@xlabs-libs/wallet-aggregator-core";
import { getNetworkInfo } from "@injectivelabs/networks";

const INJECTIVE_NETWORKS = ["mainnet", "testnet"];

export const getInjectiveWallets = () => {
  const isValidNetwork = INJECTIVE_NETWORKS.includes(
    import.meta.env.REACT_APP_CLUSTER || ""
  );
  if (!isValidNetwork) return [];

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
      },
    },
  };

  return [new KeplrWallet(opts)];
};

export interface IInjectiveContext {
  wallet?: InjectiveWallet;
  address?: string;
}

export const useInjectiveContext = (): IInjectiveContext => {
  const wallet = useWallet<InjectiveWallet>(CHAIN_ID_INJECTIVE);

  const address = useMemo(() => wallet?.getAddress(), [wallet]);

  return useMemo(
    () => ({
      wallet,
      address,
    }),
    [wallet, address]
  );
};

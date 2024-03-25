import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { CHAIN_ID_ALGORAND } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { useMemo } from "react";
import {
  AlgorandLedgerWallet,
  DeflyWallet,
  MyAlgoWallet,
  PeraWallet,
} from "@xlabs-libs/wallet-aggregator-algorand";

export const getAlgorandWallets = (): AlgorandWallet[] => {
  return [
    new MyAlgoWallet(),
    new PeraWallet(),
    new DeflyWallet({}),
    new AlgorandLedgerWallet(),
  ];
};

export const useAlgorandWallet = () => {
  const wallet = useWallet(CHAIN_ID_ALGORAND);
  const address = wallet?.getAddress();

  return useMemo(
    () => ({
      wallet: wallet as AlgorandWallet,
      address,
    }),
    [wallet, address]
  );
};

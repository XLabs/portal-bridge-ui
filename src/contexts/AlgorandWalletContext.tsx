import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { CHAIN_ID_ALGORAND } from "@xlabs-libs/wallet-aggregator-core";
import { useWalletFromChain } from "@xlabs-libs/wallet-aggregator-react";
import { useMemo } from "react";

export const useAlgorandWallet = () => {
  const wallet = useWalletFromChain(CHAIN_ID_ALGORAND);
  const address = wallet?.getAddress();

  return useMemo(() => ({
    wallet: wallet as AlgorandWallet,
    address
  }), [
    wallet,
    address
  ]);
}

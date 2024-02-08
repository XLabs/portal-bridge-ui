import { useAccount, useEnsName } from "wagmi";
import makeBlockie from "ethereum-blockies-base64";
import { useMemo } from "react";

export const useWalletInfo = () => {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const blockie = useMemo(() => {
    if (address) {
      return makeBlockie(address);
    }
    return undefined;
  }, [address]);

  return {
    address,
    isConnected,
    ensName,
    blockie,
  };
};

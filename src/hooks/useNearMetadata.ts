import { CHAIN_ID_NEAR } from "@certusone/wormhole-sdk";
import { Account } from "near-api-js";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { DataWrapper } from "../store/helpers";
import { makeNearAccount } from "../utils/near";
import { AlgoMetadata } from "./useAlgoMetadata";

export const fetchSingleMetadata = async (
  address: string,
  account: Account
): Promise<AlgoMetadata> => {
  const assetInfo = await account.viewFunction(address, "ft_metadata");
  return {
    tokenName: assetInfo.name,
    symbol: assetInfo.symbol,
    decimals: assetInfo.decimals,
  };
};

const fetchNearMetadata = async (
  addresses: string[],
  nearAccountId: string
) => {
  const account = await makeNearAccount(nearAccountId);
  const promises: Promise<AlgoMetadata>[] = [];
  addresses.forEach((address) => {
    promises.push(fetchSingleMetadata(address, account));
  });
  const resultsArray = await Promise.all(promises);
  const output = new Map<string, AlgoMetadata>();
  addresses.forEach((address, index) => {
    output.set(address, resultsArray[index]);
  });

  return output;
};

function useNearMetadata(
  addresses: string[]
): DataWrapper<Map<string, AlgoMetadata>> {
  const { address } = useWallet(CHAIN_ID_NEAR);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Map<string, AlgoMetadata> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (addresses.length && address) {
      setIsFetching(true);
      setError("");
      setData(null);
      fetchNearMetadata(addresses, address).then(
        (results) => {
          if (!cancelled) {
            setData(results);
            setIsFetching(false);
          }
        },
        () => {
          if (!cancelled) {
            setError("Could not retrieve contract metadata");
            setIsFetching(false);
          }
        }
      );
    }
    return () => {
      cancelled = true;
    };
  }, [addresses, address]);

  return useMemo(
    () => ({
      data,
      isFetching,
      error,
      receivedAt: null,
    }),
    [data, isFetching, error]
  );
}

export default useNearMetadata;

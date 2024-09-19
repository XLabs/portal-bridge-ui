import { coalesceChainName, isChain } from "@certusone/wormhole-sdk";
import { ChainName } from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";

const getChainValue = (
  query: URLSearchParams,
  key: string
): ChainName | null => {
  const sourceChain = query.get(key)?.toLowerCase?.();
  if (sourceChain) {
    if (isChain(sourceChain)) {
      return coalesceChainName(sourceChain) as ChainName;
    }

    const chainId = Number(sourceChain);
    if (isChain(chainId)) {
      return coalesceChainName(chainId) as ChainName;
    }
  }
  return null;
};

const getTokenValue = (query: URLSearchParams, key: string): string | null => {
  const token = query.get(key);
  return token?.length ? token : null;
};

const getTxHash = (query: URLSearchParams): string | null => {
  return query.get("txHash") || query.get("transactionId") || null;
};

const getRoute = (query: URLSearchParams): string | null => {
  return query.get("route") || null;
};

export const useQueryParams = () => {
  const query = useMemo(
    () =>
      new URLSearchParams(
        window.location.href.substring(
          window.location.href.indexOf("?"),
          window.location.href.length
        )
      ),
    []
  );

  return useMemo(
    () => ({
      txHash: getTxHash(query),
      sourceChain: getChainValue(query, "sourceChain"),
      targetChain: getChainValue(query, "targetChain"),
      asset: getTokenValue(query, "asset"),
      requiredNetwork: getChainValue(query, "requiredNetwork"),
      route: getRoute(query),
    }),
    [query]
  );
};

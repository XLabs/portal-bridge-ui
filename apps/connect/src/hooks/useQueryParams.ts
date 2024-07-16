import { ChainName, coalesceChainName, isChain } from "@certusone/wormhole-sdk";
import { useMemo } from "react";

function getChainValue(query: URLSearchParams, key: string): ChainName | null {
  const sourceChain = query.get(key);
  if (sourceChain) {
    if (isChain(sourceChain)) {
      return coalesceChainName(sourceChain);
    }

    const chainId = Number(sourceChain);
    if (isChain(chainId)) {
      return coalesceChainName(chainId);
    }
  }
  return null;
}

function getTokenValue(query: URLSearchParams, key: string): string | null {
  const token = query.get(key);
  return token?.length ? token : null;
}

function getTxHash(query: URLSearchParams): string | null {
  return query.get("txHash") || query.get("transactionId") || null;
}

export function useQueryParams() {
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
    }),
    [query]
  );
}

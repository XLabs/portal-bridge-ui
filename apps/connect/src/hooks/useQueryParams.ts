import { ChainName, coalesceChainName, isChain } from "@certusone/wormhole-sdk";
import { useMemo } from "react";

const isNumber = (str: string) =>
  typeof str === "string" && str.length > 0 && !isNaN(Number(str));

function getChainValue(query: URLSearchParams, key: string): ChainName | null {
  const sourceChain = query.get(key);
  if (sourceChain && isChain(sourceChain)) {
    return coalesceChainName(sourceChain);
  } else if (sourceChain && isNumber(sourceChain)) {
    const chainId = Number(sourceChain);
    if (isChain(chainId)) {
      return coalesceChainName(chainId);
    }
  }
  return null;
}

function getTokenValue(query: URLSearchParams, key: string): string | null {
  const token = query.get(key);
  return token && token.length > 0 ? token : null;
}

function getTxHash(query: URLSearchParams): string | null {
  const txHash = query.get("txHash");
  const transactionId = query.get("transactionId");
  if (txHash) {
    return txHash;
  } else if (transactionId) {
    return transactionId;
  }
  return null;
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
  const sourceChain = useMemo(
    () => getChainValue(query, "sourceChain"),
    [query]
  );
  const targetChain = useMemo(
    () => getChainValue(query, "targetChain"),
    [query]
  );
  const requiredNetwork = useMemo(
    () => getChainValue(query, "requiredNetwork"),
    [query]
  );
  const txHash = useMemo(() => getTxHash(query), [query]);
  const asset = useMemo(() => getTokenValue(query, "asset"), [query]);
  return {
    txHash,
    sourceChain,
    targetChain,
    asset,
    requiredNetwork,
  };
}

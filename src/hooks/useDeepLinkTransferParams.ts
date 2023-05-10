import { ChainId, coalesceChainId, ChainName } from "@certusone/wormhole-sdk";
import { useMemo } from "react";

function parseChain(chain: string | null = null): ChainId {
  if (chain) {
    const chainId = parseInt(chain);
    try {
      if (isNaN(chainId)) {
        return coalesceChainId(chain as ChainName);
      } else {
        return coalesceChainId(chainId as ChainId);
      }
    } catch (err) {
      console.error("Invalid path params specified.", err);
      return NaN as ChainId;
    }
  } else {
    return NaN as ChainId;
  }
}

export function useDeepLinkTransferParams(search: string) {
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const sourceChain = useMemo(
    () => parseChain(query.get("sourceChain")),
    [query]
  );
  const targetChain = useMemo(
    () => parseChain(query.get("targetChain")),
    [query]
  );
  return { sourceChain, targetChain };
}

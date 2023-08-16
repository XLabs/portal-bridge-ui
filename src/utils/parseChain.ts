import { ChainId, coalesceChainId, ChainName } from "@certusone/wormhole-sdk";

export function parseChain(chain: string | null = null): ChainId {
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

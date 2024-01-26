import type {
  ChainName
} from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";

export function useQueryParams() {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const txHash = useMemo(() => query.get("txHash"), [query]);
  const transactionId = useMemo(() => query.get("transactionId"), [query]);
  const sourceChain = useMemo(() => query.get("sourceChain") as ChainName, [query]);
  const targetChain = useMemo(() => query.get("targetChain") as ChainName, [query]);
  return {
    txHash,
    transactionId,
    sourceChain,
    targetChain,
  };
}

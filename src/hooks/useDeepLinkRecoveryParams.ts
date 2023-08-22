import { useMemo } from "react";
import { parseChain } from "../utils/parseChain";

export function useDeepLinkRecoveryParams(search: string) {
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const sourceChain = useMemo(
    () => parseChain(query.get("sourceChain")),
    [query]
  );
  const transactionId = useMemo(() => query.get("transactionId"), [query]);
  const vaaHex = useMemo(() => query.get("vaa"), [query]);
  return { sourceChain, transactionId, vaaHex };
}

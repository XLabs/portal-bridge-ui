import { useMemo } from "react";
import { parseChain } from "../utils/parseChain";

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

import { useMemo } from "react";

export function useQueryParams() {
    const query = new URLSearchParams(window.location.search);
    const txHash = useMemo(() => query.get("txHash"), [query]);
    const transactionId = useMemo(() => query.get("transactionId"), []);
    const sourceChain = useMemo(() => query.get("sourceChain"), []);
    const targetChain = useMemo(() => query.get("targetChain"), []);
    return {
        txHash,
        transactionId,
        sourceChain,
        targetChain
    }
};
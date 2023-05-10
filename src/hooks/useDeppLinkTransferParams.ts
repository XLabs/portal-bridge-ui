import { ChainId, coalesceChainId, ChainName } from "@certusone/wormhole-sdk";
import { /* useEffect, */ useMemo } from "react";
/*import useMarketsMap, {MarketsMap} from "./useMarketsMap";
import { ParsedTokenAccount } from "../store/transferSlice";
import { DataWrapper } from "../store/helpers";
import { useState } from "react";
*/

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

export function useDeppLinkTransferParams(search: string) {
    const query = useMemo(() => new URLSearchParams(search), [search]);
    const sourceChain = useMemo(() => parseChain(query.get("sourceChain")), [query]);
    const targetChain = useMemo(() => parseChain(query.get("targetChain")), [query]);
    /*
    const [asset, setAsset] = useState<ParsedTokenAccount | null>(null);
    const { data, isFetching }: DataWrapper<MarketsMap> = useMarketsMap(!!query);
    useEffect(() => {
        if (!isFetching) {
            const { tokens = {} } = data || {};
            const values = Object.values(tokens[sourceChain] || {});
            const value = values.find((token: any) => token.symbol === query.get("asset"));
            setAsset(value as ParsedTokenAccount);
        } 
    }, [sourceChain, data, isFetching, query]);*/
    return { sourceChain, targetChain /*, asset */ }
}
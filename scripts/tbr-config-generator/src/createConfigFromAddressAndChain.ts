import { Chain, Wormhole } from "@wormhole-foundation/sdk";
import { getCoingekoDetails } from "./getCoingekoDetails";
import { getWrappedAsset } from "./getWrappedAsset";

function key(symbol: string, chain: string) {
    return `${symbol}${chain}`;
}

export async function createConfigFromAddressAndChain(tokenAddress: string, sourceChain: Chain, targetChains: Array<Chain>) {
    const tokenId = Wormhole.tokenId(sourceChain, tokenAddress);
    const {
        image: icon,
        id: coinGeckoId,
        name: displayName,
        symbol,
        decimals
    } = await getCoingekoDetails(sourceChain, tokenAddress);
    if (symbol) {
        const output: Record<string, Record<string, any>> = {
            tokensConfig: {},
            wrappedTokens: {},
        }
        const tokenKey = key(symbol, sourceChain);
        output.tokensConfig![symbol] = {
            key: tokenKey,
            symbol,
            nativeChain: sourceChain as any,
            icon,
            tokenId: {
                chain: sourceChain as any,
                address: tokenAddress,
            },
            coinGeckoId,
            decimals,
            displayName
        }
        output.wrappedTokens[tokenKey] = {};
        for (const [chain, address] of await getWrappedAsset(tokenId, targetChains)) {
            output.wrappedTokens![tokenKey][chain] = address;
        }
        return output;
    } else {
        console.warn(`No invalid coingeko info for ${tokenAddress} on ${sourceChain} skiping...`);
    }
}
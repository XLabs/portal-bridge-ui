import { Chain, MapLevel, TokenConst, TokenSymbol, Wormhole, constMap } from "@wormhole-foundation/sdk";
import { getCoingekoDetails } from "./getCoingekoDetails";
import { getWrappedAsset } from "./getWrappedAsset";
import { getOnChainTokenDetails } from "./getOnChainTokenDetails";

function key(symbol: string, chain: string) {
    return `${symbol}${chain}`;
}

const tokenConfigs = [
    [
        "Ethereum",
        [
            [
                "WETH",
                {
                  symbol: "WETH",
                  decimals: 18,
                  address: "0xbB5A2dC896Ec4E2fa77F40FA630582ed9c6D0172",
                  original: "Ethereum",
                },
            ],
            [
                "USDT",
                {
                  symbol: "USDT",
                  decimals: 6,
                  address: "0x07de306"
                }
            ]
        ]
    ]
] as const satisfies MapLevel<Chain, MapLevel<TokenSymbol, TokenConst>>;

export const testnetTokensByChain = constMap(tokenConfigs, [0, [1, 2]]);

export async function createConfigFromAddressAndChain(tokenAddress: string, sourceChain: Chain, targetChains: Array<Chain>) {
    const tokenId = Wormhole.tokenId(sourceChain, tokenAddress);
    const tokenInfo = await getOnChainTokenDetails(tokenAddress);
    console.log(tokenInfo);
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
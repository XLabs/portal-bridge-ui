import { getDuneInfo } from "./getDuneInfo";
import { createConfigFromAddressAndChain } from "./createConfigFromAddressAndChain";
import { Chain, MapLevel, TokenSymbol, TokenConst } from "@wormhole-foundation/sdk";

/**
 * 
 * @param queryId query id to execute
 * @param execute if query should be force to execute or use the cached result
 * @returns MapLevel<Chain, MapLevel<TokenSymbol, TokenConst>>
 *[
 *    "Avalanche", <- query source chain
 *    [
 *        [
 *          "WETH", <- token symbol
 *          {
 *              symbol: "WETH", <- token symbol
 *              decimals: 18, <- token decimals
 *              address: "0xbB5A2dC896Ec4E2fa77F40FA630582ed9c6D0172", <- token address at source chain (https://testnet.snowtrace.io/token/0xbB5A2dC896Ec4E2fa77F40FA630582ed9c6D0172?chainid=43113)
 *              original: "Ethereum", <- token original chain
 *          },
 *        ],
 *        [
 *          "WAVAX",
 *          {
 *              symbol: "WAVAX",
 *              decimals: 18,
 *              address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
 *              original: "Avalanche",
 *          },
 *        ],
 *    ],
 *]
 */
export async function createConfigFromDuneQuery(queryId: number, execute = false): Promise<MapLevel<Chain, MapLevel<TokenSymbol, TokenConst>>> {
    const result = await getDuneInfo(queryId, execute);
    const sourceChain = result.length > 0 ? result[0].sourceChain : undefined;
    const output = [];
    for (const token of result) {
        const tokenConfigs: Array<TokenConst> = [];
        try {
            if (token.isValidSourceChain) {
                const config = await createConfigFromAddressAndChain(token.address.toString(), token.sourceChain, token.targetChains);
                output.push(token)
            } else {
                console.debug(`Invalid source chain: ${token.sourceChain} / ${token.address.toString()} skipping`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    if (sourceChain && output.length > 0) {
        return [
            [sourceChain, output satisfies MapLevel<TokenSymbol, TokenConst>]
        ];
    } else {
        return [];
    }
}
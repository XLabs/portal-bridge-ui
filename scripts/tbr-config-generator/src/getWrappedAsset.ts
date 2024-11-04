import "dotenv/config";
import { Chain, Network, TokenId, isNetwork, wormhole } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import sui from "@wormhole-foundation/sdk/sui";
import aptos from "@wormhole-foundation/sdk/aptos";
import algorand from "@wormhole-foundation/sdk/algorand";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";

function getNetwork(): Network {
    return isNetwork(process.env.NETWORK!) ? process.env.NETWORK : "Mainnet";
};

export async function getWrappedAsset(tokenId: TokenId, chains: Array<Chain>): Promise<Array<Array<string>>> {
    const wh = await wormhole(getNetwork(), [solana, evm, sui, aptos, algorand, cosmwasm]);
    const result = new Array<Array<string>>();
    for (const chain of chains) {
        const context = wh.getChain(chain);
        if (context.supportsTokenBridge()) {
            const tb = await context.getTokenBridge();
            try {
                const address = await tb.getWrappedAsset(tokenId);
                result.push([chain, address.toString()]);
            } catch (error: any) {
                console.log(error.message);
            }    
        }
    }
    return result;
}

import { getDuneInfo } from "./getDuneInfo";
import { createConfigFromAddressAndChain } from "./createConfigFromAddressAndChain";

export async function createConfigFromDuneQuery(queryId: number, execute = false) {
    const result = await getDuneInfo(queryId, execute);
    const output = [];
    for (const token of result) {
        try {
            if (token.isValidSourceChain) {
                output.push(await createConfigFromAddressAndChain(token.address.toString(), token.sourceChain, token.targetChains))
            } else {
                console.debug(`Invalid source chain: ${token.sourceChain} / ${token.address.toString()} skipping`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return output.filter(Boolean);
}
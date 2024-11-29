import { Chain, ChainId, TokenConst, TokenId, Wormhole, chainIdToChain, isChain } from "@wormhole-foundation/sdk";
import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { getOnChainTokenDetails } from "./getOnChainTokenDetails";
import { getWrappedAssetForChain } from "./getWrappedAsset";
import { getDuneInfo } from "./getDuneInfo";
import { writeFileSync } from "fs";
import chalk from "chalk";

function extractAnchorText(html: string) {
    const anchorTextRegex = /<a\b[^>]*>(.*?)<\/a>/i;
    const match = anchorTextRegex.exec(html);
    return match ? match[1].trim() : "";
}

function getTokenAddress(row: any): string {
    return extractAnchorText(row["Token Address"] as string);
}

function getTokenChain(row: any, idx?: number): Chain {
    const chainId = parseInt(row["Token Chain"]) as ChainId;
    const chain = chainIdToChain(chainId);
    return chain;
}

async function getTokenDetails(tokenId: TokenId<Chain>, queryChain: EvmChains, sourceChain: Chain): Promise<TokenConst> {
    if (sourceChain !== queryChain) {
        const wrapped = await getWrappedAssetForChain(tokenId, queryChain);
        if (wrapped) {
            return getOnChainTokenDetails(wrapped.toString(), queryChain, sourceChain);
        }
        throw new Error(`Failed to get wrapped asset for ${tokenId.address.toString()} on ${queryChain}`);
    } else {
        return getOnChainTokenDetails(tokenId.address.toString(), queryChain);
    }
}

async function createConfigs(input: string) {
    const mapper = (item: any, idx?: number) => ({
        address: getTokenAddress(item),
        sourceChain: getTokenChain(item)
    });
    const query = input.split(":");
    const queryId = parseInt(query.pop()!);
    const queryChain = query.pop() as EvmChains;
    console.log(chalk.green(`Processing ${queryChain} query id: ${queryId}`));
    console.log(chalk.green(`Fetching Dune info for query id: ${queryId}`));
    const duneResult = await getDuneInfo(queryId, true, mapper);
    console.log(chalk.green(`Processing Dune result for query id: ${queryId}`));
    console.table(duneResult, ['sourceChain', 'address']);
    const result = duneResult
        .map(async ({ address, sourceChain }) => {
        try {
            if (isChain(sourceChain)) {
                const tokenId = Wormhole.tokenId(sourceChain, address);
                const details = await getTokenDetails(tokenId, queryChain, sourceChain);
                return [
                    details.symbol,
                    details
                ];
            } else {
                console.log(chalk.red(`Invalid source chain: ${sourceChain} / ${address} skipping`));
                return null;
            }
        } catch (error: any) {
            console.log(chalk.red(`Failed to process ${sourceChain} / ${address}`, error.message));
            if (process.env.DEBUG) {
                console.trace(error);
            }
            return null;
        }

    });
    const output = await Promise.all(result);
    return [queryChain, output.filter(Boolean)];
}

(async () => {
    const inputs = [
        /*"Ethereum:4126080",
        "Polygon:4128580",
        "Bsc:4128575",
        "Avalanche:4137843",*/
        "Fantom:4137974",
        "Celo:4137984",
        "Arbitrum:4138031",
        "Optimism:4140347",
        "Base:4140404",
    ];
    const result = [];
    for (const input of inputs) {
        const chainConfig = await createConfigs(input);
        result.push(chainConfig);
        writeFileSync(
            `tbr-v3-config.json`,
            JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2),
            'utf-8'
        );
    }
    writeFileSync(
        `tbr-v3-config.json`,
        JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2),
        'utf-8'
    );
})()

/*
(async () => {
    const mapper = (item: any, idx?: number) => ({
        address: getTokenAddress(item),
        sourceChain: getTokenChain(item)
    });
    const input = "Polygon:4128580" // "Ethereum:4126080"
    const query = input.split(":");
    const queryId = parseInt(query.pop()!);
    const queryChain = query.pop() as EvmChains;
    const duneResult = await getDuneInfo(queryId, true, mapper);
    const result = duneResult.map(async ({ address, sourceChain }) => {
        const tokenId = Wormhole.tokenId(sourceChain, address);
        const details = await getTokenDetails(tokenId, queryChain, sourceChain);
        return [
            details.symbol,
            details
        ];
    });
    const output = await Promise.all(result);
    writeFileSync(
        `${queryChain}.json`, 
        JSON.stringify([queryChain, output], (_, value) => typeof value === 'bigint' ? value.toString() : value, 2),
        'utf-8'
    );
})();*/

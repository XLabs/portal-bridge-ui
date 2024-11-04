#!/usr/bin/env -S node --loader @swc-node/register/esm
import { Chain } from "@wormhole-foundation/sdk";
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const args = process.argv.slice(2);

const { values, positionals } = parseArgs({
    args,
    options: {
        help: {
            type: 'boolean',
            short: 'h'
        },
        query: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        sourceChain: {
            type: 'string'
        },
        targetChains: {
            type: 'string'
        }
    },
    allowPositionals: true
});

function printHelp() {
    console.log(`
Usage: index.mts [options]
Options:
    -h, --help              Print this help message
    --queries               The queries to run
    --address               The address to use
    --source-chain          The chain to use
    --target-chains         The chains to use
    `);
}

if (values.help) {
    printHelp();
    process.exit(0);
}

if (values.query && (values.sourceChain || values.address)) {
    console.error("Queries cannot be used with address or chain");
    process.exit(1);
}

if (values.address && !values.sourceChain || values.sourceChain && !values.address) {
    console.error("Both address and chain are required");
    process.exit(1);
}

async function executeCreateConfigFromAddressAndChain() {
    const { createConfigFromAddressAndChain } = await import("../src/createConfigFromAddressAndChain");
    const wormholeSourceChain = values.sourceChain as Chain;
    const wormholeTargetChains = values.targetChains!.split(",") as Array<Chain>;
    const output = await createConfigFromAddressAndChain(values.address!, wormholeSourceChain, wormholeTargetChains);
    writeFileSync(positionals.pop() || "output.json", JSON.stringify(output, null, 2));
}

if (values.address && values.sourceChain && values.targetChains) {
    console.log(`Running queries with address ${values.address} on chain ${values.sourceChain} and target chains ${values.targetChains}`);
    executeCreateConfigFromAddressAndChain();
}

async function executeCreateConfigFromDuneQuery() {
    const { createConfigFromDuneQuery } = await import("../src/createConfigFromDuneQuery");
    const output = await createConfigFromDuneQuery(parseInt(values.query!));
    writeFileSync(positionals.pop() || "output.json", JSON.stringify(output, null, 2));
}

if (values.query) {
    console.log(`Running queries ${values.query}`);
    executeCreateConfigFromDuneQuery();
}
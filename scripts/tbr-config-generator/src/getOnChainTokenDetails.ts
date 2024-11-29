import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { Chain, constMap, TokenConst } from "@wormhole-foundation/sdk";
import { ethers, keccak256, toUtf8Bytes, getAddress, JsonRpcProvider, Provider, ZeroAddress, Contract } from "ethers";
import chalk from "chalk";

const ERC_20 = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


const EIP_1967 = [
    {
        "constant": true,
        "inputs": [],
        "name": "implementation",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function",
    }
];

const DEFAULT_RPCS = constMap([
    ["Ethereum", "https://ethereum-rpc.publicnode.com"],
    ["Polygon", "https://polygon-bor-rpc.publicnode.com"],
    ["Bsc", "https://bsc-rpc.publicnode.com"],
    ["Avalanche", "https://avalanche-c-chain-rpc.publicnode.com"],
    ["Fantom", "https://fantom-rpc.publicnode.com"],
    ["Celo", "https://celo-rpc.publicnode.com"],
    ["Arbitrum", "https://arbitrum-one-rpc.publicnode.com"],
    ["Optimism", "https://optimism-rpc.publicnode.com"],
    ["Base", "https://base-rpc.publicnode.com"],
], [0, 1]);

const PROVIDER_CACHE = new Map<EvmChains, Provider>();

function getProvider(chain: EvmChains): Provider {
    if (!PROVIDER_CACHE.has(chain)) {
        const rpc = process.env[`${chain.toUpperCase()}_RPC`] || DEFAULT_RPCS.get(chain);
        if (!rpc) {
            throw new Error(`No RPC found for chain ${chain}`);
        }
        const provider = new JsonRpcProvider(rpc);
        PROVIDER_CACHE.set(chain, provider);
    }
    return PROVIDER_CACHE.get(chain)!;
}

export function getContractInstance(address: string, chain: EvmChains) {
    const provider = getProvider(chain);
    return new ethers.Contract(address, ERC_20, provider);
}

// EIP-1967 implementation storage slot
const EIP1967_SLOT = BigInt(keccak256(toUtf8Bytes("eip1967.proxy.implementation"))) - BigInt(1);

async function getImplementationAddress(proxyAddress: string, provider: Provider) {
    // Get the implementation address from the proxy contract's storage
    const storageValue = await provider.getStorage(proxyAddress, EIP1967_SLOT);

    // Convert to a valid Ethereum address (last 20 bytes)
    const implementationAddress = getAddress(
        `0x${storageValue.slice(-40)}`
    );
    if (implementationAddress === ZeroAddress) {
        try {
            const contract = new ethers.Contract(proxyAddress, EIP_1967, provider);
            return await contract.implementation();
        } catch (err: any) {
            return proxyAddress;
        }
    }
    return implementationAddress;
}

export async function getOnChainTokenDetails(address: string, chain: EvmChains, original: Chain = chain): Promise<TokenConst> {
    const provider = getProvider(chain);
    const contractAddress = await getImplementationAddress(address, provider);
    try {
        const contract = new ethers.Contract(contractAddress, ERC_20, provider);
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        return {
            address,
            symbol,
            decimals,
            original
        } as const satisfies TokenConst;
    } catch (err: any) {
        console.log(chalk.red(`Unable to get on chain info for ${address}, ${contractAddress}`), err.message)
        return {
            address,
            symbol: 'undefined',
            decimals: 0,
            original
        } as const satisfies TokenConst;
    }
}
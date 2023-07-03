import { Contracts as TestnetContracts } from './Testnet';
import { Contracts as MainnetContracts } from './Mainnet';
import { ChainId, ChainName, coalesceChainId } from '@certusone/wormhole-sdk';

const env = process?.env?.REACT_APP_CLUSTER || 'mainnet' as const;
const Empty = {} as const;
const getContracts = () => env === 'mainnet' ? MainnetContracts : TestnetContracts;

const getRelayerContractAddress = (chain: ChainName | ChainId) => {
    const contracts = getContracts() as unknown as Record<ChainName | ChainId, { address: string }>;
    const chainId = coalesceChainId(chain);
    const { address } = contracts[chainId] || Empty;
    if (!address) {
        throw new Error(`Relayer contract not found for chain ${chain} and env ${env}`);
    }
    return address;
}

export default getRelayerContractAddress;
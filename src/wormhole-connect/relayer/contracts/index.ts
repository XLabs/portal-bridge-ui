import { Contracts as TestnetContracts } from "./Testnet";
import { Contracts as MainnetContracts } from "./Mainnet";
import { ChainId, ChainName, coalesceChainId } from "@certusone/wormhole-sdk";

export interface RelayerContractDef {
  address: string;
}

const env = process?.env?.REACT_APP_CLUSTER || ("mainnet" as const);
const Contracts = env === "mainnet" ? MainnetContracts : TestnetContracts;
const EmptyContractDef = {} as const;

const getContract = (chain: ChainName | ChainId) =>
  Contracts[coalesceChainId(chain)];

/**
 * Return the contract address of the relayer to use it when ever you need it, or
 * throws an error if there not an address registered for the chain.
 *
 * @param chain one of the ChainId from {@link Mainnet} or {@link Testnet}
 * @returns the contract address of the relayer to use it when ever you need it.
 */
const getRelayerContractAddress = (chain: ChainName | ChainId) => {
  const { address } = getContract(chain) || EmptyContractDef;
  if (!address) {
    throw new Error(
      `Relayer contract not found for chain ${chain} and env ${env}`
    );
  }
  return address;
};

export { getRelayerContractAddress, getContract };

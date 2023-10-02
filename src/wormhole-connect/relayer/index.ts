import { ChainId, ChainName } from "@certusone/wormhole-sdk";
import { getContract } from "./contracts";

/**
 * Check if we know the address of the contract where we must call to relay,
 * if we have that knowledge, then we can relay the transaction, other wise
 * we should inform the user to use an alternative.
 *
 * @param chain one of the ChainId from {@link Mainnet} or {@link Testnet}
 * @returns true if we know the address of the contract where we must call to relay
 */
export const isChainSupported = (chain: ChainName | ChainId) =>
  getContract(chain) !== undefined;

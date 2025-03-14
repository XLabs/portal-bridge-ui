import base58 from "bs58";
import * as ethers from "ethers";
import { AptosConfig, Aptos, Network } from "@aptos-labs/ts-sdk";
import { bech32 } from "bech32";
import { Chain } from "@wormhole-foundation/sdk";
import { isEVMChain, isCosmWasmChain } from "./constants";

export const isValidAddress = async (
  address: string,
  chain: Chain
): Promise<boolean> => {
  // TO DO: Add support for other evm chains with the new sdk
  if (isEVMChain(chain) || chain === "Worldchain")
    return ethers.isAddress(address);
  if (chain === "Solana") return isValidSolanaAddress(address);
  if (chain === "Aptos") return isValidAptosAddress(address);
  if (chain === "Sui") return isValidSuiAddress(address);
  if (isCosmWasmChain(chain)) return isValidCosmosAddress(address, chain);

  return false;
};

// Solana Validation
const isValidSolanaAddress = (address: string): boolean => {
  try {
    return base58.decode(address).length === 32;
  } catch (e) {
    return false;
  }
};

// Aptos Validation
const config = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(config);
const isValidAptosAddress = async (address: string) => {
  try {
    return !!(await aptos.getAccountInfo({ accountAddress: address }));
  } catch {
    return false;
  }
};

// Cosmos Validation
const isValidCosmosAddress = (address: string, chain: Chain) => {
  const PREFIXES: Record<string, string> = {
    Osmosis: "osmo",
    Evmos: "evmos",
    Kujira: "kujira",
    Injective: "inj",
  };
  if (chain === "Evmos" && address.startsWith("0x")) {
    // For Evmos hex address case https://docs.evmos.org/protocol/concepts/accounts#address-formats-for-clients
    return ethers.isAddress(address);
  }
  // For Beach32 encode case https://docs.cosmos.network/v0.47/build/spec/addresses/bech32
  try {
    const decoded = bech32.decode(address);
    return PREFIXES[chain] === decoded.prefix && !!decoded.words?.length;
  } catch {
    return false;
  }
};

// Sui Validation
const isHex = (value: string) => {
  return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
};
const getHexByteLength = (value: string) => {
  return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2;
};
const isValidSuiAddress = (address: string) => {
  return isHex(address) && getHexByteLength(address) === 32;
};

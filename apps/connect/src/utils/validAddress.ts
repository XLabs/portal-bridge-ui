import base58 from "bs58";
import * as ethers from "ethers";
import { ChainName, isEVMChain } from "@certusone/wormhole-sdk";
import { AptosClient } from "aptos";

const aptosClient = new AptosClient("https://api.mainnet.aptoslabs.com/v1");

export async function isValidAddress(
  address: string,
  chain: ChainName
): Promise<boolean> {
  if (isEVMChain(chain)) {
    return isValidEthereumAddress(address);
  } else if (chain === "solana") {
    return isValidSolanaAddress(address);
  } else if (chain === "aptos") {
    return isValidAptosAddress(address);
  }
  return false;
}

function getEthereumAddressWithChecksum(address: string): string {
  return ethers.utils.getAddress(address);
}

export function isValidEthereumAddress(
  address: string,
  strict = false
): boolean {
  // We need to ensure the address contains the checksum
  try {
    const addressWithChecksum = getEthereumAddressWithChecksum(address);
    if (strict) {
      return address === addressWithChecksum;
    }
    return address.toLowerCase() === addressWithChecksum.toLocaleLowerCase();
  } catch (error) {
    console.error(error);
    const typedError = error as { reason?: string };
    if (
      typedError.reason === "invalid address" ||
      typedError.reason === "bad address checksum" ||
      typedError.reason === "bad icap checksum"
    ) {
      return false;
    }
  }
  return false;
}

function isValidSolanaAddress(address: string): boolean {
  try {
    const decoded = base58.decode(address);
    return decoded.length === 32;
  } catch (e) {
    return false;
  }
}

export const isValidAptosAddress = async (address: string) => {
  try {
    return !!aptosClient.getAccount(address);
  } catch {
    return false;
  }
};

import base58 from "bs58";
import * as ethers from "ethers";
import { ChainName, isEVMChain } from "@certusone/wormhole-sdk";

export function isValidAddress(address: string, chain: ChainName): boolean {
  if (isEVMChain(chain)) {
    return isValidEthereumAddress(address);
  } else if (chain === "solana") {
    return isValidSolanaAddress(address);
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

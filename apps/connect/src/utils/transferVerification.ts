import { isValidAddress } from "./isValidAddress";
import { isSanctionedAddress } from "../../src/providers/sanctions";
import { ChainName } from "@certusone/wormhole-sdk";
import { Chain } from "@wormhole-foundation/sdk";
import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

export type ExtendedTransferDetails = Parameters<
  NonNullable<WormholeConnectConfig["validateTransferHandler"]>
>[0];

export type ValidateTransferResult = ReturnType<
  NonNullable<WormholeConnectConfig["validateTransferHandler"]>
>;
export const validateTransfer = async (
  tx: ExtendedTransferDetails
): ValidateTransferResult => {
  try {
    // Check OFAC (sanctioned)
    const isSanctioned = await isSanctionedAddress(tx);
    if (isSanctioned) {
      return { isValid: false, error: "Sanctioned target address" };
    }
  } catch (error) {
    console.error(error);
  }

  // Correct Address Validation (based on chain selected)
  const isValid = await isValidAddress(tx.toWalletAddress, tx.toChain);
  if (!isValid) {
    return { isValid: false, error: "Not valid target address" };
  }

  return { isValid: true };
};

export const toChainNameFormat = (chain: Chain) => {
  return chain.toLowerCase() as ChainName;
};

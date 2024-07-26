import {
  ExtendedTransferDetails,
  ValidateTransferResult,
} from "node_modules/@wormhole-foundation/wormhole-connect/lib/src/config/types";
import { ChainName, toChainId } from "@certusone/wormhole-sdk";
import { isValidAddress } from "./validAddress";
//import { validateTransferHandler } from "../../src/providers/sanctions";
import { getIsSanctioned } from "./sanctions";

export const validateTransfer = async (
  tx: ExtendedTransferDetails
): Promise<ValidateTransferResult> => {
  tx.toChain;
  tx.toWalletAddress;
  tx.route;
  try {
    // Check OFAC (sanctioned)
    const isSanctioned = (await getIsSanctioned(toChainId(tx.toChain), tx.toWalletAddress));
    if (isSanctioned) {
      return { isValid: false, error: "Sanctionated target address" };
    }
  } catch (error) {
    console.error(error);
  }

  // Correct Address Validation (based on chain selected)
  const isValid = await isValidAddress(
    tx.toWalletAddress,
    tx.toChain as ChainName
  );
  if (!isValid) {
    return { isValid: false, error: "Not valid target address" };
  }

  return { isValid: true };
};

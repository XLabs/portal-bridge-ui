import {
  ExtendedTransferDetails,
  ValidateTransferResult,
} from "node_modules/@wormhole-foundation/wormhole-connect/lib/src/config/types";
import { getIsSanctioned } from "./sanctions";
import { toChainId, ChainName } from "@certusone/wormhole-sdk";
import { isValidAddress } from "./validAddress";

export const validateTransfer = async (
  tx: ExtendedTransferDetails
): Promise<ValidateTransferResult> => {
  tx.toChain;
  tx.toWalletAddress;
  tx.route;
  try {
    // Check OFAC (sanctioned)
    // eslint-disable-next-line no-extra-boolean-cast
    const isSanctioned = !!(await getIsSanctioned(
      toChainId(tx.toChain as ChainName),
      tx.toWalletAddress
    ));
    if (isSanctioned) {
      return { isValid: false, error: "Sanctionated address" };
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
  //return { isValid: false, error: "Not implemented" };
  return { isValid: true };
};

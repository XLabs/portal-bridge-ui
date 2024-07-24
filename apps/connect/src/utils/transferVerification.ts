import { ExtendedTransferDetails, ValidateTransferResult } from "node_modules/@wormhole-foundation/wormhole-connect/lib/src/config/types";
import { getIsSanctioned } from "./sanctions";
import { toChainId, ChainName} from "@certusone/wormhole-sdk";
import { isValidAddress } from "./validAddress";

export const validateTransfer = async (tx: ExtendedTransferDetails): Promise<ValidateTransferResult> => {
  tx.toChain
  tx.toWalletAddress
  tx.route

  // Check OFAC (sanctioned)
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!getIsSanctioned(toChainId(tx.toChain as ChainName), tx.toWalletAddress)) {
    return { isValid: false, error: "Sanctionated address" };
  }

  // Correct Address Validation (based on chain selected)
  if (!isValidAddress(tx.toWalletAddress, tx.toChain as ChainName)) {
  return { isValid: false, error: "Not valid address" };

  }
  return { isValid: true };
};

import { ChainId, tryHexToNativeString } from "@certusone/wormhole-sdk";
import { useMemo } from "react";
import { Rule, useWarningRulesEngine } from "./useWarningRulesEngine";

function parseOriginAsset(originAddress?: string, originChain?: ChainId) {
  try {
    if (originAddress && originChain) {
      return tryHexToNativeString(originAddress, originChain);
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Will calculate if a redeem is allowed or not
 * by using 4 dimension:
 * - sourceChain
 * - targetChain
 * - originAddress
 * - originChain
 *
 * @param sourceChain Which chain is the transfer coming from
 * @param targetChain Which chain is the transfer going to
 * @param originAddress Origin address of the asset
 * @param originChain Origin chain of the asset used to calculate
 *  the asset address or symbol
 * @returns a set of warnings, a set of ids and a boolean indicating
 *  if the transfer is disabled or not
 */
export function useRedeemControl(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  originAddress?: string,
  originChain?: ChainId
) {
  const asset = useMemo(
    () => parseOriginAsset(originAddress, originChain) || "",
    [originAddress, originChain]
  );
  const { warnings, ids, isDisabled } = useWarningRulesEngine(
    rules,
    sourceChain,
    targetChain,
    asset
  );
  return { warnings, ids, isRedeemDisabled: isDisabled };
}

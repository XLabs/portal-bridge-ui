import { ChainId } from "@certusone/wormhole-sdk";
import { Rule, useWarningRulesEngine } from "./useWarningRulesEngine";
import { useEffect, useState } from "react";
import useOriginalAsset from "./useOriginalAsset";

/**
 * Will calculate if a transfer is allowed or not
 * by using 3 dimension:
 * - sourceChain
 * - targetChain
 * - asset
 *
 * @param sourceChain Which chain is the transfer coming from
 * @param targetChain Which chain is the transfer going to
 * @param assset Which asset is being transferred
 * @returns a set of warnings, a set of ids and a boolean indicating
 *  if the transfer is disabled or not
 */
export function useTransferControl(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  assetOrToken: string = ""
) {
  const [asset, setAsset] = useState<string>(assetOrToken);
  const info = useOriginalAsset(sourceChain, assetOrToken, false);
  useEffect(() => {
    if (!info.isFetching) {
      setAsset(info.data?.originAddress || assetOrToken);
    }
  }, [assetOrToken, info]);
  const { warnings, ids, isDisabled } = useWarningRulesEngine(
    rules,
    sourceChain,
    targetChain,
    asset
  );
  return { warnings, ids, isTransferDisabled: isDisabled };
}

export default useTransferControl;

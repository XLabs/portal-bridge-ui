import { ChainId, tryHexToNativeString } from "@certusone/wormhole-sdk";
import { Rule, WarningMessage } from "./useTransferControl";
import { useEffect, useMemo, useState } from "react";

function parseOriginAsset(originAddress?: string, originChain?: ChainId) {
  try {
    if (originAddress && originChain) {
      return tryHexToNativeString(originAddress, originChain);
    }
  } catch (err) {
    console.log(err);
  }
}

export function useRedeemControl(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  originAddress?: string,
  originChain?: ChainId
) {
  const [ids, setIds] = useState<string[]>([]);
  const [isRedeemDisabled, setIsRedeemDisabled] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);
  const token = useMemo(
    () => parseOriginAsset(originAddress, originChain),
    [originAddress, originChain]
  );
  useEffect(() => {
    const appliedRules = rules.filter((rule) =>
      rule.predicate({ source: sourceChain, target: targetChain, token })
    );
    if (appliedRules.length > 0) {
      setWarnings(appliedRules);
      setIsRedeemDisabled(appliedRules.some((rule) => rule.disableTransfer));
      setIds(
        appliedRules.filter((rule) => !!rule.id).map((rule) => `${rule.id}`)
      );
    } else {
      setWarnings([]);
      setIds([]);
      setIsRedeemDisabled(false);
    }
  }, [rules, sourceChain, targetChain, token]);
  return { warnings, ids, isRedeemDisabled };
}

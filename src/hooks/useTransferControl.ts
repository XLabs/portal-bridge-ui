import { ChainId } from "@certusone/wormhole-sdk";
import { useEffect, useState } from "react";

export type WarningMessage = {
  text: string;
  link?: {
    url: string;
    text: string;
  };
};

export type PredicateArgs = {
  source: ChainId;
  target: ChainId;
  token?: string;
};

export type Rule = WarningMessage & {
  id?: string;
  disableTransfer?: boolean;
  predicate: (args: PredicateArgs) => boolean;
};

/**
 * Will calculate if a transfer is allowed or not
 * by using 3 dimension:
 * - sourceChain
 * - targetChain
 * - asset
 *
 * @param sourceChain Which chain is the transfer coming from
 * @param targetChain
 * @param assset
 * @returns
 */
export function useTransferControl(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  asset?: string
) {
  const [ids, setIds] = useState<string[]>([]);
  const [isTransferDisabled, setIsTransferDisabled] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);
  useEffect(() => {
    const appliedRules = rules.filter((rule) =>
      rule.predicate({ source: sourceChain, target: targetChain, token: asset })
    );
    if (appliedRules.length > 0) {
      setWarnings(appliedRules);
      setIsTransferDisabled(appliedRules.some((rule) => rule.disableTransfer));
      setIds(
        appliedRules.filter((rule) => !!rule.id).map((rule) => `${rule.id}`)
      );
    } else {
      setWarnings([]);
      setIds([]);
      setIsTransferDisabled(false);
    }
  }, [rules, sourceChain, targetChain, asset]);
  return { warnings, ids, isTransferDisabled };
}

export default useTransferControl;

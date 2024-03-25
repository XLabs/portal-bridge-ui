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
 * @param targetChain Which chain is the transfer going to
 * @param assset Which asset is being transferred
 * @returns a set of warnings, a set of ids and a boolean indicating
 *  if the transfer is disabled or not
 */
export function useWarningRulesEngine(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  token: string
) {
  const [ids, setIds] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);
  useEffect(() => {
    const appliedRules = rules.filter((rule) =>
      rule.predicate({ source: sourceChain, target: targetChain, token })
    );
    if (appliedRules.length > 0) {
      setWarnings(appliedRules);
      setIsDisabled(appliedRules.some((rule) => rule.disableTransfer));
      setIds(
        appliedRules.filter((rule) => !!rule.id).map((rule) => `${rule.id}`)
      );
    } else {
      setWarnings([]);
      setIds([]);
      setIsDisabled(false);
    }
  }, [rules, sourceChain, targetChain, token]);
  return { warnings, ids, isDisabled };
}

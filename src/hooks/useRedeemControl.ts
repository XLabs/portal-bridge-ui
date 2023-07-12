import {
  ChainId,
  ParsedVaa,
  parseTransferPayload,
  parseVaa,
  hexToUint8Array,
  tryHexToNativeString,
} from "@certusone/wormhole-sdk";
import { Rule, WarningMessage } from "./useTransferControl";
import { useEffect, useMemo, useState } from "react";

export function useRedeemControl(
  rules: Rule[],
  sourceChain: ChainId,
  targetChain: ChainId,
  rawVaa: string = ""
) {
  const [ids, setIds] = useState<string[]>([]);
  const [isTransferDisabled, setIsTransferDisabled] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);
  const vaa: ParsedVaa | null = useMemo(() => {
    try {
      return parseVaa(hexToUint8Array(rawVaa));
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [rawVaa]);
  const payload = useMemo(() => {
    try {
      if (vaa) {
        return parseTransferPayload(Buffer.from(new Uint8Array(vaa?.payload)));
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [vaa]);
  const asset = useMemo(
    () =>
      tryHexToNativeString(
        payload?.originAddress || "",
        payload?.originChain as ChainId
      ),
    [payload]
  );
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

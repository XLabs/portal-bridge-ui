import type { RootState } from "../store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ChainId, isEVMChain } from "@certusone/wormhole-sdk";

function checkIfIsBelowMinimum(amount: string, decimals: number) {
  try {
    const divider = Math.pow(10, decimals);
    const floatAmount = parseFloat(amount);
    const intAmount = floatAmount * divider;
    return Math.trunc(intAmount) <= 0;
  } catch (err: any) {
    console.error(err);
    return true;
  }
}

function getAdjustedDecimals(
  chainId: ChainId,
  isNativeAsset: boolean,
  decimals: number
) {
  return isEVMChain(chainId) && !isNativeAsset && decimals > 8
    ? decimals - 8
    : decimals;
}

export type MinimumAmountGuardArgs = {
  amount: string;
  sourceChain: ChainId;
  decimals: number;
  isNativeAsset: boolean;
}

export default function useMinimumAmountGuard({
  amount,
  sourceChain,
  decimals = 0,
  isNativeAsset = false,
}: MinimumAmountGuardArgs) {
  const isBelowMinimum = useMemo(
    () =>
      checkIfIsBelowMinimum(
        amount,
        getAdjustedDecimals(sourceChain, isNativeAsset, decimals)
      ),
    [amount, sourceChain, isNativeAsset, decimals]
  );
  return isBelowMinimum;
}

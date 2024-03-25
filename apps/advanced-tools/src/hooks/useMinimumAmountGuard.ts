import { useMemo } from "react";
import { ChainId, isEVMChain } from "@certusone/wormhole-sdk";

export type MinimumAmountGuardArgs = {
  amount: string;
  sourceChain: ChainId;
  decimals: number;
  isNativeAsset: boolean;
};

const EIGHT_DECIMALS = 8;

function getMultiplier(decimals: number) {
  return Math.pow(10, decimals);
}

function getAdjustedDecimals(
  chainId: ChainId,
  isNativeAsset: boolean,
  decimals: number
) {
  return isEVMChain(chainId) && !isNativeAsset && decimals > EIGHT_DECIMALS
    ? EIGHT_DECIMALS // max decimals supported on evm chains
    : decimals;
}

function getMinimum(divider: number, adjustedDecimals: number) {
  return (1 / divider).toFixed(adjustedDecimals);
}

function checkIfIsBelowMinimum(amount: string, multiplier: number) {
  try {
    const floatAmount = parseFloat(amount);
    const intAmount = floatAmount * multiplier;
    return Math.trunc(intAmount) <= 0;
  } catch (err: any) {
    console.error(err);
    return true;
  }
}

export default function useMinimumAmountGuard({
  amount,
  sourceChain,
  decimals = 0,
  isNativeAsset = false,
}: MinimumAmountGuardArgs) {
  const adjustedDecimals = useMemo(
    () => getAdjustedDecimals(sourceChain, isNativeAsset, decimals),
    [sourceChain, isNativeAsset, decimals]
  );
  const multiplier = useMemo(
    () => getMultiplier(adjustedDecimals),
    [adjustedDecimals]
  );
  const isBelowMinimum = useMemo(
    () => checkIfIsBelowMinimum(amount, multiplier),
    [amount, multiplier]
  );
  const minimum = useMemo(
    () => getMinimum(multiplier, adjustedDecimals),
    [multiplier, adjustedDecimals]
  );
  return { isBelowMinimum, minimum };
}

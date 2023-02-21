import {
  cosmos,
  CHAIN_ID_TERRA2,
  TerraChainId,
  terra,
} from "@certusone/wormhole-sdk";
import { formatUnits } from "@ethersproject/units";
import { Coin, Coins, Fee, isTxError, LCDClient } from "@terra-money/terra.js";
import { TxResult } from "@terra-money/wallet-provider";
import { TerraWallet } from "@xlabs-libs/wallet-aggregator-terra";
import axios from "axios";
import { getTerraConfig, getTerraGasPricesUrl } from "./consts";

export const NATIVE_TERRA_DECIMALS = 6;
export const LUNA_SYMBOL = "LUNA";
export const LUNA_CLASSIC_SYMBOL = "LUNC";

export const getNativeTerraIcon = (symbol: string) =>
  symbol === LUNA_SYMBOL
    ? `https://assets.terra.money/icon/svg/LUNA.png`
    : symbol === LUNA_CLASSIC_SYMBOL
    ? `https://assets.terra.money/icon/svg/LUNC.svg`
    : `https://assets.terra.money/icon/60/${symbol.slice(
        0,
        symbol.length - 1
      )}.png`;

export const formatNativeDenom = (
  denom: string,
  chainId: TerraChainId
): string => {
  const unit = denom.slice(1).toUpperCase();
  const isValidTerra = terra.isNativeTerra(denom);
  return denom === "uluna"
    ? chainId === CHAIN_ID_TERRA2
      ? LUNA_SYMBOL
      : LUNA_CLASSIC_SYMBOL
    : isValidTerra
    ? unit.slice(0, 2) + "TC"
    : "";
};

export const formatTerraNativeBalance = (balance = ""): string =>
  formatUnits(balance, 6);

export async function waitForTerraExecution(
  transaction: TxResult,
  chainId: TerraChainId
) {
  const lcd = new LCDClient(getTerraConfig(chainId));
  let info;
  while (!info) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      info = await lcd.tx.txInfo(transaction.result.txhash);
    } catch (e) {
      console.error(e);
    }
  }
  if (isTxError(info)) {
    throw new Error(
      `Tx ${transaction.result.txhash}: error code ${info.code}: ${info.raw_log}`
    );
  }
  return info;
}

export const isValidTerraAddress = (address: string, chainId: TerraChainId) => {
  if (terra.isNativeDenom(address)) {
    return true;
  }
  try {
    const startsWithTerra = address && address.startsWith("terra");
    const isParseable = cosmos.canonicalAddress(address);
    const isLengthOk =
      isParseable.length === (chainId === CHAIN_ID_TERRA2 ? 32 : 20);
    return !!(startsWithTerra && isParseable && isLengthOk);
  } catch (error) {
    return false;
  }
};

export async function postWithFees(
  wallet: TerraWallet,
  msgs: any[],
  memo: string,
  feeDenoms: string[],
  chainId: TerraChainId
) {
  // don't try/catch, let errors propagate
  const lcd = new LCDClient(getTerraConfig(chainId));
  //Thus, we are going to pull it directly from the current FCD.
  const gasPrices = await axios
    .get(getTerraGasPricesUrl(chainId))
    .then((result) => result.data);

  const account = await lcd.auth.accountInfo(wallet.getAddress()!);

  const feeEstimate = await lcd.tx.estimateFee(
    [
      {
        sequenceNumber: account.getSequenceNumber(),
        publicKey: account.getPublicKey(),
      },
    ],
    {
      msgs: [...msgs],
      memo,
      feeDenoms,
      gasPrices,
    }
  );

  // handle 1.2% "stability fee"
  let stabilityFee = new Coins();
  msgs.forEach((msg) => {
    // coins doesn't support forEach or reduce
    msg?.coins?.map((coin: Coin) => {
      stabilityFee = stabilityFee.add(coin);
      return undefined;
    });
  });
  // this leaves the amount as a Dec - no bueno - convert that to Int, otherwise we'll get math/big: cannot unmarshal
  stabilityFee = stabilityFee.mul(0.012).toIntCeilCoins();

  const result = await wallet.sendTransaction({
    msgs: [...msgs],
    memo,
    feeDenoms,
    gasPrices,
    fee: new Fee(feeEstimate.gas_limit, feeEstimate.amount.add(stabilityFee)),
    // @ts-ignore, https://github.com/terra-money/terra.js/pull/295 (adding isClassic property)
    isClassic: lcd.config.isClassic,
  });

  return result.data!;
}

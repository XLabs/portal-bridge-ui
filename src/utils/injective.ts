import { cosmos, isNativeDenomInjective } from "@certusone/wormhole-sdk";
import {
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
  Msgs,
  TxGrpcClient,
} from "@injectivelabs/sdk-ts";
import { InjectiveWallet } from "@xlabs-libs/wallet-aggregator-injective";
import { getInjectiveNetworkInfo } from "./consts";

export const NATIVE_INJECTIVE_DECIMALS = 18;

export const INJECTIVE_NATIVE_DENOM = "inj";

export const getInjectiveWasmClient = () =>
  new ChainGrpcWasmApi(getInjectiveNetworkInfo().grpc);

export const getInjectiveBankClient = () =>
  new ChainGrpcBankApi(getInjectiveNetworkInfo().grpc);

export const getInjectiveTxClient = () =>
  new TxGrpcClient(getInjectiveNetworkInfo().grpc);

export const isValidInjectiveAddress = (address: string) => {
  if (isNativeDenomInjective(address)) {
    return true;
  }
  try {
    const startsWithInj = address && address.startsWith("inj");
    const isParsable = cosmos.canonicalAddress(address);
    const isLengthOk = isParsable.length === 20;
    return !!(startsWithInj && isParsable && isLengthOk);
  } catch (error) {
    return false;
  }
};

export const formatNativeDenom = (denom: string) =>
  denom === INJECTIVE_NATIVE_DENOM ? "INJ" : "";

export const broadcastInjectiveTx = async (
  wallet: InjectiveWallet,
  address: string,
  msgs: Msgs | Msgs[],
  memo: string = ""
) => {
  const client = getInjectiveTxClient();
  const result = await wallet.sendTransaction({
    // @ts-ignore
    msgs,
    address,
    memo
  })
  const tx = await client.fetchTxPoll(result.id);
  if (!tx) {
    throw new Error("Unable to fetch transaction");
  }
  if (tx.code !== 0) {
    throw new Error(`Transaction failed: ${tx.rawLog}`);
  }
  return tx;
};

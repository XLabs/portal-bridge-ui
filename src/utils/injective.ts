import { cosmos, isNativeDenomInjective } from "@certusone/wormhole-sdk";
import {
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
  Msgs,
  TxGrpcClient,
  TxResponse,
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
    memo,
  });
  const tx = await client.fetchTxPoll(result.id);
  if (!tx) {
    throw new Error("Unable to fetch transaction");
  }
  if (tx.code !== 0) {
    throw new Error(`Transaction failed: ${tx.rawLog}`);
  }
  return tx;
};

/**
 * if raw tx logs are not present, add them to the tx object
 * @param tx
 * @returns tx with raw logs
 *
 * Note: applied the fix here, since wormhole sdk has been deprecated
 */
export function addInjectiveRawLogsToTx(tx: TxResponse): TxResponse {
  if (!!tx.rawLog || tx.rawLog.length === 0) {
    const decoder = new TextDecoder();
    const events = tx.events || [];
    const rawLogs = events.map((event) => ({
      type: event.type,
      attributes: event.attributes.map(
        (attr: { key: Uint8Array; value: Uint8Array }) => ({
          key:
            attr.key instanceof Uint8Array
              ? decoder.decode(attr.key)
              : attr.key,
          value:
            attr.value instanceof Uint8Array
              ? decoder.decode(attr.value)
              : attr.value,
        })
      ),
    }));
    tx.rawLog = JSON.stringify([{ events: rawLogs }]);
  }
  return tx;
}

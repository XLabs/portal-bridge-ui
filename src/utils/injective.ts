import { isNativeDenomInjective } from "@certusone/wormhole-sdk/lib/esm/cosmwasm/address";
import { canonicalAddress } from "@certusone/wormhole-sdk/lib/esm/cosmos/address";
import {
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
} from "@injectivelabs/sdk-ts/dist/client/chain/grpc";
import { Msgs } from "@injectivelabs/sdk-ts/dist/core/modules/msgs";
import { TxGrpcClient } from "@injectivelabs/sdk-ts/dist/core/modules/tx/api";
//} from "@certusone/wormhole-sdk/node_modules/@in
import { MsgBroadcaster } from "@injectivelabs/wallet-ts/dist/broadcaster/MsgBroadcaster";
import WalletStrategy from "@injectivelabs/wallet-ts/dist/strategies/wallet/WalletStrategy";
import { getInjectiveNetwork, getInjectiveNetworkInfo } from "./consts";

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
    const isParsable = canonicalAddress(address);
    const isLengthOk = isParsable.length === 20;
    return !!(startsWithInj && isParsable && isLengthOk);
  } catch (error) {
    return false;
  }
};

export const formatNativeDenom = (denom: string) =>
  denom === INJECTIVE_NATIVE_DENOM ? "INJ" : "";

export const broadcastInjectiveTx = async (
  walletStrategy: WalletStrategy,
  walletAddress: string,
  msgs: Msgs | Msgs[],
  memo: string = ""
) => {
  const client = getInjectiveTxClient();
  const network = getInjectiveNetwork();
  const broadcaster = new MsgBroadcaster({
    network,
    walletStrategy,
    simulateTx: true,
  });
  const txResponse = await broadcaster.broadcast({
    //@ts-ignore
    msgs,
    address: walletAddress,
    memo,
  });
  const tx = await client.fetchTxPoll(txResponse.txHash);
  if (!tx) {
    throw new Error("Unable to fetch transaction");
  }
  if (tx.code !== 0) {
    throw new Error(`Transaction failed: ${tx.rawLog}`);
  }
  return tx;
};

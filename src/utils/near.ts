import {
  ChainId,
  ChainName,
  CHAIN_ID_NEAR,
  hexToUint8Array,
  uint8ArrayToHex,
  WormholeWrappedInfo,
} from "@certusone/wormhole-sdk";
import BN from "bn.js";
import { arrayify, sha256, zeroPad } from "ethers/lib/utils";
import { Account, KeyPair } from "near-api-js";
import {
  FinalExecutionOutcome,
  getTransactionLastResult,
} from "near-api-js/lib/providers";
import { AlgoMetadata } from "../hooks/useAlgoMetadata";
import {
  getNearConnectionConfig,
  nearKeyStore,
  NEAR_TOKEN_BRIDGE_ACCOUNT,
} from "./consts";

export const fetchSingleMetadata = async (
  address: string,
  account: Account
): Promise<AlgoMetadata> => {
  const assetInfo = await account.viewFunction(address, "ft_metadata");
  return {
    tokenName: assetInfo.name,
    symbol: assetInfo.symbol,
    decimals: assetInfo.decimals,
  };
};

// export async function createFullAccessKey(account: Account) {
//   console.log(await account.getAccessKeys());
//   let foundKey;
//   do {
//     foundKey = await account.findAccessKey(NEAR_TOKEN_BRIDGE_ACCOUNT, []);
//     if (foundKey?.publicKey) {
//       console.log("deleting key", foundKey);
//       await account.deleteKey(foundKey.publicKey);
//     }
//   } while (foundKey);
//   const keyPair = KeyPair.fromRandom("ed25519");
//   const publicKey = keyPair.getPublicKey().toString();
//   const config = getNearConnectionConfig();
//   await nearKeyStore.setKey(config.networkId, publicKey, keyPair);
//   await account.addKey(publicKey, NEAR_TOKEN_BRIDGE_ACCOUNT);
// }

export function getIsWrappedAssetNear(
  tokenBridge: string,
  asset: string
): boolean {
  return asset.endsWith("." + tokenBridge);
}

export async function getOriginalAssetNear(
  client: Account,
  tokenAccount: string,
  assetAccount: string
): Promise<WormholeWrappedInfo> {
  let retVal: WormholeWrappedInfo = {
    isWrapped: false,
    chainId: CHAIN_ID_NEAR,
    assetAddress: new Uint8Array(),
  };
  retVal.isWrapped = await getIsWrappedAssetNear(tokenAccount, assetAccount);
  if (!retVal.isWrapped) {
    retVal.assetAddress = assetAccount
      ? arrayify(sha256(Buffer.from(assetAccount)))
      : zeroPad(arrayify("0x"), 32);
    return retVal;
  }

  let buf = await client.viewFunction(tokenAccount, "get_original_asset", {
    token: assetAccount,
  });

  retVal.chainId = buf[1];
  retVal.assetAddress = hexToUint8Array(buf[0]);

  return retVal;
}

export function getEmitterAddressNear(programAddress: string): string {
  return uint8ArrayToHex(arrayify(sha256(Buffer.from(programAddress, "utf8"))));
}

export function parseSequenceFromLogNear(
  result: FinalExecutionOutcome
): string {
  let sequence = "";
  for (const o of result.receipts_outcome) {
    for (const l of o.outcome.logs) {
      if (l.startsWith("EVENT_JSON:")) {
        const body = JSON.parse(l.slice(11));
        if (body.standard === "wormhole" && body.event === "publish") {
          return body.seq;
        }
      }
    }
  }
  return sequence;
}

export async function transferTokenFromNear(
  client: Account,
  coreBridge: string,
  tokenBridge: string,
  assetId: string,
  qty: bigint,
  receiver: Uint8Array,
  chain: ChainId | ChainName,
  fee: bigint,
  payload: string = ""
): Promise<FinalExecutionOutcome> {
  let isWrapped = getIsWrappedAssetNear(tokenBridge, assetId);

  let message_fee = await client.viewFunction(coreBridge, "message_fee", {});

  if (isWrapped) {
    return await client.functionCall({
      contractId: tokenBridge,
      methodName: "send_transfer_wormhole_token",
      args: {
        token: assetId,
        amount: qty.toString(10),
        receiver: uint8ArrayToHex(receiver),
        chain: chain,
        fee: fee.toString(10),
        payload: payload,
        message_fee: message_fee,
      },
      attachedDeposit: new BN(message_fee + 1),
      gas: new BN("100000000000000"),
    });
  } else {
    let bal = await client.viewFunction(assetId, "storage_balance_of", {
      account_id: tokenBridge,
    });
    if (bal === null) {
      // Looks like we have to stake some storage for this asset
      // for the token bridge...
      getTransactionLastResult(
        await client.functionCall({
          contractId: assetId,
          methodName: "storage_deposit",
          args: { account_id: tokenBridge, registration_only: true },
          gas: new BN("100000000000000"),
          attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
        })
      );
    }

    if (message_fee > 0) {
      let bank = await client.viewFunction(tokenBridge, "bank_balance", {
        acct: client.accountId,
      });

      if (!bank[0]) {
        await client.functionCall({
          contractId: tokenBridge,
          methodName: "register_bank",
          args: {},
          gas: new BN("100000000000000"),
          attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
        });
      }

      if (bank[1] < message_fee) {
        await client.functionCall({
          contractId: tokenBridge,
          methodName: "fill_bank",
          args: {},
          gas: new BN("100000000000000"),
          attachedDeposit: new BN(message_fee),
        });
      }
    }

    return await client.functionCall({
      contractId: assetId,
      methodName: "ft_transfer_call",
      args: {
        receiver_id: tokenBridge,
        amount: qty.toString(10),
        msg: JSON.stringify({
          receiver: uint8ArrayToHex(receiver),
          chain: chain,
          fee: fee.toString(10),
          payload: payload,
          message_fee: message_fee,
        }),
      },
      attachedDeposit: new BN(1),
      gas: new BN("100000000000000"),
    });
  }
}

export async function transferNearFromNear(
  client: Account,
  coreBridge: string,
  tokenBridge: string,
  qty: bigint,
  receiver: Uint8Array,
  chain: ChainId | ChainName,
  fee: bigint,
  payload: string = ""
): Promise<FinalExecutionOutcome> {
  let message_fee = await client.viewFunction(coreBridge, "message_fee", {});
  console.log("message_fee", message_fee);

  return await client.functionCall({
    contractId: tokenBridge,
    methodName: "send_transfer_near",
    args: {
      receiver: uint8ArrayToHex(receiver),
      chain: chain,
      fee: fee.toString(10),
      payload: payload,
      message_fee: message_fee,
    },
    attachedDeposit: new BN(qty.toString(10)).add(new BN(message_fee)),
    gas: new BN("100000000000000"),
  });
}

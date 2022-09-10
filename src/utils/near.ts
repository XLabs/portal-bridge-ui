import {
  ChainId,
  ChainName,
  CHAIN_ID_NEAR,
  coalesceChainId,
  hexToUint8Array,
  uint8ArrayToHex,
  WormholeWrappedInfo,
} from "@certusone/wormhole-sdk";
import { _parseVAAAlgorand } from "@certusone/wormhole-sdk/lib/esm/algorand";
import BN from "bn.js";
import { arrayify, sha256, zeroPad } from "ethers/lib/utils";
import { Account, connect } from "near-api-js";
import {
  FinalExecutionOutcome,
  getTransactionLastResult,
} from "near-api-js/lib/providers";
import { getNearConnectionConfig } from "./consts";

export const makeNearAccount = async (senderAddr: string) =>
  await (await connect(getNearConnectionConfig())).account(senderAddr);

export function getIsWrappedAssetNear(
  tokenBridge: string,
  asset: string
): boolean {
  return asset.endsWith("." + tokenBridge);
}

export async function lookupHash(
  account: Account,
  tokenBridge: string,
  hash: string
) {
  return await account.viewFunction(tokenBridge, "hash_lookup", {
    hash,
  });
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

export async function getForeignAssetNear(
  client: Account,
  tokenAccount: string,
  chain: ChainId | ChainName,
  contract: string
): Promise<string | null> {
  const chainId = coalesceChainId(chain);

  let ret = await client.viewFunction(tokenAccount, "get_foreign_asset", {
    chain: chainId,
    address: contract,
  });
  if (ret === "") return null;
  else return ret;
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

export async function redeemOnNear(
  client: Account,
  tokenBridge: string,
  vaa: Uint8Array
): Promise<FinalExecutionOutcome> {
  let p = _parseVAAAlgorand(vaa);

  if (p.ToChain !== CHAIN_ID_NEAR) {
    throw new Error("Not destined for NEAR");
  }

  let user = await client.viewFunction(tokenBridge, "hash_lookup", {
    hash: uint8ArrayToHex(p.ToAddress as Uint8Array),
  });

  if (!user[0]) {
    throw new Error(
      "Unregistered receiver (receiving account is not registered)"
    );
  }

  user = user[1];

  let token = await getForeignAssetNear(
    client,
    tokenBridge,
    p.FromChain as ChainId,
    p.Contract as string
  );

  if (token === "") {
    throw new Error("Unregistered token (this been attested yet?)");
  }

  if (
    (p.Contract as string) !==
    "0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    let bal = await client.viewFunction(token as string, "storage_balance_of", {
      account_id: user,
    });

    if (bal === null) {
      console.log("Registering ", user, " for ", token);
      bal = getTransactionLastResult(
        await client.functionCall({
          contractId: token as string,
          methodName: "storage_deposit",
          args: { account_id: user, registration_only: true },
          gas: new BN("100000000000000"),
          attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
        })
      );
    }

    if (
      p.Fee !== undefined &&
      Buffer.compare(
        p.Fee,
        Buffer.from(
          "0000000000000000000000000000000000000000000000000000000000000000",
          "hex"
        )
      ) !== 0
    ) {
      let bal = await client.viewFunction(
        token as string,
        "storage_balance_of",
        {
          account_id: client.accountId,
        }
      );

      if (bal === null) {
        console.log("Registering ", client.accountId, " for ", token);
        bal = getTransactionLastResult(
          await client.functionCall({
            contractId: token as string,
            methodName: "storage_deposit",
            args: { account_id: client.accountId, registration_only: true },
            gas: new BN("100000000000000"),
            attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
          })
        );
      }
    }
  }

  await client.functionCall({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: {
      vaa: uint8ArrayToHex(vaa),
    },
    attachedDeposit: new BN("100000000000000000000000"),
    gas: new BN("150000000000000"),
  });

  return await client.functionCall({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: {
      vaa: uint8ArrayToHex(vaa),
    },
    attachedDeposit: new BN("100000000000000000000000"),
    gas: new BN("150000000000000"),
  });
}

export async function createWrappedOnNear(
  client: Account,
  tokenBridge: string,
  attestVAA: Uint8Array
): Promise<FinalExecutionOutcome> {
  let vaa = Buffer.from(attestVAA).toString("hex");

  let res = await client.viewFunction(tokenBridge, "deposit_estimates", {});

  await client.functionCall({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: { vaa: vaa },
    attachedDeposit: new BN(res[1]),
    gas: new BN("150000000000000"),
  });

  return await client.functionCall({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: { vaa: vaa },
    attachedDeposit: new BN(res[1]),
    gas: new BN("150000000000000"),
  });
}

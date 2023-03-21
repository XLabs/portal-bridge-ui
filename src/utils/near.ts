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
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";
import BN from "bn.js";
import { arrayify, sha256, zeroPad } from "ethers/lib/utils";
import { Account, connect } from "near-api-js";
import { FunctionCallOptions } from "near-api-js/lib/account";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { getNearConnectionConfig } from "./consts";

export const makeNearAccount = async (senderAddr: string) =>
  await (await connect(getNearConnectionConfig())).account(senderAddr);

export const signAndSendTransactions = async (
  account: Account,
  wallet: NearWallet,
  messages: FunctionCallOptions[]
): Promise<FinalExecutionOutcome> => {
  const nearWallet = await wallet.getWallet();
  if (!nearWallet) throw new Error("Invalid wallet or not connected.");

  // the browser wallet's signAndSendTransactions call navigates away from the page which is incompatible with the current app design
  if (nearWallet.type === "browser" && account) {
    let lastReceipt: FinalExecutionOutcome | null = null;
    for (const message of messages) {
      lastReceipt = await account.functionCall(message);
    }
    if (!lastReceipt) {
      throw new Error("An error occurred while fetching the transaction info");
    }
    return lastReceipt;
  }

  const { data: receipts } = await wallet.sendTransaction({
    transactions: messages.map((options) => ({
      signerId: account.accountId,
      receiverId: options.contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: options.methodName,
            args: options.args,
            gas: options.gas?.toString() || "0",
            deposit: options.attachedDeposit?.toString() || "0",
          },
        },
      ],
    })),
  });
  if (!receipts || receipts.length === 0) {
    throw new Error("An error occurred while fetching the transaction info");
  }
  return receipts[receipts.length - 1];
};

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
): Promise<[boolean, string]> {
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

export async function getIsTransferCompletedNear(
  client: Account,
  tokenAccount: string,
  signedVAA: Uint8Array
): Promise<boolean> {
  // Could we just pass in the vaa already as hex?
  let vaa = Buffer.from(signedVAA).toString("hex");

  return (
    await client.viewFunction(tokenAccount, "is_transfer_completed", {
      vaa: vaa,
    })
  )[1];
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
): Promise<FunctionCallOptions[]> {
  let isWrapped = getIsWrappedAssetNear(tokenBridge, assetId);

  let message_fee = await client.viewFunction(coreBridge, "message_fee", {});

  if (isWrapped) {
    return [
      {
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
      },
    ];
  } else {
    const msgs = [];
    let bal = await client.viewFunction(assetId, "storage_balance_of", {
      account_id: tokenBridge,
    });
    if (bal === null) {
      // Looks like we have to stake some storage for this asset
      // for the token bridge...
      msgs.push({
        contractId: assetId,
        methodName: "storage_deposit",
        args: { account_id: tokenBridge, registration_only: true },
        gas: new BN("100000000000000"),
        attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
      });
    }

    if (message_fee > 0) {
      let bank = await client.viewFunction(tokenBridge, "bank_balance", {
        acct: client.accountId,
      });

      if (!bank[0]) {
        msgs.push({
          contractId: tokenBridge,
          methodName: "register_bank",
          args: {},
          gas: new BN("100000000000000"),
          attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
        });
      }

      if (bank[1] < message_fee) {
        msgs.push({
          contractId: tokenBridge,
          methodName: "fill_bank",
          args: {},
          gas: new BN("100000000000000"),
          attachedDeposit: new BN(message_fee),
        });
      }
    }

    msgs.push({
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
    return msgs;
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
): Promise<FunctionCallOptions[]> {
  let message_fee = await client.viewFunction(coreBridge, "message_fee", {});

  return [
    {
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
    },
  ];
}

export async function redeemOnNear(
  client: Account,
  tokenBridge: string,
  vaa: Uint8Array
): Promise<FunctionCallOptions[]> {
  const msgs = [];
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
      msgs.push({
        contractId: token as string,
        methodName: "storage_deposit",
        args: { account_id: user, registration_only: true },
        gas: new BN("100000000000000"),
        attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
      });
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
        msgs.push({
          contractId: token as string,
          methodName: "storage_deposit",
          args: { account_id: client.accountId, registration_only: true },
          gas: new BN("100000000000000"),
          attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
        });
      }
    }
  }

  msgs.push({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: {
      vaa: uint8ArrayToHex(vaa),
    },
    attachedDeposit: new BN("100000000000000000000000"),
    gas: new BN("150000000000000"),
  });

  msgs.push({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: {
      vaa: uint8ArrayToHex(vaa),
    },
    attachedDeposit: new BN("100000000000000000000000"),
    gas: new BN("150000000000000"),
  });
  return msgs;
}

export async function createWrappedOnNear(
  client: Account,
  tokenBridge: string,
  attestVAA: Uint8Array
): Promise<FunctionCallOptions[]> {
  const msgs = [];
  let vaa = Buffer.from(attestVAA).toString("hex");

  let res = await client.viewFunction(tokenBridge, "deposit_estimates", {});

  msgs.push({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: { vaa: vaa },
    attachedDeposit: new BN(res[1]),
    gas: new BN("150000000000000"),
  });

  msgs.push({
    contractId: tokenBridge,
    methodName: "submit_vaa",
    args: { vaa: vaa },
    attachedDeposit: new BN(res[1]),
    gas: new BN("150000000000000"),
  });
  return msgs;
}

export async function attestTokenFromNear(
  client: Account,
  coreBridge: string,
  tokenBridge: string,
  asset: string
): Promise<FunctionCallOptions[]> {
  const msgs = [];
  let message_fee = await client.viewFunction(coreBridge, "message_fee", {});
  // Non-signing event
  if (!getIsWrappedAssetNear(tokenBridge, asset)) {
    // Non-signing event that hits the RPC
    let res = await client.viewFunction(tokenBridge, "hash_account", {
      account: asset,
    });

    // if res[0] == false, the account has not been
    // registered... The first user to attest a non-wormhole token
    // is gonna have to pay for the space
    if (!res[0]) {
      // Signing event
      msgs.push({
        contractId: tokenBridge,
        methodName: "register_account",
        args: { account: asset },
        gas: new BN("100000000000000"),
        attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
      });
    }
  }

  msgs.push({
    contractId: tokenBridge,
    methodName: "attest_token",
    args: { token: asset, message_fee: message_fee },
    attachedDeposit: new BN("3000000000000000000000").add(new BN(message_fee)), // 0.003 NEAR
    gas: new BN("100000000000000"),
  });
  return msgs;
}

export async function attestNearFromNear(
  client: Account,
  coreBridge: string,
  tokenBridge: string
): Promise<FunctionCallOptions[]> {
  let message_fee =
    (await client.viewFunction(coreBridge, "message_fee", {})) + 1;

  return [
    {
      contractId: tokenBridge,
      methodName: "attest_near",
      args: { message_fee: message_fee },
      attachedDeposit: new BN(message_fee),
      gas: new BN("100000000000000"),
    },
  ];
}

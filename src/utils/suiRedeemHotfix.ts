import { parseTokenTransferVaa } from "@certusone/wormhole-sdk";
import {
  getPackageId,
  getTokenCoinType,
} from "@certusone/wormhole-sdk/lib/cjs/sui";
import {
  JsonRpcProvider,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
  builder,
} from "@mysten/sui.js";

const MAX_PURE_ARGUMENT_SIZE = 16 * 1024;

export async function redeemOnSui(
  provider: JsonRpcProvider,
  coreBridgeStateObjectId: string,
  tokenBridgeStateObjectId: string,
  transferVAA: Uint8Array
) {
  const { tokenAddress, tokenChain } = parseTokenTransferVaa(transferVAA);
  const coinType = await getTokenCoinType(
    provider,
    tokenBridgeStateObjectId,
    tokenAddress,
    tokenChain
  );
  if (!coinType) {
    throw new Error("Unable to fetch token coinType");
  }
  const coreBridgePackageId = await getPackageId(
    provider,
    coreBridgeStateObjectId
  );
  const tokenBridgePackageId = await getPackageId(
    provider,
    tokenBridgeStateObjectId
  );
  const tx = new TransactionBlock();
  const [verifiedVAA] = tx.moveCall({
    target: `${coreBridgePackageId}::vaa::parse_and_verify`,
    arguments: [
      tx.object(coreBridgeStateObjectId),
      tx.pure(
        builder
          .ser("vector<u8>", transferVAA, { maxSize: MAX_PURE_ARGUMENT_SIZE })
          .toBytes()
      ),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });
  const [tokenBridgeMessage] = tx.moveCall({
    target: `${tokenBridgePackageId}::vaa::verify_only_once`,
    arguments: [tx.object(tokenBridgeStateObjectId), verifiedVAA],
  });
  const [relayerReceipt] = tx.moveCall({
    target: `${tokenBridgePackageId}::complete_transfer::authorize_transfer`,
    arguments: [tx.object(tokenBridgeStateObjectId), tokenBridgeMessage],
    typeArguments: [coinType],
  });
  const [coins] = tx.moveCall({
    target: `${tokenBridgePackageId}::complete_transfer::redeem_relayer_payout`,
    arguments: [relayerReceipt],
    typeArguments: [coinType],
  });
  tx.moveCall({
    target: `${tokenBridgePackageId}::coin_utils::return_nonzero`,
    arguments: [coins],
    typeArguments: [coinType],
  });
  return tx;
}

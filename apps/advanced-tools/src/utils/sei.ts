import {
  CHAIN_ID_SEI,
  ChainId,
  ChainName,
  WormholeWrappedInfo,
  coalesceChainId,
  hexToUint8Array,
  isNativeCosmWasmDenom,
} from "@certusone/wormhole-sdk";
import { getCosmWasmClient, getQueryClient } from "@sei-js/core";
import { fromUint8Array } from "js-base64";
import { SEI_CHAIN_CONFIGURATION, SEI_NATIVE_DENOM } from "./consts";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import type { ExecuteInstruction } from "@cosmjs/cosmwasm-stargate";
import { logs, calculateFee } from "@cosmjs/stargate";
import { StdFee } from "@cosmjs/amino";
import { utils } from "ethers";
import { SeiWallet } from "@xlabs-libs/wallet-aggregator-sei";

export const getSeiWasmClient = () =>
  getCosmWasmClient(SEI_CHAIN_CONFIGURATION.rpcUrl);

export const getSeiQueryClient = () =>
  getQueryClient(SEI_CHAIN_CONFIGURATION.restUrl);

export type CosmWasmClient = {
  queryContractSmart: (address: string, queryMsg: any) => Promise<any>;
};

/**
 * Returns the address of the foreign asset
 * @param tokenBridgeAddress Address of token bridge contact
 * @param client Holds the wallet and signing information
 * @param originChain The chainId of the origin of the asset
 * @param originAsset The address of the origin asset
 * @returns The foreign asset address or null
 */
export async function getForeignAssetSei(
  tokenBridgeAddress: string,
  cosmwasmClient: CosmWasmClient,
  originChain: ChainId | ChainName,
  originAsset: Uint8Array
): Promise<string | null> {
  try {
    const queryResult = await cosmwasmClient.queryContractSmart(
      tokenBridgeAddress,
      {
        wrapped_registry: {
          chain: coalesceChainId(originChain),
          address: fromUint8Array(originAsset),
        },
      }
    );
    return queryResult.address;
  } catch (e) {
    return null;
  }
}

/**
 * Return if the VAA has been redeemed or not
 * @param tokenBridgeAddress The Sei token bridge contract address
 * @param signedVAA The signed VAA byte array
 * @param client Holds the wallet and signing information
 * @returns true if the VAA has been redeemed.
 */
export async function getIsTransferCompletedSei(
  tokenBridgeAddress: string,
  signedVAA: Uint8Array,
  client: CosmWasmClient
): Promise<boolean> {
  const queryResult = await client.queryContractSmart(tokenBridgeAddress, {
    is_vaa_redeemed: {
      vaa: fromUint8Array(signedVAA),
    },
  });
  return queryResult.is_redeemed;
}

/**
 * Returns information about the asset
 * @param wrappedAddress Address of the asset in wormhole wrapped format (hex string)
 * @param client WASM api client
 * @returns Information about the asset
 */
export async function getOriginalAssetSei(
  wrappedAddress: string,
  client: CosmWasmClient
): Promise<WormholeWrappedInfo> {
  const chainId = CHAIN_ID_SEI;
  if (isNativeCosmWasmDenom(chainId, wrappedAddress)) {
    return {
      isWrapped: false,
      chainId,
      assetAddress: hexToUint8Array(buildTokenId(wrappedAddress)),
    };
  }
  try {
    const response = await client.queryContractSmart(wrappedAddress, {
      wrapped_asset_info: {},
    });
    return {
      isWrapped: true,
      chainId: response.asset_chain,
      assetAddress: new Uint8Array(
        Buffer.from(response.asset_address, "base64")
      ),
    };
  } catch {}
  return {
    isWrapped: false,
    chainId: chainId,
    assetAddress: hexToUint8Array(buildTokenId(wrappedAddress)),
  };
}

// implement it here since there's a bug in the wh sdk of buildTokenId not
// checking for usei as a native denomination
export function buildTokenId(address: string) {
  const marker = address === SEI_NATIVE_DENOM ? "01" : "00";
  const hash = utils.keccak256(Buffer.from(address, "utf-8")).substring(4);
  return marker + hash;
}

export const queryExternalIdSei = async (
  client: CosmWasmClient,
  tokenBridgeAddress: string,
  externalTokenId: string
): Promise<string | null> => {
  try {
    const response = await client.queryContractSmart(tokenBridgeAddress, {
      external_id: {
        external_id: Buffer.from(externalTokenId, "hex").toString("base64"),
      },
    });
    const denomOrAddress: string | undefined =
      response.token_id.Bank?.denom ||
      response.token_id.Contract?.NativeCW20?.contract_address ||
      response.token_id.Contract?.ForeignToken?.foreign_address;
    return denomOrAddress || null;
  } catch {
    return null;
  }
};

/**
 * Submits the supplied VAA to Sei
 * @param signedVAA VAA with the attestation message
 * @returns Message to be broadcast
 */
export async function submitVAAOnSei(signedVAA: Uint8Array) {
  return {
    submit_vaa: { data: fromUint8Array(signedVAA) },
  };
}

export const createWrappedOnSei = submitVAAOnSei;
export const updateWrappedOnSei = submitVAAOnSei;
export const redeemOnSei = submitVAAOnSei;

export function parseSequenceFromLogSei(info: {
  logs: readonly logs.Log[];
}): string {
  const seq = searchInLogs("message.sequence", info.logs);
  if (!seq) throw new Error("sequence not found in logs");
  return seq;
}

export function parseRawLog(rawLogs: string): readonly logs.Log[] {
  return logs.parseRawLog(rawLogs);
}

export function searchInLogs(
  key: string,
  logs: readonly logs.Log[]
): string | undefined {
  for (const log of logs) {
    for (const event of log.events) {
      for (const attr of event.attributes) {
        if (attr.key === key) {
          return attr.value;
        }
      }
    }
  }
  return undefined;
}

const MSG_EXECUTE_CONTRACT_TYPE_URL = "/cosmwasm.wasm.v1.MsgExecuteContract";

export async function calculateFeeForContractExecution(
  instructions: ExecuteInstruction[],
  wallet: SeiWallet,
  memo = "",
  fee = 10000000
): Promise<StdFee> {
  try {
    const seiTxs = instructions.map(({ msg, contractAddress, funds }) => ({
      typeUrl: MSG_EXECUTE_CONTRACT_TYPE_URL,
      value: MsgExecuteContract.fromPartial({
        sender: wallet.getAddress(),
        contract: contractAddress,
        msg: Buffer.from(JSON.stringify(msg)),
        funds: funds ? [...funds] : [],
      }),
    }));
    const strEstimatedFee = await wallet.calculateFee({
      msgs: seiTxs,
      fee: calculateFee(fee, "0.1usei"),
      memo,
    });
    // Increase 25% the estimatd fee
    const estimatedFee = Math.trunc(parseInt(strEstimatedFee) / (1 - 0.3));
    return calculateFee(estimatedFee, "0.1usei");
  } catch (e) {
    console.log(e);
    return calculateFee(fee, "0.1usei");
  }
}

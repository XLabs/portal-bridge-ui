import { CHAIN_ID_APTOS } from "@certusone/wormhole-sdk";
import { AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import { AptosClient, Types } from "aptos";
import { hexZeroPad } from "ethers/lib/utils";
import {
  APTOS_INDEXER_URL,
  APTOS_URL,
  getBridgeAddressForChain,
} from "./consts";
import axios from "axios";

export enum AptosNetwork {
  Testnet = "Testnet",
  Mainnet = "Mainnet",
  Devnet = "Devnet",
  Localhost = "Localhost",
}

export const getAptosClient = () => new AptosClient(APTOS_URL);

export const getEmitterAddressAndSequenceFromResult = (
  result: Types.UserTransaction
): { emitterAddress: string; sequence: string } => {
  const data = result.events.find(
    (e) =>
      e.type ===
      `${getBridgeAddressForChain(CHAIN_ID_APTOS)}::state::WormholeMessage`
  )?.data;
  const emitterAddress = hexZeroPad(
    `0x${parseInt(data?.sender).toString(16)}`,
    32
  ).substring(2);
  const sequence = data?.sequence;
  return {
    emitterAddress,
    sequence,
  };
};

export async function waitForSignAndSubmitTransaction(
  payload: any,
  wallet: AptosWallet
): Promise<string> {
  // The wallets do not handle Uint8Array serialization'
  if (payload?.arguments) {
    payload.arguments = payload.arguments.map((a: any) =>
      a instanceof Uint8Array ? Array.from(a) : a
    );
  }
  try {
    let hash = "";
    hash = (await wallet.signAndSendTransaction(payload)).id;
    if (!hash) {
      throw new Error("Invalid hash");
    }
    const client = getAptosClient();
    await client.waitForTransaction(hash);
    return hash;
  } catch (e) {
    throw e;
  }
}

export interface CurrentTokensResponse {
  data: { current_token_ownerships: Token[] };
}

export interface Token {
  token_data_id_hash: string;
  name: string;
  collection_name: string;
  property_version: number;
  creator_address: string;
  current_token_data: {
    metadata_uri: string;
  };
}

export async function fetchCurrentTokens(
  ownerAddress: string,
  offset: number,
  limit: number
) {
  const response = await axios.post<CurrentTokensResponse>(APTOS_INDEXER_URL, {
    query: `query CurrentTokens($owner_address: String, $offset: Int, $limit: Int) {
      current_token_ownerships(
      where: {owner_address: {_eq: $owner_address}, amount: {_eq: "1"}, table_type: {_eq: "0x3::token::TokenStore"}}
      order_by: {last_transaction_version: desc}
      offset: $offset
      limit: $limit
    ) {
      token_data_id_hash
      name
      collection_name
      property_version
      creator_address
      current_token_data {
        metadata_uri
      }
    }
  }`,
    variables: { owner_address: ownerAddress, offset, limit },
  });
  return response.data;
}

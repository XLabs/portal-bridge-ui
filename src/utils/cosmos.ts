import { CHAIN_ID_EVMOS, CHAIN_ID_KUJIRA, CHAIN_ID_OSMOSIS, ChainId, tryNativeToUint8Array } from "@certusone/wormhole-sdk";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Tendermint34Client, Tendermint37Client, CometClient } from "@cosmjs/tendermint-rpc";
//import { WORMCHAIN_CONTRACTS } from "./consts";
let CLIENT_MAP: Tendermint34Client | Tendermint37Client;

export async function getTmClient(
): Promise<Tendermint34Client | Tendermint37Client> {
  if (CLIENT_MAP) {
    return CLIENT_MAP;
  }

  const rpc = 'https://wormchain-rpc.quickapi.com';
  if (!rpc) throw new Error(`RPC not configured`);

  // from cosmjs: https://github.com/cosmos/cosmjs/blob/358260bff71c9d3e7ad6644fcf64dc00325cdfb9/packages/stargate/src/stargateclient.ts#L218
  let tmClient: CometClient;
  const tm37Client = await Tendermint37Client.connect(rpc);
  const version = (await tm37Client.status()).nodeInfo.version;
  if (version.startsWith('0.37.')) {
    tmClient = tm37Client;
  } else {
    tm37Client.disconnect();
    tmClient = await Tendermint34Client.connect(rpc);
  }
  CLIENT_MAP = tmClient;
  return tmClient;
}

export async function getCosmWasmClient(
): Promise<CosmWasmClient> {
  const tmClient = await getTmClient();
  return CosmWasmClient.create(tmClient);
}

export async function queryWormchain(token: string, chainId: ChainId) {
  const client = await getCosmWasmClient();
  const bytes = Array.from(tryNativeToUint8Array(token, chainId));
  console.log(bytes)
  console.log(`ExternalTokenId { bytes: [${bytes.join(', ')}] }`)
  const res = await client.searchTx([
      { key: 'wasm.action', value: 'register_asset' },
      { key: 'wasm.token_chain', value: `${chainId}` },
      { key: 'wasm._contract_address', value: 'wormhole1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjq4lyjmh' },
      //{ key: 'wasm._contract_address', value: WORMCHAIN_CONTRACTS.token_bridge },
      { key: 'wasm.token_address', value: `ExternalTokenId { bytes: [${bytes.join(', ')}] }` }
  ]);
  return res;
}

export const isCosmosChain = (chain: ChainId) => {
  return chain === CHAIN_ID_KUJIRA || chain === CHAIN_ID_OSMOSIS || chain === CHAIN_ID_EVMOS;
};
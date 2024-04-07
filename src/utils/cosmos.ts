import { CHAIN_ID_EVMOS, CHAIN_ID_KUJIRA, CHAIN_ID_OSMOSIS, ChainId, tryNativeToUint8Array } from "@certusone/wormhole-sdk";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

//await queryWormchain('0x2598c30330d5771ae9f983979209486ae26de875', CHAIN_ID_POLYGON);
export async function queryWormchain(token: string, chainId: ChainId) {
  
  const rpc = 'https://wormchain-rpc.quickapi.com';
  const client = await CosmWasmClient.connect(rpc);
  const bytes = Array.from(tryNativeToUint8Array(token, chainId));
  console.log(bytes)
  console.log(`ExternalTokenId { bytes: [${bytes.join(', ')}] }`)
  const res = await client.searchTx([
      { key: 'wasm.action', value: 'register_asset' },
      { key: 'wasm.token_chain', value: `${chainId}` }, // source chain
      { key: 'wasm._contract_address', value: 'wormhole1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjq4lyjmh' },
      { key: 'wasm.token_address', value: `ExternalTokenId { bytes: [${bytes.join(', ')}] }` }
  ]);
  return res;
}

export const isCosmosChain = (chain: ChainId) => {
  return chain === CHAIN_ID_KUJIRA || chain === CHAIN_ID_OSMOSIS || chain === CHAIN_ID_EVMOS;
};
import { Chain, platformToChains } from "@wormhole-foundation/sdk";

export const PrivacyPolicyPath = "/privacy-policy";

export const isPreview =
  window.location.origin.includes("preview") ||
  window.location.origin.includes("testnet");

export const isProduction = window.location.host === "portalbridge.com";

export const CosmWasmChainNames: Chain[] = [
  "Terra",
  "Terra2",
  "Injective",
  "Xpla",
  "Sei",
  "Wormchain",
  "Osmosis",
  "Evmos",
  "Kujira",
] as const;

export const isCosmWasmChain = (chain: Chain) => {
  return CosmWasmChainNames.includes(chain);
};

const evmChains = platformToChains("Evm");
export const isEVMChain = (chain: Chain) => {
  return evmChains.includes(chain as any);
};

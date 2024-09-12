import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { envVars } from "./env-vars";

const rpcs = (chains: string[], template: (chain: string) => string) =>
  chains
    .map((chain: string) => ({ [chain]: template(chain) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
const asRpcHost = (chain: string) =>
  `https://and76cjzpa.execute-api.us-east-2.amazonaws.com/${chain.toLowerCase()}/`;
export const chains = [
  "wormchain",
  "osmosis",
  "ethereum",
  "sui",
  "aptos",
  "kujira",
  "evmos",
  "bsc",
  "polygon",
  "avalanche",
  "fantom",
  "celo",
  "moonbeam",
  "base",
  "arbitrum",
  "optimism",
  "scroll",
  "xlayer",
  "mantle",
];

export const MAINNET_RPCS = {
  ...rpcs(chains, asRpcHost),
  solana: "https://wormhole.rpcpool.com/",
};

export const PUBLIC_URL = envVars.VITE_PUBLIC_URL || "";

export const CLUSTER = envVars.VITE_APP_CLUSTER || "testnet";
export const wormholeConnectConfigCommon: Partial<WormholeConnectConfig> = {
  walletConnectProjectId: envVars.VITE_APP_WALLET_CONNECT_PROJECT_ID || "",
  env: CLUSTER,
  rpcs: {},
  showHamburgerMenu: false,
  explorer: {
    href: `https://wormholescan.io/#/txs?address={:address}&network=${CLUSTER}`,
  },
  manualTargetAddress: true,
  menu: [],
};

export interface Env {
  PUBLIC_URL: string;
  wormholeConnectConfig: WormholeConnectConfig;
  navBar: {
    label: string;
    active?: boolean;
    href: string;
    isBlank?: boolean;
  }[];
  redirects?: { source: string[]; target: string };
}

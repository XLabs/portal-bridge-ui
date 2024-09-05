import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect-v1";
import type { WormholeConnectConfig as WormholeConnectConfigv2 } from "@wormhole-foundation/wormhole-connect";
import { envVars } from "./env-vars";

const rpcs = (chains: string[], template: (chain: string) => string) =>
  chains
    .map((chain: string) => ({ [chain]: template(chain) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
const asRpcHost = (chain: string) =>
  `https://and76cjzpa.execute-api.us-east-2.amazonaws.com/${chain.toLocaleLowerCase()}/`;
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

const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || "";
export const chainsv2 = chains.map((chain) => capitalize(chain));
export const MAINNET_RPCS_V2 = {
  ...rpcs(chainsv2, asRpcHost),
  Solana: "https://wormhole.rpcpool.com/",
};

export const wormholeConnectConfigCommonv2: Partial<WormholeConnectConfigv2> = {
  walletConnectProjectId: envVars.VITE_APP_WALLET_CONNECT_PROJECT_ID || "",
  env: CLUSTER,
  network: CLUSTER,
  rpcs: {},
  showHamburgerMenu: false,
  explorer: {
    href: `https://wormholescan.io/#/txs?address={:address}&network=${CLUSTER}`,
  },
  menu: [
    {
      label: "Advanced Tools",
      href: `${PUBLIC_URL}/advanced-tools/`,
      order: 1,
    },
    {
      label: "Privacy Policy",
      href: `${PUBLIC_URL}/#/privacy-policy/`,
    },
  ],
};
export interface Env {
  PUBLIC_URL: string;
  wormholeConnectConfig: WormholeConnectConfig | WormholeConnectConfigv2;
  navBar: {
    label: string;
    active?: boolean;
    href: string;
    isBlank?: boolean;
  }[];
  redirects?: { source: string[]; target: string };
}

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { envVars } from "./env-vars";

const rpcs = (chains: string[], template: (chain: string) => string) =>
  chains
    .map((chain: string) => ({ [chain]: template(chain) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
const asRpcHost = (chain: string) =>
  `https://and76cjzpa.execute-api.us-east-2.amazonaws.com/${chain.toLowerCase()}/`;
export const chains = [
  "Wormchain",
  "Osmosis",
  "Ethereum",
  "Sui",
  "Aptos",
  "Kujira",
  "Evmos",
  "Bsc",
  "Polygon",
  "Avalanche",
  "Fantom",
  "Celo",
  "Moonbeam",
  "Base",
  "Arbitrum",
  "Optimism",
  "Scroll",
  "Xlayer",
  "Mantle",
];

export const MAINNET_RPCS = {
  ...rpcs(chains, asRpcHost),
  Klaytn: "https://public-en.node.kaia.io/",
  Solana: "https://wormhole.rpcpool.com/",
};

export const PUBLIC_URL = envVars.VITE_PUBLIC_URL || "";

export const CLUSTER = envVars.VITE_APP_CLUSTER || "Testnet";
export const wormholeConnectConfigCommon: Partial<WormholeConnectConfig> = {
  ui: {
    title: "",
    // cctpWarning: "",
    walletConnectProjectId: envVars.VITE_APP_WALLET_CONNECT_PROJECT_ID || "",
    showHamburgerMenu: false,
    explorer: {
      href: `https://wormholescan.io/#/txs?address={:address}&network=${CLUSTER}`,
    },
    menu: [],
  },
  network: CLUSTER,
  rpcs: {},
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

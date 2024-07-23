import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import packageJson from "../../package.json";
import { envVars } from "./env-vars";

const rpcs = (chains: string[], template: (chain: string) => string) =>
  chains
    .map((chain: string) => ({ [chain]: template(chain) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
const asRpcHost = (chain: string) =>
  `https://and76cjzpa.execute-api.us-east-2.amazonaws.com/${chain}/`;
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

export const versions: Env["versions"] = [
  {
    appName: "Portal Bridge",
    version: `v${envVars.VITE_APP_VERSION || "0.0.0"}`,
  },
  {
    appName: "Wormhole Connect",
    version: `v${packageJson.dependencies["@wormhole-foundation/wormhole-connect"]}`,
  },
];

export const wormholeConnectConfigCommon: Partial<WormholeConnectConfig> = {
  walletConnectProjectId: envVars.VITE_APP_WALLET_CONNECT_PROJECT_ID || "",

  env: envVars.VITE_APP_CLUSTER || "testnet",
  rpcs: {},
  showHamburgerMenu: false,
  explorer: {
    href: `https://wormholescan.io/#/txs?address={:address}&network=${envVars.VITE_APP_CLUSTER || "testnet"}`,
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
  wormholeConnectConfig: WormholeConnectConfig;
  navBar: {
    label: string;
    active?: boolean;
    href: string;
    isBlank?: boolean;
  }[];
  redirects?: { source: string[]; target: string };
  versions: { version: string; appName: string }[];
}

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";
import mui from "../theme/portal";

const config: WormholeConnectConfig = {
  mode: mui.palette.mode,
  customTheme,
  bridgeDefaults: { requiredNetwork: "osmosis", toNetwork: "osmosis" },
  networks: [
    "ethereum",
    "bsc",
    "polygon",
    "base",
    "solana",
    "aptos",
    "avalanche",
    "fantom",
    "celo",
    "moonbeam",
    "goerli",
    "mumbai",
    "fuji",
    "alfajores",
    "moonbasealpha",
    "sui",
    "osmosis"
  ],
  env: import.meta.env.VITE_APP_CLUSTER || "mainnet",
  pageHeader: "Cosmos Bridge",
};

export default function CosmosBridge() {
  return <ConnectLoader config={config} />;
}

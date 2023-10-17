import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";
import mui from "../theme/portal";

const config: WormholeConnectConfig = {
  mode: mui.palette.mode,
  customTheme,
  bridgeDefaults: { requiredNetwork: "sui", toNetwork: "sui" },
  networks: [
    "ethereum",
    "bsc",
    "polygon",
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
  ],
  env: import.meta.env.VITE_APP_CLUSTER || "mainnet",
  pageHeader: "Sui Bridge",
};

export default function SuiBridge() {
  return <ConnectLoader config={config} />;
}

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";

const config: WormholeConnectConfig = {
  mode: "dark",
  customTheme,
  routes: ["cctpManual", "cctpRelay"],
  networks: ["ethereum", "avalanche", "arbitrum", "optimism"],
  tokens: ["USDCeth", "USDCavax", "USDCarbitrum", "USDCoptimism"],
  env: import.meta.env.VITE_APP_CLUSTER || "mainnet",
  pageHeader: "USDC Bridge",
};

export default function USDCBridge() {
  return <ConnectLoader config={config} />;
}

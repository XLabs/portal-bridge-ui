import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";
import mui from '../theme/portal';

const config: WormholeConnectConfig = {
  mode: mui.palette.mode,
  customTheme,
  env: import.meta.env.VITE_APP_CLUSTER || "mainnet",
  pageHeader: "Token Bridge",
  pageSubHeader: "Portal is a bridge that offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole. Unlike many other bridges, you avoid double wrapping and never have to retrace your steps.",
  moreNetworks: "https://portalbridge.com",
  moreTokens: "https://portalbridge.com/#/transfer?sourceChain={:sourceChain}&targetChain=solana"
};

export default function TokenBridge() {
  return <ConnectLoader config={config} />;
}

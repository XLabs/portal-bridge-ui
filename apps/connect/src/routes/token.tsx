import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";
import mui from '../theme/portal';
import { useMemo } from "react";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  mode: mui.palette.mode,
  customTheme
};

export default function TokenBridge() {
  // TODO improve parsing and coalesce ChainName/ChainId
  const query = new URLSearchParams(window.location.search);
  const txHash = query.get("txHash");
  const sourceChain = query.get("sourceChain");
  const config = useMemo(() => {
    if (txHash && sourceChain) {
      return {
        ...defaultConfig,
        txHash,
        sourceChain,
      };
    } else {
      return defaultConfig;
    }
  }, []);
  return <ConnectLoader config={config} />;
}

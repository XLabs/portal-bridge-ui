import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";
import customTheme from "./theme/connect";
import mui from "./theme/portal";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import ConnectLoader from "./components/ConnectLoader";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  mode: mui.palette.mode,
  customTheme,
};

export default function Root() {
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
  const messages = Object.values(messageConfig);
  return (
    <>
      <NewsBar messages={messages} />
      <NavBar />
      <ConnectLoader config={config} />
    </>
  );
}

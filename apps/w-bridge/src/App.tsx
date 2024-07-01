import type {
  ChainName,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";
import customTheme from "./theme/connect";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import { useQueryParams } from "./hooks/useQueryParams";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
};

export default function Root() {
  const { txHash, sourceChain, targetChain } = useQueryParams();
  const config = useMemo(
    () => ({
      ...defaultConfig,
      searchTx: {
        ...(txHash && { txHash }),
        ...(sourceChain && { chainName: sourceChain as ChainName }),
      },
      bridgeDefaults: {
        ...(sourceChain && { fromNetwork: sourceChain as ChainName }),
        ...(targetChain && { toNetwork: targetChain as ChainName }),
      },
    }),
    [txHash, sourceChain, targetChain]
  );
  const messages = Object.values(messageConfig);
  return (
    <>
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      <WormholeConnect config={config} theme={customTheme} />
    </>
  );
}

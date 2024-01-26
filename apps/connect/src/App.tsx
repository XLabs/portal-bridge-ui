import type {
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";
import customTheme from "./theme/connect";
import mui from "./theme/portal";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import ConnectLoader from "./components/ConnectLoader";
import { useQueryParams } from "./hooks/useQueryParams";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  mode: mui.palette.mode,
  customTheme,
};

export default function Root() {
  const { txHash, transactionId, sourceChain, targetChain } = useQueryParams();
  const config = useMemo(
    () => ({
      ...defaultConfig,
      ...(txHash &&
        sourceChain && {
          searchTx: {
            txHash,
            chainName: sourceChain,
          },
        }),
      ...(transactionId &&
        sourceChain && {
          searchTx: {
            txHash: transactionId,
            chainName: sourceChain,
          },
        }),
      bridgeDefaults: {
        fromNetwork: sourceChain || null,
        toNetwork: targetChain || null,
      },
    }),
    [txHash, transactionId, sourceChain, targetChain]
  );
  const messages = Object.values(messageConfig);
  return (
    <>
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      {console.log(config)}
      <ConnectLoader config={config} />
    </>
  );
}

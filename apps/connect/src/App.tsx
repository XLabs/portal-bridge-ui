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
import { useFormatAssetParam } from "./hooks/useFormatAssetParam";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { eventHandler } from "./providers/telemetry";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  ...((window.location.origin.includes("preview") ||
    window.location.origin.includes("testnet")) && {
    eventHandler: eventHandler,
  }),
};

export default function Root() {
  const { txHash, sourceChain, targetChain, asset, requiredNetwork } =
    useQueryParams();
  const tokenKey = useFormatAssetParam(asset);
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
        ...(tokenKey && { token: tokenKey as string }),
        ...(requiredNetwork && {
          requiredNetwork: requiredNetwork as ChainName,
        }),
      },
    }),
    [txHash, sourceChain, targetChain, tokenKey, requiredNetwork]
  );

  const messages = Object.values(messageConfig);
  return (
    <>
      {versions.map(({ appName, version }, idx) => (
        <meta
          name={appName}
          content={version}
          key={`${appName}-${version}-${idx}`}
        />
      ))}
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      <WormholeConnect config={config} theme={customTheme} />
    </>
  );
}

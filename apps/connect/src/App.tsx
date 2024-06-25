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
import WormholeConnect, { MAINNET, TESTNET } from "@wormhole-foundation/wormhole-connect";
import { eventHandler } from "./providers/telemetry";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  ...((window.location.origin.includes("preview") ||
    window.location.origin.includes("testnet")) && {
    eventHandler: eventHandler,
  }),
};
const tokensList = defaultConfig.env === 'mainnet' ? MAINNET.tokens : TESTNET.tokens;
export default function Root() {
  const { txHash, sourceChain, targetChain, asset, requiredNetwork } =
    useQueryParams();

  let tokenKey: string | undefined = undefined;
  const allTokens = {
    ...tokensList,
    ...defaultConfig?.tokensConfig,
  };
  if (allTokens) {
    const tokenParam = Object.entries(allTokens).find(
      (config) => config[1]?.tokenId?.address === asset || config[1]?.key === asset
    );
    if (tokenParam) {
      tokenKey = tokenParam[1].key;
    }
  }
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

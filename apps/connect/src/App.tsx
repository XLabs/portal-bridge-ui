import type {
  ChainName,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { ComponentProps, useEffect, useMemo } from "react";
import customTheme from "./theme/connect";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import { useQueryParams } from "./hooks/useQueryParams";
import { useFormatAssetParam } from "./hooks/useFormatAssetParam";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { eventHandler } from "./providers/telemetry";
import { useRoutes } from "react-router-dom";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import { PrivacyPolicyPath, isPreview, isProduction } from "./utils/constants";
import Banner from "./components/atoms/Banner";
import { ENV } from "@env";

const defaultConfig: WormholeConnectConfig = {
  ...ENV.wormholeConnectConfig,
  ...((isPreview || isProduction) && {
    eventHandler,
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isRouteSupportedHandler: async (td: any) => {
    // Disable manual NTT for Lido wstETH
    if (
      td.route === "nttManual" &&
      td.fromToken.tokenId !== "native" &&
      (td.fromToken.tokenId.address ===
        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" ||
        td.fromToken.tokenId.address ===
          "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C")
    ) {
      return false;
    }
    return true;
  },
};

export default function Root() {
  const { txHash, sourceChain, targetChain, asset, requiredNetwork } =
    useQueryParams();
  const tokenKey = useFormatAssetParam(asset);
  const config: ComponentProps<typeof WormholeConnect>["config"] = useMemo(
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
  useEffect(() => {
    localStorage.setItem("Connect Config", JSON.stringify(config, null, 2));
  }, [config]);

  const Connect = (
    <>
      <WormholeConnect config={config} theme={customTheme} />
      <Banner />
    </>
  );
  const routes = useRoutes([
    { path: PrivacyPolicyPath, element: <PrivacyPolicy /> },
    { path: "*", element: Connect },
  ]);
  return (
    <>
      {ENV.versions.map(({ appName, version }, idx) => (
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
      {routes}
    </>
  );
}

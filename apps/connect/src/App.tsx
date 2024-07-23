import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { ComponentProps, useEffect, useMemo } from "react";
import customTheme from "./theme/connect";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import { useQueryParams } from "./hooks/useQueryParams";
import { useFormatAssetParam } from "./hooks/useFormatAssetParam";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { eventHandler, type WormholeConnectEvent } from "./providers/telemetry";
import { useRoutes } from "react-router-dom";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import { PrivacyPolicyPath, isPreview, isProduction } from "./utils/constants";
import Banner from "./components/atoms/Banner";
import { ENV } from "@env";
import { clearUrl, pushResumeUrl } from "./navs/navs";

const defaultConfig: WormholeConnectConfig = {
  ...ENV.wormholeConnectConfig,

  eventHandler: (e: WormholeConnectEvent) => {
    if (isPreview || isProduction) {
      // Send the event to Mixpanel
      eventHandler(e);
    }
    // Update the URL when a transfer starts with a permlink
    pushResumeUrl(e);
    // Clear the URL when a transfer is successful
    clearUrl(e);
  },
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
  const { txHash, sourceChain, targetChain, asset, requiredNetwork, route } =
    useQueryParams();
  const token = useFormatAssetParam(asset);
  const config: ComponentProps<typeof WormholeConnect>["config"] = useMemo(
    () => ({
      ...defaultConfig,
      searchTx: {
        ...(txHash && { txHash }),
        ...(sourceChain && { chainName: sourceChain }),
      },
      bridgeDefaults: {
        ...(sourceChain && { fromNetwork: sourceChain }),
        ...(targetChain && { toNetwork: targetChain }),
        ...(token && { token }),
        ...(requiredNetwork && { requiredNetwork }),
      },
      ...(route && { routes: [route] }),
    }),
    [txHash, sourceChain, targetChain, token, requiredNetwork, route]
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

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { ComponentProps, useEffect, useMemo, useState } from "react";

import { useQueryParams } from "./useQueryParams";
import { useFormatAssetParam } from "./useFormatAssetParam";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import {
  eventHandler,
  type WormholeConnectEvent,
} from "../providers/telemetry";
import { isPreview, isProduction } from "../utils/constants";
import { ENV } from "@env";
import { clearUrl, pushResumeUrl } from "../navs/navs";
import { validateTransfer } from "../utils/transferVerification";
import { ChainName } from "@certusone/wormhole-sdk";
//import { validateTransferHandler } from "./providers/sanctions"; // TO DO: Use this function
import { getSortedChains } from "../utils/getSortedChains";

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
  // validateTransfer
  validateTransferHandler: validateTransfer,
  isRouteSupportedHandler: async (td: any) => {
    // Disable manual NTT for Lido wstETHƒ
    return !(
      td.route === "nttManual" &&
      td.fromToken.tokenId !== "native" &&
      [
        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
      ].includes(td.fromToken.tokenId.address)
    );
  },
};

export const useConnectConfig = () => {
  const [networks, setNetworks] = useState<ChainName[] | null>(null);
  const { txHash, sourceChain, targetChain, asset, requiredNetwork, route } =
    useQueryParams();
  const token = useFormatAssetParam(asset);
  const config: ComponentProps<typeof WormholeConnect>["config"] = useMemo(
    () => ({
      ...defaultConfig,
      networks: networks!,
      //validateTransferHandler,
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
    [txHash, sourceChain, targetChain, token, requiredNetwork, route, networks]
  );

  useEffect(() => {
    const controller = new AbortController();
    getSortedChains(
      ENV.wormholeConnectConfig.networks as ChainName[],
      controller.signal
    ).then((chains) => !!chains && setNetworks(chains));
    return () => controller.abort();
  }, []);

  return networks ? config : undefined;
};

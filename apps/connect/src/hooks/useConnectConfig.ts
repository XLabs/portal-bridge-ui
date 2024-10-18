import type {
  Chain,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { useEffect, useMemo, useState } from "react";

import { useQueryParams } from "./useQueryParams";
import { useFormatAssetParam } from "./useFormatAssetParam";
import {
  eventHandler,
  type WormholeConnectEvent,
} from "../providers/telemetry";
import { isPreview, isProduction } from "../utils/constants";
import { ENV } from "@env";
import { validateTransfer } from "../utils/transferVerification";
import { getSortedChains } from "../utils/getSortedChains";
import isRouteSupported from "../utils/isRouteSupported";

const defaultConfig: WormholeConnectConfig = {
  ...ENV.wormholeConnectConfig,
  eventHandler: (e: WormholeConnectEvent) => {
    if (isPreview || isProduction) {
      // Send the event to Mixpanel
      eventHandler(e);
    }
    // Update the URL when a transfer starts with a permlink
    //pushResumeUrl(e); // TODO: Fix searchTx param in v2
    // Clear the URL when a transfer is successful
    //clearUrl(e); // TODO: Fix searchTx param in v2
  },
  // validateTransfer
  validateTransferHandler: validateTransfer,
  isRouteSupportedHandler: isRouteSupported,
};

export const useConnectConfig = () => {
  const [networks, setNetworks] = useState<Chain[] | null>(null);
  const {
    txHash,
    sourceChain,
    targetChain,
    sourceToken,
    targetToken,
    requiredNetwork,
    preferredRouteName,
  } = useQueryParams();
  const tokenKey = useFormatAssetParam(sourceToken);
  const toTokenKey = useFormatAssetParam(targetToken);
  const token = useMemo(
    () => ({
      tokenKey: tokenKey ?? undefined,
      toTokenKey: toTokenKey ?? tokenKey ?? undefined,
    }),
    [tokenKey, toTokenKey]
  );

  const config: WormholeConnectConfig = useMemo(
    () => ({
      ...defaultConfig,
      chains: networks!,
      ui: {
        ...(defaultConfig.ui as NonNullable<WormholeConnectConfig["ui"]>),
        searchTx: {
          ...(txHash && { txHash }),
          ...(sourceChain && { chainName: sourceChain }),
        },
        defaultInputs: {
          ...(sourceChain && { fromChain: sourceChain }),
          ...(targetChain && { toChain: targetChain }),
          ...token,
          ...(requiredNetwork && { requiredChain: requiredNetwork }),
          ...(preferredRouteName && { preferredRouteName }),
        },
      },
    }),
    [
      networks,
      txHash,
      sourceChain,
      targetChain,
      token,
      requiredNetwork,
      preferredRouteName,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    getSortedChains(
      ENV.wormholeConnectConfig.chains as Chain[],
      controller.signal
    ).then((chains) => !!chains && setNetworks(chains));
    return () => controller.abort();
  }, []);

  return networks ? config : undefined;
};

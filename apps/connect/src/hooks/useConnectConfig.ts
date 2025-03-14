import type { WormholeConnectConfig } from "@xlabs/wormhole-connect";
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
import { Chain } from "@wormhole-foundation/sdk";

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
  isRouteSupportedHandler: async (td: any) => {
    // Disable manual NTT for Lido wstETHƒ
    return !(
      td.route === "ManualNtt" &&
      td.fromToken.tokenId !== "native" &&
      [
        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
      ].includes(td.fromToken.tokenId.address)
    );
  },
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

  const config = useMemo(
    () => ({
      ...defaultConfig,
      coingecko: {
        customUrl: "https://bff.wormholescan.io/coingeckoCall",
      },
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
    const timeoutId = setTimeout(() => controller.abort(), 1500); // Abort after 1.5 seconds
    getSortedChains(
      ENV.wormholeConnectConfig.chains as Chain[],
      controller.signal
    ).then((chains) => !!chains && setNetworks(chains));
    return () => {
      clearTimeout(timeoutId); // Clear the timeout
      controller.abort();
    };
  }, []);

  return networks ? config : undefined;
};

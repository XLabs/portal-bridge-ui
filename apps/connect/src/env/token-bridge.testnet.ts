import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  CircleV2ManualRoute,
  DEFAULT_ROUTES,
} from "@xlabs/wormhole-connect";
import type { WormholeConnectConfig } from "@xlabs/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig as WormholeConnectConfig,
    {
      // ui: {
      //   moreChains: { chains: [ALGORAND, ACALA, MORE] },
      // } as NonNullable<WormholeConnectConfig["ui"]>,

      routes: [...DEFAULT_ROUTES, CircleV2ManualRoute],
      rpcs: MAINNET_RPCS,
    }
  ),
};

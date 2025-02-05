import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  MayanRouteWH,
  MayanRouteMCTP,
  MayanRouteSWIFT,
  type WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      // ui: {
      //   moreChains: { chains: [ALGORAND, ACALA, SEI, MORE] },
      // } as WormholeConnectConfig["ui"],
      rpcs: MAINNET_RPCS,
      routes: [
        ...DEFAULT_ROUTES,
        MayanRouteWH as any, // FIXME: Remove this any and fix wh connect type issues
        MayanRouteMCTP,
        MayanRouteSWIFT,
      ],
    }
  ),
};

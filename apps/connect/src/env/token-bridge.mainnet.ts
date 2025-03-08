import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  MayanRouteWH,
  MayanRouteMCTP,
  MayanRouteSWIFT,
  MayanRouteSHUTTLE,
  type WormholeConnectConfig,
} from "@xlabs/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";
import { M0AutomaticRoute } from "@m0-foundation/ntt-sdk-route";

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
        MayanRouteSHUTTLE,
        M0AutomaticRoute,
      ],
    }
  ),
};

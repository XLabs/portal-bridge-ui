import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  nttRoutes,
  type WormholeConnectConfig,
  AutomaticTokenBridgeRouteV3,
} from "@wormhole-foundation/wormhole-connect";
import { Env } from "./common";

const cfg : WormholeConnectConfig = {};
export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: {
    ...ENV_BASE.wormholeConnectConfig,
    tokensConfig: {
    },
    routes: [
      AutomaticTokenBridgeRouteV3,
    ]
  },
};

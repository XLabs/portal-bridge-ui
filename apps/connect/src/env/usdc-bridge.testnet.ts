import { ENV as ENV_BASE } from "./usdc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  CircleV2ManualRoute,
  DEFAULT_ROUTES,
  type WormholeConnectConfig,
} from "@xlabs/wormhole-connect";
import { Env } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      routes: [
        ...DEFAULT_ROUTES,
        //MayanRouteSHUTTLE as any,
        CircleV2ManualRoute,
      ],
      chains: [
        "Sepolia",
        "Avalanche",
        "ArbitrumSepolia",
        "OptimismSepolia",
        "BaseSepolia",
        "PolygonSepolia",
        "Solana",
        "Sui",
        "Aptos",
        "Unichain",
      ],
    }
  ),
};

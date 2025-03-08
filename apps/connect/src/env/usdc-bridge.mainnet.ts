import { ENV as ENV_BASE } from "./usdc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  MayanRouteSHUTTLE,
  type WormholeConnectConfig,
} from "@xlabs/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: MAINNET_RPCS,
      routes: [
        ...DEFAULT_ROUTES,
        MayanRouteSHUTTLE as any,
      ],
      chains: [
        "Ethereum",
        "Avalanche",
        "Arbitrum",
        "Optimism",
        "Base",
        "Polygon",
        "Solana",
        "Sui",
        "Aptos",
        "Unichain",
      ],
    }
  ),
};

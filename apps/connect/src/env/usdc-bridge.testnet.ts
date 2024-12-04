import { ENV as ENV_BASE } from "./usdc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, TESTNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: TESTNET_RPCS,
      chains: [
        "Sepolia",
        "Avalanche",
        "ArbitrumSepolia",
        "OptimismSepolia",
        "BaseSepolia",
        "PolygonSepolia",
        "Solana",
      ],
    }
  ),
};

import { ENV as ENV_BASE } from "./usdc-bridge.common";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      networks: [
        "goerli",
        "fuji",
        "arbitrumgoerli",
        "optimismgoerli",
        "basegoerli",
        "mumbai",
        "solana",
      ],
    }
  ),
};

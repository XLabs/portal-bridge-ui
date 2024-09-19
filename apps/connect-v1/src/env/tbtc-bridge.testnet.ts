import { ENV as ENV_BASE } from "./tbtc-bridge";
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
        "mumbai",
        "optimismgoerli",
        "arbitrumgoerli",
        "basegoerli",
        "solana",
      ],
    }
  ),
};

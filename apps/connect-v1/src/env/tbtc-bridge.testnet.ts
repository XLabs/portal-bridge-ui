import { ENV as ENV_BASE } from "./tbtc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, TESTNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: TESTNET_RPCS,
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

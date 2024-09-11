import { ENV as ENV_BASE } from "./tbtc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: MAINNET_RPCS,
      networks: [
        "ethereum",
        "polygon",
        "optimism",
        "arbitrum",
        "base",
        "solana",
      ],
    }
  ),
};

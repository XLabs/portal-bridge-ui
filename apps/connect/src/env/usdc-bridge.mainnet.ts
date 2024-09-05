import { ENV as ENV_BASE } from "./usdc-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS_V2 } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig as WormholeConnectConfig,
    {
      rpcs: MAINNET_RPCS_V2,
      chains: [
        "Ethereum",
        "Avalanche",
        "Arbitrum",
        "Optimism",
        "Base",
        "Polygon",
        "Solana",
      ],
    }
  ),
};

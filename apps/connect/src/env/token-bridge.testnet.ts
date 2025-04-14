import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import { DEFAULT_ROUTES } from "@wormhole-foundation/wormhole-connect";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig as WormholeConnectConfig,
    {
      // ui: {
      //   moreChains: { chains: [ALGORAND, ACALA, MORE] },
      // } as NonNullable<WormholeConnectConfig["ui"]>,
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
        "Fantom",
        "Bsc",
        "Celo",
        "Moonbeam",
        "Klaytn",
        "Berachain",
        "Injective",
        "Xlayer",
        "Mantle",
        "Worldchain",
      ],
      routes: [...DEFAULT_ROUTES, //CircleV2ManualRoute
      ],
    }
  ),
};

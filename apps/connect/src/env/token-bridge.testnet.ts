import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  type WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { Env } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig as WormholeConnectConfig,
    {
      // ui: {
      //   moreChains: { chains: [ALGORAND, ACALA, MORE] },
      // } as NonNullable<WormholeConnectConfig["ui"]>,
      tokensConfig: {
        Wsolana: {
          key: "Wsolana",
          symbol: "W",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "EetppHswYvV1jjRWoQKC1hejdeBDHR9NNzNtCyRQfrrQ",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 6,
        },
        Wsepolia: {
          key: "Wsepolia",
          symbol: "Ws",
          nativeChain: "Sepolia",
          tokenId: {
            chain: "Sepolia",
            address: "0x738141EFf659625F2eAD4feECDfCD94155C67f18",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Warbitrum_sepolia: {
          key: "Warbitrum_sepolia",
          symbol: "Ws",
          nativeChain: "ArbitrumSepolia",
          tokenId: {
            chain: "ArbitrumSepolia",
            address: "0x395D3C74232D12916ecA8952BA352b4d27818035",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Wbase_sepolia: {
          key: "Wbase_sepolia",
          symbol: "Ws",
          nativeChain: "BaseSepolia",
          tokenId: {
            chain: "BaseSepolia",
            address: "0x1d30E78B7C7fbbcef87ae6e97B5389b2e470CA4a",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Woptimism_sepolia: {
          key: "Woptimism_sepolia",
          symbol: "Ws",
          nativeChain: "OptimismSepolia",
          tokenId: {
            chain: "OptimismSepolia",
            address: "0xdDFeABcCf2063CD66f53a1218e23c681Ba6e7962",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
      },
      routes: [...DEFAULT_ROUTES],
    }
  ),
};

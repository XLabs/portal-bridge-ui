import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  nttRoutes,
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
      routes: [
        ...DEFAULT_ROUTES,
        ...nttRoutes({
          tokens: {
            W: [
              {
                chain: "Solana",
                manager: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                token: "EetppHswYvV1jjRWoQKC1hejdeBDHR9NNzNtCyRQfrrQ",
                transceiver: [
                  {
                    address: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
              {
                chain: "Sepolia",
                manager: "0x06413c42e913327Bc9a08B7C1E362BAE7C0b9598",
                token: "0x738141EFf659625F2eAD4feECDfCD94155C67f18",
                transceiver: [
                  {
                    address: "0x649fF7B32C2DE771043ea105c4aAb2D724497238",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "ArbitrumSepolia",
                manager: "0xCeC6FB4F352bf3DC2b95E1c41831E4D2DBF9a35D",
                token: "0x395D3C74232D12916ecA8952BA352b4d27818035",
                transceiver: [
                  {
                    address: "0xfA42603152E4f133F5F3DA610CDa91dF5821d8bc",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "BaseSepolia",
                manager: "0x8b9E328bE1b1Bc7501B413d04EBF7479B110775c",
                token: "0x1d30E78B7C7fbbcef87ae6e97B5389b2e470CA4a",
                transceiver: [
                  {
                    address: "0x149987472333cD48ac6D28293A338a1EEa6Be7EE",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "OptimismSepolia",
                manager: "0x27F9Fdd3eaD5aA9A5D827Ca860Be28442A1e7582",
                token: "0xdDFeABcCf2063CD66f53a1218e23c681Ba6e7962",
                transceiver: [
                  {
                    address: "0xeCF0496DE01e9Aa4ADB50ae56dB550f52003bdB7",
                    type: "wormhole",
                  },
                ],
              },
            ],
          },
        }),
      ],
    }
  ),
};

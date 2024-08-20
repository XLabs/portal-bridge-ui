import { ALGORAND, ACALA, MORE, ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import { TESTNET } from "@wormhole-foundation/wormhole-connect";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      networks: [...Object.keys(TESTNET.chains)],
      moreNetworks: {
        networks: [ALGORAND, ACALA, MORE],
      } as WormholeConnectConfig["moreNetworks"],
      tokensConfig: {
        Wsolana: {
          key: "Wsolana",
          symbol: "W",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "EetppHswYvV1jjRWoQKC1hejdeBDHR9NNzNtCyRQfrrQ",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        Wsepolia: {
          key: "Wsepolia",
          symbol: "Ws",
          nativeChain: "sepolia",
          tokenId: {
            chain: "sepolia",
            address: "0x738141EFf659625F2eAD4feECDfCD94155C67f18",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Warbitrum_sepolia: {
          key: "Warbitrum_sepolia",
          symbol: "Ws",
          nativeChain: "arbitrum_sepolia",
          tokenId: {
            chain: "arbitrum_sepolia",
            address: "0x395D3C74232D12916ecA8952BA352b4d27818035",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Wbase_sepolia: {
          key: "Wbase_sepolia",
          symbol: "Ws",
          nativeChain: "base_sepolia",
          tokenId: {
            chain: "base_sepolia",
            address: "0x1d30E78B7C7fbbcef87ae6e97B5389b2e470CA4a",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Woptimism_sepolia: {
          key: "Woptimism_sepolia",
          symbol: "Ws",
          nativeChain: "optimism_sepolia",
          tokenId: {
            chain: "optimism_sepolia",
            address: "0xdDFeABcCf2063CD66f53a1218e23c681Ba6e7962",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
      },
      nttGroups: {
        W: {
          nttManagers: [
            {
              chainName: "solana",
              address: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
              tokenKey: "Wsolana",
              transceivers: [
                {
                  address: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                  type: "wormhole",
                },
              ],
              solanaQuoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
            },
            {
              chainName: "sepolia",
              address: "0x06413c42e913327Bc9a08B7C1E362BAE7C0b9598",
              tokenKey: "Wsepolia",
              transceivers: [
                {
                  address: "0x649fF7B32C2DE771043ea105c4aAb2D724497238",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum_sepolia",
              address: "0xCeC6FB4F352bf3DC2b95E1c41831E4D2DBF9a35D",
              tokenKey: "Warbitrum_sepolia",
              transceivers: [
                {
                  address: "0xfA42603152E4f133F5F3DA610CDa91dF5821d8bc",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "base_sepolia",
              address: "0x8b9E328bE1b1Bc7501B413d04EBF7479B110775c",
              tokenKey: "Wbase_sepolia",
              transceivers: [
                {
                  address: "0x149987472333cD48ac6D28293A338a1EEa6Be7EE",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "optimism_sepolia",
              address: "0x27F9Fdd3eaD5aA9A5D827Ca860Be28442A1e7582",
              tokenKey: "Woptimism_sepolia",
              transceivers: [
                {
                  address: "0xeCF0496DE01e9Aa4ADB50ae56dB550f52003bdB7",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
      },
    }
  ),
};

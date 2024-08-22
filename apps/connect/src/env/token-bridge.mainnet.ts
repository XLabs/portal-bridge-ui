import { ACALA, ALGORAND, MORE, SEI, ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: MAINNET_RPCS,
      moreNetworks: {
        networks: [ALGORAND, ACALA, SEI, MORE],
      } as WormholeConnectConfig["moreNetworks"],
      tokensConfig: {
        $WIF: {
          key: "$WIF",
          symbol: "$WIF",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          },
          icon: "https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
          coinGeckoId: "dogwifcoin",
          color: "",
          decimals: {
            default: 6,
          },
        },
        ETHFIethereum: {
          key: "ETHFIethereum",
          symbol: "ETHFI",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb",
          },
          icon: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg?1710254562",
          coinGeckoId: "ether-fi",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        ETHFIarbitrum: {
          key: "ETHFIarbitrum",
          symbol: "ETHFI",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27",
          },
          icon: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg?1710254562",
          coinGeckoId: "ether-fi",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        WOM: {
          key: "WOM",
          symbol: "WOM",
          nativeChain: "bsc",
          tokenId: {
            chain: "bsc",
            address: "0xad6742a35fb341a9cc6ad674738dd8da98b94fb1",
          },
          icon: "https://assets.coingecko.com/coins/images/26946/standard/Wombat_Token.png?1696526001",
          coinGeckoId: "wombat-exchange",
          decimals: {
            Ethereum: 18,
            default: 8,
          },
          //Ehtereum, Avalanche, Base, Scroll, Optimism, Arbitrum, BNB Chain
          foreignAssets: {
            ethereum: {
              address: "0xc0B314a8c08637685Fc3daFC477b92028c540CFB",
              decimals: 18,
            },
            avalanche: {
              address: "0xa15E4544D141aa98C4581a1EA10Eb9048c3b3382",
              decimals: 18,
            },
            base: {
              address: "0xD9541B08B375D58ae104EC247d7443D2D7235D64",
              decimals: 18,
            },
            scroll: {
              address: "0x1a7aD8A6171A1EA84DD1E6d649cbd616189660D9",
              decimals: 18,
            },
            optimism: {
              address: "0xD2612B256F6f76feA8C6fbca0BF3166D0d13a668",
              decimals: 18,
            },
            arbitrum: {
              address: "0x7B5EB3940021Ec0e8e463D5dBB4B7B09a89DDF96",
              decimals: 18,
            },
          },
        },
        "USDC.e": {
          key: "USDC.e",
          symbol: "USDC.e",
          nativeChain: "polygon",
          tokenId: {
            chain: "polygon",
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          },
          icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='86977684-12db-4850-8f30-233a7c267d11' width='2000' height='2000' viewBox='0 0 2000 2000' style='max-height: 100%25%3b max-width: 100%25%3b'%3e%3cpath fill='%232775ca' d='M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z'%3e%3c/path%3e%3cpath fill='white' d='M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z'%3e%3c/path%3e%3cpath fill='white' d='M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zm441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z'%3e%3c/path%3e%3c/svg%3e",
          coinGeckoId: "bridged-usdc-polygon-pos-bridge",
          color: "#FC8E03",
          decimals: {
            default: 6,
          },
          foreignAssets: {
            ethereum: {
              address: "0x566957eF80F9fd5526CD2BEF8BE67035C0b81130",
              decimals: 6,
            },
            bsc: {
              address: "0x672147dD47674757C457eB155BAA382cc10705Dd",
              decimals: 6,
            },
            avalanche: {
              address: "0x543672E9CBEC728CBBa9C3Ccd99ed80aC3607FA8",
              decimals: 6,
            },
            sui: {
              address:
                "0xcf72ec52c0f8ddead746252481fb44ff6e8485a39b803825bde6b00d77cdb0bb::coin::COIN",
              decimals: 6,
            },
            aptos: {
              address:
                "0xc7160b1c2415d19a88add188ec726e62aab0045f0aed798106a2ef2994a9101e::coin::T",
              decimals: 6,
            },
            arbitrum: {
              address: "0x9A3Fba8a0870Fb9765023681DAa5390C7919C916",
              decimals: 6,
            },
            fantom: {
              address: "0x6e0e8cf6Ad151e1260A4D398faaEDFC450A9f00a",
              decimals: 6,
            },
            base: {
              address: "0x59f4f969dd3A91A943651C9625E96822DC84Ef94",
              decimals: 6,
            },
            celo: {
              address: "0x0E21B5BdFb6eDBa7d903a610d4DE2F8c72586017",
              decimals: 6,
            },
          },
        },
        BONK: {
          key: "BONK",
          symbol: "BONK",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          },
          icon: "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
          coinGeckoId: "bonk",
          color: "#FC8E03",
          decimals: {
            default: 5,
          },
          foreignAssets: {
            ethereum: {
              address: "0x1151CB3d861920e07a38e03eEAd12C32178567F6",
              decimals: 5,
            },
            bsc: {
              address: "0xA697e272a73744b343528C3Bc4702F2565b2F422",
              decimals: 5,
            },
            polygon: {
              address: "0xe5B49820e5A1063F6F4DdF851327b5E8B2301048",
              decimals: 5,
            },
            avalanche: {
              address: "0xC07C98a93591504584738e4569928DDb3b9f12A7",
              decimals: 5,
            },
            sui: {
              address:
                "0x6907963ca849faff0957b9a8269a7a07065e3def2eef49cc33b50ab946ea5a9f::coin::COIN",
              decimals: 5,
            },
            aptos: {
              address:
                "0x2a90fae71afc7460ee42b20ee49a9c9b29272905ad71fef92fbd8b3905a24b56::coin::T",
              decimals: 5,
            },
            arbitrum: {
              address: "0x09199d9A5F4448D0848e4395D065e1ad9c4a1F74",
              decimals: 5,
            },
            wormchain: {
              address:
                "wormhole10qt8wg0n7z740ssvf3urmvgtjhxpyp74hxqvqt7z226gykuus7eq9mpu8u",
              decimals: 5,
            },
            osmosis: {
              address:
                "ibc/CA3733CB0071F480FAE8EF0D9C3D47A49C6589144620A642BBE0D59A293D110E",
              decimals: 5,
            },
            fantom: {
              address: "0x3fEcdF1248fe7642d29f879a75CFC0339659ab93",
              decimals: 5,
            },
            base: {
              address: "0xDF1Cf211D38E7762c9691Be4D779A441a17A6cFC",
              decimals: 5,
            },
            celo: {
              address: "0x3fc50bc066aE2ee280876EeefADfdAbF6cA02894",
              decimals: 5,
            },
          },
        },
        Wsolana: {
          key: "Wsolana",
          symbol: "W",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        Wethereum: {
          key: "Wethereum",
          symbol: "W",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        Warbitrum: {
          key: "Warbitrum",
          symbol: "W",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        Woptimism: {
          key: "Woptimism",
          symbol: "W",
          nativeChain: "optimism",
          tokenId: {
            chain: "optimism",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        Wbase: {
          key: "Wbase",
          symbol: "W",
          nativeChain: "base",
          tokenId: {
            chain: "base",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: {
            Ethereum: 18,
            default: 8,
            Solana: 6,
          },
        },
        osETHethereum: {
          key: "osETHethereum",
          symbol: "osETH",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
          },
          icon: "https://coin-images.coingecko.com/coins/images/33117/large/Frame_27513839.png?1700732599",
          coinGeckoId: "stakewise-staked-eth",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        osETHarbitrum: {
          key: "osETHarbitrum",
          symbol: "osETH",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0xf7d4e7273E5015C96728A6b02f31C505eE184603",
          },
          icon: "https://coin-images.coingecko.com/coins/images/33117/large/Frame_27513839.png?1700732599",
          coinGeckoId: "stakewise-staked-eth",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        "wstETH ": {
          key: "wstETH ",
          symbol: "wstETH ",
          nativeChain: "bsc",
          tokenId: {
            chain: "bsc",
            address: "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
          },
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9Im1heC1oZWlnaHQ6IDEwMCU7IG1heC13aWR0aDogMTAwJTsiPjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMjU2IiBmaWxsPSIjMDBBM0ZGIj48L3JlY3Q+PHBhdGggb3BhY2l0eT0iMC42IiBkPSJNMzYxLjAxMiAyMzcuODEyTDM2My44NzggMjQyLjIwOUMzOTYuMjA0IDI5MS43OTggMzg4Ljk4NCAzNTYuNzQyIDM0Ni41MiAzOTguMzQ4QzMyMS41MzkgNDIyLjgyNiAyODguNzk4IDQzNS4wNjYgMjU2LjA1NiA0MzUuMDY5QzI1Ni4wNTYgNDM1LjA2OSAyNTYuMDU2IDQzNS4wNjkgMzYxLjAxMiAyMzcuODEyWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0yNTYuMDQ0IDI5Ny43NjRMMzYxIDIzNy44MTJDMjU2LjA0NSA0MzUuMDY5IDI1Ni4wNDQgNDM1LjA2OSAyNTYuMDQ0IDQzNS4wNjlDMjU2LjA0NCAzOTIuMTA4IDI1Ni4wNDQgMzQyLjg4IDI1Ni4wNDQgMjk3Ljc2NFoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTE1MC45ODggMjM3LjgxMkwxNDguMTIyIDI0Mi4yMDlDMTE1Ljc5NiAyOTEuNzk4IDEyMy4wMTYgMzU2Ljc0MiAxNjUuNDggMzk4LjM0OEMxOTAuNDYxIDQyMi44MjYgMjIzLjIwMiA0MzUuMDY2IDI1NS45NDQgNDM1LjA2OUMyNTUuOTQ0IDQzNS4wNjkgMjU1Ljk0NCA0MzUuMDY5IDE1MC45ODggMjM3LjgxMloiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggb3BhY2l0eT0iMC42IiBkPSJNMjU1LjkxNCAyOTcuNzY0TDE1MC45NTggMjM3LjgxMkMyNTUuOTE0IDQzNS4wNjkgMjU1LjkxNCA0MzUuMDY5IDI1NS45MTQgNDM1LjA2OUMyNTUuOTE0IDM5Mi4xMDggMjU1LjkxNCAzNDIuODggMjU1LjkxNCAyOTcuNzY0WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0yNTYuMDgzIDE2My44MzNWMjY3LjIzM0wzNDYuNDkxIDIxNS41NjZMMjU2LjA4MyAxNjMuODMzWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjYiIGQ9Ik0yNTYuMDU2IDE2My44MzNMMTY1LjU4MyAyMTUuNTY1TDI1Ni4wNTYgMjY3LjIzM1YxNjMuODMzWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMjU2LjA1NiA3Ni44NzVMMTY1LjU4MyAyMTUuNTk5TDI1Ni4wNTYgMTYzLjcyMlY3Ni44NzVaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIG9wYWNpdHk9IjAuNiIgZD0iTTI1Ni4wODMgMTYzLjcwNkwzNDYuNTYgMjE1LjU4NUwyNTYuMDgzIDc2Ljc5MTZWMTYzLjcwNloiIGZpbGw9IndoaXRlIj48L3BhdGg+PC9zdmc+Cgo=",
          coinGeckoId: "wrapped-steth",
          color: "#3AA3FF",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Yakusolana: {
          key: "Yakusolana",
          symbol: "Yaku",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "AqEHVh8J2nXH9saV2ciZyYwPpqWFRfD2ffcq5Z8xxqm5",
          },
          icon: "https://assets.coingecko.com/coins/images/26785/standard/yaku_logo.png?1706636424",
          coinGeckoId: "yaku",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        Yakuethereum: {
          key: "Yakuethereum",
          symbol: "Yaku",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0x1155DB64b59265F57533bC0f9AE012FfFd34eB7F",
          },
          icon: "https://assets.coingecko.com/coins/images/26785/standard/yaku_logo.png?1706636424",
          coinGeckoId: "yaku",
          decimals: {
            default: 8,
            Ethereum: 9,
          },
        },
        Yakuarbitrum: {
          key: "Yakuarbitrum",
          symbol: "Yaku",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0xB00eaEDB98F1e30ad545703d8Ff14b24D109514f",
          },
          icon: "https://assets.coingecko.com/coins/images/26785/standard/yaku_logo.png?1706636424",
          coinGeckoId: "yaku",
          decimals: {
            default: 8,
            Ethereum: 9,
          },
        },
        Yakuavalanche: {
          key: "Yakuavalanche",
          symbol: "Yaku",
          nativeChain: "avalanche",
          tokenId: {
            chain: "avalanche",
            address: "0xB00eaEDB98F1e30ad545703d8Ff14b24D109514f",
          },
          icon: "https://assets.coingecko.com/coins/images/26785/standard/yaku_logo.png?1706636424",
          coinGeckoId: "yaku",
          decimals: {
            default: 8,
            Ethereum: 9,
          },
        },
        WeatherXMethereum: {
          key: "WeatherXMethereum",
          symbol: "WXM",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0xde654f497a563dd7a121c176a125dd2f11f13a83",
          },
          icon: "https://assets.coingecko.com/coins/images/38154/standard/weatherxm-network-logo.png?1716668976",
          coinGeckoId: "weatherxm-network",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        WeatherXMsolana: {
          key: "WeatherXMsolana",
          symbol: "WXM",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "wxmJYe17a2oGJZJ1wDe6ZyRKUKmrLj2pJsavEdTVhPP",
          },
          icon: "https://assets.coingecko.com/coins/images/38154/standard/weatherxm-network-logo.png?1716668976",
          coinGeckoId: "weatherxm-network",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        JitoSOLsolana: {
          key: "JitoSOLsolana",
          symbol: "JITOSOL",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
          },
          icon: "https://assets.coingecko.com/coins/images/28046/standard/JitoSOL-200.png?1696527060",
          coinGeckoId: "jito-staked-sol",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        JitoSOLarbitrum: {
          key: "JitoSOLarbitrum",
          symbol: "JITOSOL",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0x83e1d2310Ade410676B1733d16e89f91822FD5c3",
          },
          icon: "https://assets.coingecko.com/coins/images/28046/standard/JitoSOL-200.png?1696527060",
          coinGeckoId: "jito-staked-sol",
          decimals: {
            default: 8,
            Ethereum: 9,
          },
        },
        Swissborgethereum: {
          key: "Swissborgethereum",
          symbol: "BORG",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0x64d0f55Cd8C7133a9D7102b13987235F486F2224",
          },
          icon: "https://assets.coingecko.com/coins/images/2117/standard/YJUrRy7r_400x400.png?1696503083",
          coinGeckoId: "swissborg",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Swissborgsolana: {
          key: "Swissborgsolana",
          symbol: "BORG",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "3dQTr7ror2QPKQ3GbBCokJUmjErGg8kTJzdnYjNfvi3Z",
          },
          icon: "https://assets.coingecko.com/coins/images/2117/standard/YJUrRy7r_400x400.png?1696503083",
          coinGeckoId: "swissborg",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        Agoraethereum: {
          key: "Agoraethereum",
          symbol: "AGA",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0x87B46212e805A3998B7e8077E9019c90759Ea88C",
          },
          icon: "https://assets.coingecko.com/coins/images/38230/standard/agora-avatar-black.png?1716828738",
          coinGeckoId: "agorahub",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Agorasolana: {
          key: "Agorasolana",
          symbol: "AGA",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "AGAxefyrPTi63FGL2ukJUTBtLJStDpiXMdtLRWvzambv",
          },
          icon: "https://assets.coingecko.com/coins/images/38230/standard/agora-avatar-black.png?1716828738",
          coinGeckoId: "agorahub",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        XBorgethereum: {
          key: "XBorgethereum",
          symbol: "XBG",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0xEaE00D6F9B16Deb1BD584c7965e4c7d762f178a1",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        XBorgarbitrum: {
          key: "XBorgarbitrum",
          symbol: "XBG",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0x93FA0B88C0C78e45980Fa74cdd87469311b7B3E4",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        XBorgsolana: {
          key: "XBorgsolana",
          symbol: "XBG",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "XBGdqJ9P175hCC1LangCEyXWNeCPHaKWA17tymz2PrY",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "",
          decimals: {
            default: 8,
            Solana: 9,
          },
        },
        Cheesearbitrum: {
          key: "Cheesearbitrum",
          symbol: "CHEESE",
          nativeChain: "arbitrum",
          tokenId: {
            chain: "arbitrum",
            address: "0x05AEa20947A9A376eF50218633BB0a5A05d40A0C",
          },
          icon: "https://assets.coingecko.com/coins/images/37156/standard/cheese_icon_500x500.png?1713499473",
          coinGeckoId: "cheese-2",
          decimals: {
            default: 8,
            Ethereum: 18,
          },
        },
        Cheesesolana: {
          key: "Cheesesolana",
          symbol: "CHEESE",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "AbrMJWfDVRZ2EWCQ1xSCpoVeVgZNpq1U2AoYG98oRXfn",
          },
          icon: "https://assets.coingecko.com/coins/images/37156/standard/cheese_icon_500x500.png?1713499473",
          coinGeckoId: "cheese-2",
          decimals: {
            default: 6,
          },
        },
        RenzoEthereum: {
          key: "RenzoEthereum",
          symbol: "REZ",
          nativeChain: "ethereum",
          tokenId: {
            chain: "ethereum",
            address: "0x3B50805453023a91a8bf641e279401a0b23FA6F9",
          },
          icon: "https://assets.coingecko.com/coins/images/37327/standard/renzo_200x200.png?1714025012",
          coinGeckoId: "renzo",
          decimals: {
            default: 8,
            Solana: 9,
            Ethereum: 18,
          },
        },
        RenzoSolana: {
          key: "RenzoSolana",
          symbol: "REZ",
          nativeChain: "solana",
          tokenId: {
            chain: "solana",
            address: "3DK98MXPz8TRuim7rfQnebSLpA7VSoc79Bgiee1m4Zw5",
          },
          icon: "https://assets.coingecko.com/coins/images/37327/standard/renzo_200x200.png?1714025012",
          coinGeckoId: "renzo",
          decimals: {
            default: 8,
            Ethereum: 18,
            Solana: 9,
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
              chainName: "ethereum",
              address: "0xc072B1AEf336eDde59A049699Ef4e8Fa9D594A48",
              tokenKey: "Wethereum",
              transceivers: [
                {
                  address: "0xDb55492d7190D1baE8ACbE03911C4E3E7426870c",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
              tokenKey: "Warbitrum",
              transceivers: [
                {
                  address: "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "optimism",
              address: "0x1a4F1a790f23Ffb9772966cB6F36dCd658033e13",
              tokenKey: "Woptimism",
              transceivers: [
                {
                  address: "0x9bD8b7b527CA4e6738cBDaBdF51C22466756073d",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "base",
              address: "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
              tokenKey: "Wbase",
              transceivers: [
                {
                  address: "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        osETH: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0x896b78fd7e465fb22e80c34ff8f1c5f62fa2c009",
              tokenKey: "osETHethereum",
              transceivers: [
                {
                  address: "0xAAFE766B966219C2f3F4271aB8D0Ff1883147AB6",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x485F6Ac6a3B97690910C1546842FfE0629582aD3",
              tokenKey: "osETHarbitrum",
              transceivers: [
                {
                  address: "0xAf7ae721070c25dF97043381509DBc042e65736F",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Lido_wstETH: {
          displayName: "NTT: Wormhole + Axelar",
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0xb948a93827d68a82F6513Ad178964Da487fe2BD9",
              tokenKey: "wstETH",
              transceivers: [
                {
                  address: "0xA1ACC1e6edaB281Febd91E3515093F1DE81F25c0",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "bsc",
              address: "0x6981F5621691CBfE3DdD524dE71076b79F0A0278",
              tokenKey: "wstETH ",
              transceivers: [
                {
                  address: "0xbe3F7e06872E0dF6CD7FF35B7aa4Bb1446DC9986",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        ETHFI: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0x344169Cc4abE9459e77bD99D13AA8589b55b6174",
              tokenKey: "ETHFIethereum",
              transceivers: [
                {
                  address: "0x3bf4AebcaD920447c5fdD6529239Ab3922ce2186",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x90A82462258F79780498151EF6f663f1D4BE4E3b",
              tokenKey: "ETHFIarbitrum",
              transceivers: [
                {
                  address: "0x4386e36B96D437b0F1C04A35E572C10C6627d88a",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Yaku: {
          nttManagers: [
            {
              chainName: "solana",
              address: "nTtPcmsVY4f86cSREmnio5tUyiK58HBqBeDwaUYQt6t",
              tokenKey: "Yakusolana",
              transceivers: [
                {
                  address: "6gTkp6F5XhsaeugYEtuQ6qmuD8qUUdeHrYrN1s1qex7",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "ethereum",
              address: "0x9ad57E28ECc26507FFB18dBc15Ae7B13254B99c7",
              tokenKey: "Yakuethereum",
              transceivers: [
                {
                  address: "0x0e9c1B26Ee0D3021e4543c2Ed65a9661AC390390",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x650613DbD0b422cD7f7c06a8a07Dc2C5880b54b3",
              tokenKey: "Yakuarbitrum",
              transceivers: [
                {
                  address: "0x19c19B3151AEa35eE19E018ed24D81F892b6C18E",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "avalanche",
              address: "0xbeEDEcF091DDAC6a494A718666f94d8A1d5Ab984",
              tokenKey: "Yakuavalanche",
              transceivers: [
                {
                  address: "0x0a5C77B838D22E8156D62e7845Fb73e948CAc299",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        WeatherXM: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0xd24afd8eca7b51bcf3c0e6b3ca94c301b121ccce",
              tokenKey: "WeatherXMethereum",
              transceivers: [
                {
                  address: "0x8b209672c2120f84ceb70b22416645f8912ad0f0",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "solana",
              address: "NttWixqwUHAnpXym3UYUySQZtb4C57EZxpH721JfLyF",
              tokenKey: "WeatherXMsolana",
              transceivers: [
                {
                  address: "PaK4UctEGihEm37c2qSrbpkucHBBDDqbvYzGXygbxkb",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        JitoSOL: {
          nttManagers: [
            {
              chainName: "solana",
              address: "nTTJS9XtWhfHkPiLmddSmdMrCJAtJrSCjPwuns3fvu5",
              tokenKey: "JitoSOLsolana",
              transceivers: [
                {
                  address: "nTTJS9XtWhfHkPiLmddSmdMrCJAtJrSCjPwuns3fvu5",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x02f5FB92F3794C535b1523183A417fB9efbB4f5d",
              tokenKey: "JitoSOLarbitrum",
              transceivers: [
                {
                  address: "0x89E928e6D95BA6D7419B2b9e384fC526b1649339",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Swissborg: {
          nttManagers: [
            {
              chainName: "solana",
              address: "NttBm3HouTCFnUBz32fEs5joQFRjFoJPA8AyhtgjFrw",
              tokenKey: "Swissborgsolana",
              transceivers: [
                {
                  address: "39eUvaqshuCbTo7CmQkHG7zBBLaDAPK3qg89cMSmqKWx",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "ethereum",
              address: "0x66a28B080918184851774a89aB94850a41f6a1e5",
              tokenKey: "Swissborgethereum",
              transceivers: [
                {
                  address: "0x45E581d6841F0a99Fc34F70871ef56b353813ddb",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Agora: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0xCD024C7eB854f6799A343828773cB3A8107d17d4q",
              tokenKey: "Agoraethereum",
              transceivers: [
                {
                  address: "0x6eB0d287A539AAB2eB962De550Fe5dDA29b0fe52",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "solana",
              address: "NttADdCvGLUhukNyePei9CkmHoe6S9xjqgqfQv51PQg",
              tokenKey: "Agorasolana",
              transceivers: [
                {
                  address: "4FnEwHLcuu3CHf8YG31RWBCVpshGGxNyfYAszq2JABxi",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        XBorg: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0xa4489105efa4b029485d6bd3A4f52131baAE4B1B",
              tokenKey: "XBorgethereum",
              transceivers: [
                {
                  address: "0x7135766F279b9A50F7A7199cfF1be284521a0409",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "arbitrum",
              address: "0x7135766F279b9A50F7A7199cfF1be284521a0409",
              tokenKey: "XBorgarbitrum",
              transceivers: [
                {
                  address: "0x874303ba6a34fC33ADcdFFd4293a41f32246D6a0",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "solana",
              address: "NttXP2tPLxGkNA3yrSfFZbtDbfKPKBrJUR6Jcqh6sRi",
              tokenKey: "XBorgsolana",
              transceivers: [
                {
                  address: "328hfTbiEzfbXSHCWqrBg3g1VZ9bRxNtUTffjQ4Tqark",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Cheese: {
          nttManagers: [
            {
              chainName: "arbitrum",
              address: "0xfC843c4B402634a8Fc02137AAa7942474e043d72",
              tokenKey: "Cheesearbitrum",
              transceivers: [
                {
                  address: "0x33D2E8093143a317234cB070C2BB6A641dDeFA4d",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "solana",
              address: "NTtxeqz2XjMnpcEoWMqb6pz84zHweJRYWyzmsmmW49E",
              tokenKey: "Cheesesolana",
              transceivers: [
                {
                  address: "AoUmFKEGhsfnJSny6fMDF3JMgyEgjoG4yAk8YFGbfp6c",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        "USDC.e": {
          nttManagers: [
            {
              chainName: "fantom",
              address: "0x68dB2f05Aa2d77DEf981fd2be32661340c9222FB",
              tokenKey: "USDCfantom",
              transceivers: [
                {
                  address: "0x8b47f02E7E20174C76Af910adc0Ad8A4B0342f4c",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "ethereum",
              address: "0xeBdCe9a913d9400EE75ef31Ce8bd34462D01a1c1",
              tokenKey: "USDCeth",
              transceivers: [
                {
                  address: "0x55f7820357FA17A1ECb48E959D5E637bFF956d6F",
                  type: "wormhole",
                },
              ],
            },
          ],
        },
        Renzo: {
          nttManagers: [
            {
              chainName: "ethereum",
              address: "0x4ba5ea226da36466EA7EbCf018df66a615D27c7c",
              tokenKey: "RenzoEthereum",
              transceivers: [
                {
                  address: "0x591Be6DBC81D65924dcC78912bBC9306D09c2faa",
                  type: "wormhole",
                },
              ],
            },
            {
              chainName: "solana",
              address: "NtTtwqVX4SCNECrZ8ZmEaxAPFcm5r7Szx4tBmYLU17p",
              tokenKey: "RenzoSolana",
              transceivers: [
                {
                  address: "DC5fFP5we3qshuoiQ4M7gjBnNKcKaqu4ibheetZeXfCY",
                  type: "wormhole",
                },
              ],
              solanaQuoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
            },
          ],
        },
      },
    }
  ),
};

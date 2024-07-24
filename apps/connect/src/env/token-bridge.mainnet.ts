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
        WIF: {
          key: "WIF",
          symbol: "WIF",
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
            default: 18,
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
            default: 18,
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
            default: 18,
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
            default: 18,
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
      },
    }
  ),
};

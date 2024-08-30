import { defineConfig } from 'vite'
import viteConfig, { chains } from './vite.config'

const PUBLIC_URL = viteConfig.base;

const ADVANCE_TOOLS_HREF = `${PUBLIC_URL}/advanced-tools/`
const USDC_BRIDGE_HREF = `${PUBLIC_URL}/usdc-bridge/`

// https://vitejs.dev/config/
export default defineConfig({
  ...viteConfig,
  base: `${PUBLIC_URL}/w-bridge/`,
  define: {
    ...viteConfig?.define,
    navBar: [
      { label: "Home", active: true, href: `${PUBLIC_URL}/` },
      { label: "USDC", href: USDC_BRIDGE_HREF }
    ],
    redirects: {
      source: [
        "#/nft",
        "#/redeem",
        "#/nft-origin-verifier",
        "#/token-origin-verifier",
        "#/register",
        "#/migrate/Ethereum/:legacyAsset/",
        "#/migrate/BinanceSmartChain/:legacyAsset/",
        "#/migrate/Celo/:legacyAsset/",
        "#/migrate/Ethereum/",
        "#/migrate/BinanceSmartChain/",
        "#/migrate/Celo/",
        "#/stats",
        "#/withdraw-tokens-terra",
        "#/unwrap-native",
        "#/custody-addresses"
      ],
      target: ADVANCE_TOOLS_HREF
    },
    wormholeConnectConfig: {
      ...viteConfig?.define?.wormholeConnectConfig,
      pageHeader: {
        text: 'W Transfer',
        align: 'center'
      },
      cctpWarning: {
        href: USDC_BRIDGE_HREF
      },
      networks: [...chains],
      routes: ["nttRelay"],
      tokensConfig: {
        "Wsolana": {
          "key": "Wsolana",
          "symbol": "W",
          "nativeChain": "solana",
          "tokenId": {
            "chain": "solana",
            "address": "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ"
          },
          "icon": "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          "coinGeckoId": "wormhole",
          "decimals": {
            "default": 6
          }
        },
        "Wethereum": {
          "key": "Wethereum",
          "symbol": "W",
          "nativeChain": "ethereum",
          "tokenId": {
            "chain": "ethereum",
            "address": "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91"
          },
          "icon": "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          "coinGeckoId": "wormhole",
          "decimals": {
            "default": 18
          }
        },
        "Warbitrum": {
          "key": "Warbitrum",
          "symbol": "W",
          "nativeChain": "arbitrum",
          "tokenId": {
            "chain": "arbitrum",
            "address": "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91"
          },
          "icon": "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          "coinGeckoId": "wormhole",
          "decimals": {
            "default": 18
          }
        },
        "Woptimism": {
          "key": "Woptimism",
          "symbol": "W",
          "nativeChain": "optimism",
          "tokenId": {
            "chain": "optimism",
            "address": "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91"
          },
          "icon": "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          "coinGeckoId": "wormhole",
          "decimals": {
            "default": 18
          }
        },
        "Wbase": {
          "key": "Wbase",
          "symbol": "W",
          "nativeChain": "base",
          "tokenId": {
            "chain": "base",
            "address": "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91"
          },
          "icon": "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          "coinGeckoId": "wormhole",
          "decimals": {
            "default": 18
          }
        }
      },
      nttGroups: {
        "W": {
          "nttManagers": [
            {
              "chainName": "solana",
              "address": "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
              "tokenKey": "Wsolana",
              "transceivers": [
                {
                  "address": "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                  "type": "wormhole"
                }
              ],
              "solanaQuoter": "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              "alt": "DUJnxSGLn7Mgh1ahP14umL52L7Z5dVpeMBsgr2bvdbHj"
            },
            {
              "chainName": "ethereum",
              "address": "0xc072B1AEf336eDde59A049699Ef4e8Fa9D594A48",
              "tokenKey": "Wethereum",
              "transceivers": [
                {
                  "address": "0xDb55492d7190D1baE8ACbE03911C4E3E7426870c",
                  "type": "wormhole"
                }
              ]
            },
            {
              "chainName": "arbitrum",
              "address": "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
              "tokenKey": "Warbitrum",
              "transceivers": [
                {
                  "address": "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                  "type": "wormhole"
                }
              ]
            },
            {
              "chainName": "optimism",
              "address": "0x1a4F1a790f23Ffb9772966cB6F36dCd658033e13",
              "tokenKey": "Woptimism",
              "transceivers": [
                {
                  "address": "0x9bD8b7b527CA4e6738cBDaBdF51C22466756073d",
                  "type": "wormhole"
                }
              ]
            },
            {
              "chainName": "base",
              "address": "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
              "tokenKey": "Wbase",
              "transceivers": [
                {
                  "address": "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                  "type": "wormhole"
                }
              ]
            }
          ]
        }
      },
    }
  }
})
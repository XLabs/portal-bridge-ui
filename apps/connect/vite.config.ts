import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const rpcs = (chains: string[], template: (chain: string) => string) => chains.map((chain: string) => ({ [chain]: template(chain) })).reduce((acc, cur) => ({ ...acc, ...cur }), {});
const asRpcHost = (chain: string) => `https://and76cjzpa.execute-api.us-east-2.amazonaws.com/${chain}/`;
const chains = [
  "wormchain",
  "osmosis",
  "ethereum",
  "sui",
  "aptos",
  "kujira",
  "evmos",
  "bsc",
  "polygon",
  "avalanche",
  "fantom",
  "celo",
  "moonbeam",
  "base",
  "arbitrum",
  "optimism"
]

const MAINNET_RPCS = {
  rpcs: {
    ...rpcs(chains, asRpcHost),
    solana: "https://wormhole.rpcpool.com/",
  }
}

const VITE_APP_CLUSTER = process.env.VITE_APP_CLUSTER || 'testnet'

const __WORMHOLE_CONNECT_HASH__ = ["wc", process.env.VITE_APP_WORMHOLE_CONNECT_VERSION, `${Date.now()}`]
  .map((v) => v?.trim())
  .join('-') || 'latest';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'pb-[name]-[hash].js',
        assetFileNames: 'pb-[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: [
      { find: '@certusone/wormhole-sdk', replacement: "@certusone/wormhole-sdk/lib/cjs/utils/consts.js" }
    ]
  },
  define: {
    __WORMHOLE_CONNECT_HASH__: JSON.stringify(__WORMHOLE_CONNECT_HASH__),
    redirects: {},
    wormholeConnectConfig: {
      walletConnectProjectId: process.env.VITE_APP_WALLET_CONNECT_PROJECT_ID || '',
      env: process.env.VITE_APP_CLUSTER || 'mainnet',
      ...(process.env.VITE_APP_CLUSTER === 'mainnet' ? MAINNET_RPCS : {}),
      showHamburgerMenu: false,
      explorer: {
        href: `https://wormholescan.io/#/txs?address={:address}&network=${VITE_APP_CLUSTER}`,
      },
      menu: [
        {
          label: 'Advanced Tools',
          href: `${process.env.PUBLIC_URL}/advanced-tools/`,
          order: 1
        }
      ]
    }
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/*.js',
          dest: `assets/${__WORMHOLE_CONNECT_HASH__}/`
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/*.css',
          dest: `assets/${__WORMHOLE_CONNECT_HASH__}/`
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/assets/*.js',
          dest: `assets/${__WORMHOLE_CONNECT_HASH__}/assets`
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/assets/*.css',
          dest: `assets/${__WORMHOLE_CONNECT_HASH__}/assets`
        }
      ]
    })
  ],
})

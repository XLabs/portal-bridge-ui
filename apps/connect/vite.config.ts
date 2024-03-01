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
  },
  rest: {
    osmosis: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/osmosis-rest/",
  }
}

const VITE_APP_CLUSTER = process.env.VITE_APP_CLUSTER || 'testnet'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'pb-[name].js',
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
          dest: 'assets/wormhole-connect/'
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/*.css',
          dest: 'assets/wormhole-connect/'
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/assets/*.js',
          dest: 'assets/wormhole-connect/assets'
        },
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/assets/*.css',
          dest: 'assets/wormhole-connect/assets'
        }
      ]
    })
  ],
})

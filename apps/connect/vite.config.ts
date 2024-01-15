import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const MAINNET_RPCS =  {
  rpcs: {
    wormchain: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/wormchain/",
    solana: "https://wormhole.rpcpool.com/",
    osmosis: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/osmosis/",
    ethereum: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/ethereum/",
    sui: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/sui/",
    aptos: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/aptos/",
    kujira: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/kujira/",
    evmos: "https://and76cjzpa.execute-api.us-east-2.amazonaws.com/evmos/"
  }
}


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
  define: {
    redirects: {},
    wormholeConnectConfig: {
      walletConnectProjectId: process.env.VITE_APP_WALLET_CONNECT_PROJECT_ID || '',
      env: process.env.VITE_APP_CLUSTER || 'mainnet',
      ...(process.env.VITE_APP_CLUSTER === 'mainnet' ? MAINNET_RPCS : {}),
      showHamburgerMenu: false,
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

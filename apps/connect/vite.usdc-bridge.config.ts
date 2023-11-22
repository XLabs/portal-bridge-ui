import { defineConfig } from 'vite'
import viteConfig from './vite.config'

const PUBLIC_URL = viteConfig.base;
const TESTNET_NETWORKS = ['goerli', 'fuji', 'arbitrumgoerli', 'optimismgoerli', 'basegoerli'];
const MAINNET_NETWORKS = ["ethereum", "avalanche", "arbitrum", "optimism", "base"];

// https://vitejs.dev/config/
export default defineConfig({
  ...viteConfig,
  base: `${PUBLIC_URL}/usdc-bridge/`,
  define: {
    navBar: [
      { label: "Home", href: `${PUBLIC_URL}/` },
      { label: "USDC", active: true, href: `${PUBLIC_URL}/usdc-bridge` }
    ],
    wormholeConnectConfig: {
      ...viteConfig?.define?.wormholeConnectConfig,
      pageHeader: 'USDC Bridge',
      routes: ["cctpManual", "cctpRelay"],
      networks: process.env.VITE_APP_CLUSTER === 'mainnet' ? MAINNET_NETWORKS : TESTNET_NETWORKS,
      tokens: ["USDCeth", "USDCavax", "USDCarbitrum", "USDCoptimism", "USDCbase"],
    }
  }
})

import { defineConfig } from 'vite'
import viteConfig from './vite.config'

const PUBLIC_URL = viteConfig.base;

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
      networks: ["ethereum", "avalanche", "arbitrum", "optimism", "base"],
      tokens: ["USDCeth", "USDCavax", "USDCarbitrum", "USDCoptimism", "USDCbase"],
    }
  }
})

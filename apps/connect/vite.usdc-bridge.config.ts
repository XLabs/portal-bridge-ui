import { defineConfig } from 'vite'
import viteConfig from './vite.config'

// https://vitejs.dev/config/
export default defineConfig({
  ...viteConfig,
  define: {
    wormholeConnectConfig: {
      ...viteConfig?.define?.wormholeConnectConfig,
      routes: ["cctpManual", "cctpRelay"],
      networks: ["ethereum", "avalanche", "arbitrum", "optimism", "base"],
      tokens: ["USDCeth", "USDCavax", "USDCarbitrum", "USDCoptimism", "USDCbase"],
    }
  }
})

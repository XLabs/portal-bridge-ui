import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '',
  define: {
    wormholeConnectConfig: {
      env: process.env.VITE_APP_CLUSTER || 'mainnet',
      showHamburgerMenu: false,
      menu: [
        {
          label: 'Advanced Tools',
          href: `${process.env.PUBLIC_URL}/advanced-tools`,
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
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/*',
          dest: 'assets/wormhole-connect/'
        }
      ]
    })
  ],
})

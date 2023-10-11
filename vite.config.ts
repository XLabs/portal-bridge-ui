import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  plugins: [react(), 
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@wormhole-foundation/wormhole-connect/dist/*',
          dest: 'assets/wormhole-connect/'
        }
      ]
    })],
})

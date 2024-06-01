import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import  { resolve } from 'path'
import { lingui } from "@lingui/vite-plugin";

const PUBLIC_URL = process.env.PUBLIC_URL || ""

// https://vitejs.dev/config/
export default defineConfig({
  base: `${PUBLIC_URL}/rewards-dashboard`,
  define: {
    "BASE_URL": `"${PUBLIC_URL}"`,
    navBar: [
      { label: "Home", href: `${PUBLIC_URL}/` },
      { label: "USDC Transfer", href: `${PUBLIC_URL}/usdc-transfer` },
      { label: "Rewards",active: true, href: `${PUBLIC_URL}/rewards-dashboard` },
      { label: "Wormholescan", href: `https://wormholescan.io` }
    ]
  },
  plugins: [
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    lingui(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})

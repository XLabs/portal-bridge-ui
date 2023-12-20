import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const PUBLIC_URL = process.env.PUBLIC_URL || "/rewards-dashboard"
// https://vitejs.dev/config/
export default defineConfig({
  base: PUBLIC_URL,
  define: {
    "BASE_URL": `"${PUBLIC_URL}"`,
  },
  plugins: [react()],
})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || "",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "pb-[name]-[hash].js",
        assetFileNames: "pb-[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@certusone/wormhole-sdk",
        replacement: "@certusone/wormhole-sdk/lib/cjs/utils/consts.js",
      },
    ],
  },
  define: {},
  plugins: [react()],
});

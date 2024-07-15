import { defineConfig } from "vite";
import viteConfig from "./vite.config";
import { resolve } from "path";

const PUBLIC_URL = viteConfig.base;

// https://vitejs.dev/config/
export default defineConfig({
  ...viteConfig,
  resolve: {
    ...viteConfig.resolve,
    alias: [
      ...((viteConfig.resolve?.alias as NonNullable<[]>) || []),
      {
        find: "@env",
        replacement: resolve(
          __dirname,
          `./src/env/usdc-bridge.${process.env.VITE_APP_CLUSTER === "mainnet" ? "mainnet" : "testnet"}.ts`
        ),
      },
    ],
  },
  base: `${PUBLIC_URL}/usdc-bridge/`,
  define: {},
});

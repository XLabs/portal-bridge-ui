import { defineConfig } from "vite";
import viteConfig from "./vite.config";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import packageJson from "./package.json";

const PUBLIC_URL = viteConfig.base;

// https://vitejs.dev/config/
export default defineConfig({
  ...viteConfig,
  resolve: {
    ...viteConfig.resolve,
    alias: [
      ...((viteConfig.resolve?.alias as []) || []),
      {
        find: "@env",
        replacement: resolve(
          __dirname,
          `./src/env/tbtc-bridge.${process.env.VITE_APP_CLUSTER === "mainnet" ? "mainnet" : "testnet"}.ts`
        ),
      },
    ],
  },
  base: `${PUBLIC_URL}/tbtc-bridge/`,
  define: {},
  plugins: [
    ...(viteConfig.plugins as []),
    createHtmlPlugin({
      inject: {
        tags: [
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              name: "tBTC Bridge",
              content: `v${process.env.VITE_APP_VERSION || "0.0.0"}`,
            },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              name: "Wormhole connect",
              content: `v${packageJson.dependencies["@wormhole-foundation/wormhole-connect"]}`,
            },
          },
          {
            injectTo: "head-prepend",
            tag: "title",
            children: "Portal tBTC Bridge",
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:title": "Portal tBTC Bridge" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:url": "https://portalbridge.com/tbtc-bridge" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              name: "description",
              content:
                "Convert some tBTC to ETH, MATIC, BASE, OP, SOL or ARB and use it as gas to pay for transaction fees on the destination network.", 
            },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              property: "og:description",
              content:
                "Convert some tBTC to ETH, MATIC, BASE, OP, SOL or ARB and use it as gas to pay for transaction fees on the destination network.",
            },
          },
        ],
      },
    }),
  ],
});

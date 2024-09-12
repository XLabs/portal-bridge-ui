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
          `./src/env/usdc-bridge.${process.env.VITE_APP_CLUSTER === "Mainnet" ? "mainnet" : "testnet"}.ts`
        ),
      },
    ],
  },
  base: `${PUBLIC_URL}/usdc-bridge/`,
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
              name: "USDC Bridge",
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
            children: "Portal USDC Bridge",
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:title": "Portal USDC Bridge" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:url": "https://portalbridge.com/usdc-bridge" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              name: "description",
              content:
                "Convert some USDC to ETH, AVAX, BASE, OP or ARB and use it as gas to pay for transaction fees on the destination network.",
            },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              property: "og:description",
              content:
                "Convert some USDC to ETH, AVAX, BASE, OP or ARB and use it as gas to pay for transaction fees on the destination network.",
            },
          },
        ],
      },
    }),
  ],
});

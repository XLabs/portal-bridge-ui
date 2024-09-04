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
          `./src/env/v2-token-bridge.${process.env.VITE_APP_CLUSTER === "mainnet" ? "mainnet" : "testnet"}.ts`
        ),
      },
    ],
  },
  base: `${PUBLIC_URL}/`,
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
              name: "Portal Bridge",
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
            children: "Portal Token Bridge",
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:title": "Portal Token Bridge" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: { "og:url": "https://portalbridge.com" },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              name: "description",
              content:
                "Portal is a bridge that offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole.",
            },
          },
          {
            injectTo: "head-prepend",
            tag: "meta",
            attrs: {
              property: "og:description",
              content:
                "Portal is a bridge that offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole.",
            },
          },
        ],
      },
    }),
  ],
});

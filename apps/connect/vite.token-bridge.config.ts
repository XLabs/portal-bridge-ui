import { defineConfig } from "vite";
import viteConfig from "./vite.config";
import { createHtmlPlugin } from "vite-plugin-html";
import { resolve } from "path";

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
          `./src/env/token-bridge.ts`
        ),
      },
    ],
  },
  define: {},
  plugins: [
    ...(viteConfig.plugins as []),
    createHtmlPlugin({
      inject: {
        tags: [
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

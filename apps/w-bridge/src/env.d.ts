/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_CLUSTER: "testnet" | "mainnet";
  // readonly VITE_APP_JS_WC_INTEGRITY_SHA_384: string;
  // readonly VITE_APP_CSS_WC_INTEGRITY_SHA_384: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_CLUSTER: "testnet" | "mainnet";
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

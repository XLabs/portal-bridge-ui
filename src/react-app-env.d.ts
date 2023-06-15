/// <reference types="react-scripts" />
declare module "*.woff2";
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_CLUSTER: "mainnet" | "testnet" | "devnet";
    REACT_APP_SOLANA_API_URL: string;
    REACT_APP_COVALENT_API_KEY: string;
  }
}

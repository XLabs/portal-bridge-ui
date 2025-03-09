import { isProduction } from "./constants";

const NTT_TOKENS_URL = {
  Mainnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.ntt.mainnet.json`,
  Testnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.ntt.testnet.json`,
};

const WRAPPED_TOKENS_URL = {
  Mainnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.wrapped.mainnet.json`,
  //Testnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.wrapped.testnet.json`,
};

const TOKENS_CONFIG_URL = {
  Mainnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.config.mainnet.json`,
  Testnet: `https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/${isProduction ? "config" : "config-preview"}/tokens.config.testnet.json`,
};

export async function fetchTokensConfig(env: "Mainnet" | "Testnet") {
  let nttTokensConfig = null;
  let wrappedTokensConfig = null;
  let tokensConfig = null;

  try {
    const response = await fetch(NTT_TOKENS_URL[env]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    nttTokensConfig = data;
  } catch (error) {
    console.error("Failed to fetch NTT tokens config:", error);
  }

  try {
    const response =
      env === "Mainnet"
        ? await fetch(WRAPPED_TOKENS_URL.Mainnet)
        : { ok: true, status: 200, json: async () => ({}) };
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    wrappedTokensConfig = data;
  } catch (error) {
    console.error("Failed to fetch wrapped tokens config:", error);
  }

  try {
    const response = await fetch(TOKENS_CONFIG_URL[env]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    tokensConfig = data;
  } catch (error) {
    console.error("Failed to fetch tokens config:", error);
  }

  return {
    nttTokensConfig,
    wrappedTokensConfig,
    tokensConfig,
  };
}

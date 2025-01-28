import mainnetTokens from "../env/tokens.ntt.mainnet.json";
import testnetTokens from "../env/tokens.ntt.testnet.json";

const TOKENS_URL = {
  Mainnet:
    "https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/main/apps/connect/src/env/tokens.mainnet.json",
  Testnet:
    "https://raw.githubusercontent.com/XLabs/portal-bridge-ui/refs/heads/main/apps/connect/src/env/tokens.testnet.json",
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let tokensCache: {
  data: any;
  timestamp: number;
  env: string;
} | null = null;

export async function fetchTokens(env: "Mainnet" | "Testnet") {
  // Return cached data if valid
  if (
    tokensCache &&
    tokensCache.env === env &&
    Date.now() - tokensCache.timestamp < CACHE_DURATION
  ) {
    return tokensCache.data;
  }

  try {
    const response = await fetch(TOKENS_URL[env]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Update cache
    tokensCache = {
      data,
      timestamp: Date.now(),
      env,
    };

    return data;
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    // backup
    return env === "Mainnet" ? mainnetTokens : testnetTokens;
  }
}

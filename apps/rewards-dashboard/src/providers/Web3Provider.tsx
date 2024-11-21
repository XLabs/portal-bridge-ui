import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import App from "../App";

// const CHAINS_LIST = [optimism, mainnet];

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const envProjectId = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = envProjectId ? envProjectId : "dummy-wc-key";

const metadata = {
  name: "Wormhole USDS rewards",
  description: "Wormhole USDS Rewards",
  url: import.meta.env.VITE_APP_DOMAIN || "portalbridge.com",
  icons: [`https://portalbridge.com/favicon.ico`],
};

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export default function AppWithReownInjected() {
  return <App />;
}

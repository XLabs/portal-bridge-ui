import { createAppKit } from "@reown/appkit/react";
// import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
// import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
// import {
//   PhantomWalletAdapter,
//   SolflareWalletAdapter,
// } from "@solana/wallet-adapter-wallets";
import App from "../App";
// import { WagmiProvider } from "wagmi";
// import { createAppKit } from "@reown/appkit/react";
import { optimism, mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";
// const CHAINS_LIST = [optimism, mainnet];

// const solanaWeb3JsAdapter = new SolanaAdapter({
//   wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
// });

const envProjectId = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = envProjectId ? envProjectId : "dummy-wc-key";

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, optimism],
  projectId,
});

const metadata = {
  name: "Wormhole WSTETH rewards",
  description: "Wormhole WSTETH Rewards",
  url: import.meta.env.VITE_APP_DOMAIN || "portalbridge.com",
  icons: [`https://portalbridge.com/favicon.ico`],
};

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, optimism],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

// export const Web3Provider = (
export default function AppWithReownInjected(){
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <App />
    </WagmiProvider>
  );
};
// export default function AppWithReownInjected() {
//   return <App />;
// }

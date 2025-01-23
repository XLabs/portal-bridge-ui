import { PropsWithChildren } from "react";
import { createAppKit } from "@reown/appkit/react";
import { optimism, mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";

const envProjectId = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = envProjectId ? envProjectId : "dummy-wc-key";

const metadata = {
  name: "Wormhole WSTETH rewards ",
  description: "Wormhole WSTETH Rewards",
  url: import.meta.env.VITE_APP_DOMAIN || "portalbridge.com",
  icons: [`https://portalbridge.com/favicon.ico`],
};

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, optimism],
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, optimism],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export const Web3Provider = (
  props: PropsWithChildren<Record<string, never>>
) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      {props.children}
    </WagmiProvider>
  );
};

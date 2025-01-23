import { PropsWithChildren } from "react";
import { createAppKit } from "@reown/appkit/react";
import { optimism, mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";

// const CHAINS_LIST = [optimism, mainnet];

const envProjectId = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = envProjectId ? envProjectId : "dummy-wc-key";

const metadata = {
  name: "Wormhole WSTETH rewards ",
  description: "Wormhole WSTETH Rewards",
  url: import.meta.env.VITE_APP_DOMAIN || "portalbridge.com",
  icons: [`https://portalbridge.com/favicon.ico`],
};
// const theseChains = [...CHAINS_LIST];

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, optimism],
  projectId,
});

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   theseChains,
//   [
//     jsonRpcProvider({
//       rpc: (chain) => {
//         const a = {
//           [optimism.id]: {
//             http: "https://rpc.ankr.com/optimism",
//           },
//         }[chain.id];
//         return a ? a : null;
//       },
//     }),
//     walletConnectProvider({
//       projectId,
//     }),
//     publicProvider(),
//   ],
//   { pollingInterval: 10_000 }
// );

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: [
//     new WalletConnectConnector({
//       chains,
//       options: { projectId, showQrModal: false, metadata },
//     }),
//     new InjectedConnector({ chains, options: { shimDisconnect: true } }),
//     new CoinbaseWalletConnector({
//       chains,
//       options: { appName: metadata.name },
//     }),
//   ],
//   publicClient,
//   webSocketPublicClient,
// });

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, optimism],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});

// createWeb3Modal({
//   wagmiConfig,
//   projectId,
//   chains,
//   themeVariables: {
//     "--w3m-accent": "#fff",
//     "--w3m-color-mix": "rgb(0,0,0,0.8)",
//     "--w3m-color-mix-strength": 25,
//     "--w3m-border-radius-master": "1px",
//   },
// });

export const Web3Provider = (
  props: PropsWithChildren<Record<string, never>>
) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      {props.children}
    </WagmiProvider>
  );
};

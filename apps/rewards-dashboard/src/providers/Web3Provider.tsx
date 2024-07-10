import { walletConnectProvider } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import {mainnet, optimism} from "@gfxlabs/oku-chains";
import { PropsWithChildren } from "react";
const CHAINS_LIST = [optimism, mainnet];

const envProjectId = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = envProjectId ? envProjectId : "dummy-wc-key";

const metadata = {
  name: "Wormhole WSTETH rewards ",
  description: "Wormhole WSTETH Rewards",
  url: import.meta.env.VITE_APP_DOMAIN || "portalbridge.com",
  icons: [`https://portalbridge.com/favicon.ico`],
};
const theseChains = [...CHAINS_LIST];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  theseChains,
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const a = {
          [optimism.id]: {
            http: "https://rpc.ankr.com/optimism",
          },
        }[chain.id];
        return a ? a : null;
      },
    }),
    walletConnectProvider({
      projectId,
    }),
    publicProvider(),
  ],
  { pollingInterval: 10_000 }
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    "--w3m-accent": "#fff",
    "--w3m-color-mix": "rgb(0,0,0,0.8)",
    "--w3m-color-mix-strength": 25,
    "--w3m-border-radius-master": "1px",
  },
});

export const Web3Provider = (props: PropsWithChildren<{}>) => {
  return <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>;
};

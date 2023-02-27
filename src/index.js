import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import BackgroundImage from "./components/BackgroundImage";
import { BetaContextProvider } from "./contexts/BetaContext";
import { getWrappedWallets as getWrappedSolanaWallets } from "./contexts/SolanaWalletContext";
import { getWrappedWallets as getWrappedAptosWallets } from "./contexts/AptosWalletContext";
import { configureInjectiveWallets } from "./contexts/InjectiveWalletContext";
import { configureNearWallets } from "./contexts/NearWalletContext";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import {
  CHAIN_ID_ALGORAND,
  CHAIN_ID_SOLANA,
  CHAIN_ID_APTOS,
  CHAIN_ID_ETH,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
  CHAIN_ID_TERRA,
  CHAIN_ID_TERRA2,
  CHAIN_ID_XPLA
} from "@xlabs-libs/wallet-aggregator-core";
import { MyAlgoWallet, PeraWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { CoinbaseWallet, LedgerWallet, MetamaskWallet, WalletConnectWallet } from "@xlabs-libs/wallet-aggregator-evm";
import { configureXplaWallets } from "./contexts/XplaWalletContext";
import { configureTerraWallets } from "./contexts/TerraWalletContext";

const AGGREGATOR_WALLETS_BUILDER = async () => {
  const solanaWallets = getWrappedSolanaWallets();
  const aptosWallets = getWrappedAptosWallets();
  const injectiveWallets = configureInjectiveWallets();
  const nearWallets = await configureNearWallets();
  const terraWallets = await configureTerraWallets();
  const xplaWallets = await configureXplaWallets();

  return {
    [CHAIN_ID_ALGORAND]: [
      new MyAlgoWallet(),
      new PeraWallet()
    ],
    // wallet provider context will use ETH for all evm chains by default
    [CHAIN_ID_ETH]: [
      new MetamaskWallet(),
      new WalletConnectWallet(),
      new CoinbaseWallet({ options: { appName: 'Portal Bridge', reloadOnDisconnect: false } }),
      new LedgerWallet()
    ],
    [CHAIN_ID_SOLANA]: solanaWallets,
    [CHAIN_ID_APTOS]: aptosWallets,
    [CHAIN_ID_INJECTIVE]: injectiveWallets,
    [CHAIN_ID_NEAR]: nearWallets,
    [CHAIN_ID_TERRA2]: terraWallets,
    [CHAIN_ID_XPLA]: xplaWallets
  }
};

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SnackbarProvider maxSnack={3}>
            <WalletContextProvider wallets={AGGREGATOR_WALLETS_BUILDER}>
              <BetaContextProvider>
                <HashRouter>
                  <BackgroundImage />
                  <App />
                </HashRouter>
              </BetaContextProvider>
            </WalletContextProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);

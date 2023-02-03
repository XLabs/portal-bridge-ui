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
import { getInjectiveWallets } from "./contexts/InjectiveWalletContext";
import { getNearWallets } from "./contexts/NearWalletContext";
import XplaWalletProvider from "./contexts/XplaWalletContext";
import { TerraWalletProvider } from "./contexts/TerraWalletContext.tsx";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import {
  CHAIN_ID_ALGORAND,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
} from "@xlabs-libs/wallet-aggregator-core";
import {
  MyAlgoWallet,
  PeraWallet,
  DeflyWallet,
  AlgorandLedgerWallet,
} from "@xlabs-libs/wallet-aggregator-algorand";
import {
  InjectedWallet,
  WalletConnectLegacyWallet,
} from "@xlabs-libs/wallet-aggregator-evm";

const AGGREGATOR_WALLETS_BUILDER = async () => ({
  [CHAIN_ID_ALGORAND]: [
    new MyAlgoWallet(),
    new PeraWallet(),
    new DeflyWallet(),
    new AlgorandLedgerWallet(),
  ],
  [CHAIN_ID_ETH]: [new InjectedWallet(), new WalletConnectLegacyWallet()],
  [CHAIN_ID_SOLANA]: getWrappedSolanaWallets(),
  [CHAIN_ID_APTOS]: getWrappedAptosWallets(),
  [CHAIN_ID_INJECTIVE]: getInjectiveWallets(),
  [CHAIN_ID_NEAR]: await getNearWallets()
});

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SnackbarProvider maxSnack={3}>
            <WalletContextProvider wallets={AGGREGATOR_WALLETS_BUILDER}>
              <BetaContextProvider>
                <TerraWalletProvider>
                  <XplaWalletProvider>
                    <HashRouter>
                      <BackgroundImage />
                      <App />
                    </HashRouter>
                  </XplaWalletProvider>
                </TerraWalletProvider>
              </BetaContextProvider>
            </WalletContextProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import {
  AlgorandLedgerWallet,
  DeflyWallet,
  MyAlgoWallet,
  PeraWallet,
} from "@xlabs-libs/wallet-aggregator-algorand";
import {
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_ETH,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_SUI,
  CHAIN_ID_TERRA2,
  CHAIN_ID_XPLA,
  CHAIN_ID_SEI,
} from "@xlabs-libs/wallet-aggregator-core";
import {
  InjectedWallet,
  WalletConnectLegacyWallet,
} from "@xlabs-libs/wallet-aggregator-evm";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import { SnackbarProvider } from "notistack";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import BackgroundImage from "./components/BackgroundImage";
import { getWrappedWallets as getWrappedAptosWallets } from "./contexts/AptosWalletContext";
import { BetaContextProvider } from "./contexts/BetaContext";
import { getInjectiveWallets } from "./contexts/InjectiveWalletContext";
import { getNearWallets } from "./contexts/NearWalletContext";
import { getWrappedWallets as getWrappedSolanaWallets } from "./contexts/SolanaWalletContext";
import { getSuiWallets } from "./contexts/SuiWalletContext";
import { getTerraWallets } from "./contexts/TerraWalletContext";
import { getXplaWallets } from "./contexts/XplaWalletContext";
import { theme } from "./muiTheme";
import { store } from "./store";
import { getSeiWallets } from "./contexts/SeiWalletContext";

const AGGREGATOR_WALLETS_BUILDER = async () => {
  return {
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
    [CHAIN_ID_SEI]: getSeiWallets(),
    [CHAIN_ID_NEAR]: await getNearWallets(),
    [CHAIN_ID_TERRA2]: await getTerraWallets(),
    [CHAIN_ID_XPLA]: await getXplaWallets(),
    [CHAIN_ID_SUI]: await getSuiWallets(),
  };
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

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import BackgroundImage from "./components/BackgroundImage";
import AptosWalletProvider from "./contexts/AptosWalletContext";
import { BetaContextProvider } from "./contexts/BetaContext";
import { EthereumProviderProvider } from "./contexts/EthereumProviderContext";
import { NearContextProvider } from "./contexts/NearWalletContext";
import XplaWalletProvider from "./contexts/XplaWalletContext";
import { SolanaWalletProvider } from "./contexts/SolanaWalletContext.tsx";
import { TerraWalletProvider } from "./contexts/TerraWalletContext.tsx";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import InjectiveWalletProvider from "./contexts/InjectiveWalletContext";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import { CHAIN_ID_ALGORAND } from "@xlabs-libs/wallet-aggregator-core";
import { MyAlgoWallet, PeraWallet } from "@xlabs-libs/wallet-aggregator-algorand";

const AGGREGATOR_WALLETS = {
  [CHAIN_ID_ALGORAND]: [ new MyAlgoWallet(), new PeraWallet() ]
}

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SnackbarProvider maxSnack={3}>
            <WalletContextProvider wallets={AGGREGATOR_WALLETS}>
              <BetaContextProvider>
                <SolanaWalletProvider>
                  <EthereumProviderProvider>
                    <TerraWalletProvider>
                      <NearContextProvider>
                        <XplaWalletProvider>
                          <AptosWalletProvider>
                            <InjectiveWalletProvider>
                              <HashRouter>
                                <BackgroundImage />
                                <App />
                              </HashRouter>
                            </InjectiveWalletProvider>
                          </AptosWalletProvider>
                        </XplaWalletProvider>
                      </NearContextProvider>
                    </TerraWalletProvider>
                  </EthereumProviderProvider>
                </SolanaWalletProvider>
              </BetaContextProvider>
            </WalletContextProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);

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
import { getWrappedWallets as getWrappedSolanaWallets } from "./contexts/SolanaWalletContext";
import { NearContextProvider } from "./contexts/NearWalletContext";
import XplaWalletProvider from "./contexts/XplaWalletContext";
import { TerraWalletProvider } from "./contexts/TerraWalletContext.tsx";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import InjectiveWalletProvider from "./contexts/InjectiveWalletContext";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import { CHAIN_ID_ALGORAND, CHAIN_ID_SOLANA } from "@xlabs-libs/wallet-aggregator-core";
import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { evmChainIdToChainId, EVMWalletConnectWallet, EVMWeb3Wallet, EVM_CHAINS, EVM_CHAINS_TESTNET } from "@xlabs-libs/wallet-aggregator-evm";

const network = process.env.REACT_APP_CLUSTER === 'testnet' ? 'TESTNET' : 'MAINNET';
const evmChains = network === 'MAINNET' ? EVM_CHAINS : EVM_CHAINS_TESTNET;

const evmChainMap =
  Object
    .values(evmChains)
    .map(evmChainId => ({
      evmChainId,
      chainId: evmChainIdToChainId(evmChainId, network)
    }))
    .reduce((map, { evmChainId, chainId }) => {
      const params = { preferredChain: evmChainId }
      map[chainId] = [ new EVMWeb3Wallet(params), new EVMWalletConnectWallet(params) ]
      return map;
    }, {});

const AGGREGATOR_WALLETS = {
  [CHAIN_ID_ALGORAND]: [ new AlgorandWallet() ],
  ...evmChainMap,
  [CHAIN_ID_SOLANA]: getWrappedSolanaWallets()
}

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SnackbarProvider maxSnack={3}>
            <WalletContextProvider availableWallets={AGGREGATOR_WALLETS}>
              <BetaContextProvider>
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
              </BetaContextProvider>
            </WalletContextProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);

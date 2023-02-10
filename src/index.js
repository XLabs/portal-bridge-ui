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
import XplaWalletProvider from "./contexts/XplaWalletContext";
import { TerraWalletProvider } from "./contexts/TerraWalletContext.tsx";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import { WalletContextProvider } from "@xlabs-libs/wallet-aggregator-react";
import { CHAIN_ID_ALGORAND, CHAIN_ID_SOLANA, CHAIN_ID_APTOS, CHAIN_ID_INJECTIVE, CHAIN_ID_NEAR } from "@xlabs-libs/wallet-aggregator-core";
import { AlgorandWallet, MyAlgoWallet, PeraWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { CoinbaseWallet, evmChainIdToChainId, EVMWalletConnectWallet, EVMWeb3Wallet, EVM_CHAINS, EVM_CHAINS_TESTNET, LedgerWallet } from "@xlabs-libs/wallet-aggregator-evm";

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
      map[chainId] = [
        new EVMWeb3Wallet(params),
        new EVMWalletConnectWallet(params),
        new CoinbaseWallet({
          ...params,
          options: {
            appName: 'Portal bridge',
            reloadOnDisconnect: false
          }
        }),
        new LedgerWallet()
      ]
      return map;
    }, {});

const AGGREGATOR_WALLETS_BUILDER = async () => ({
  [CHAIN_ID_ALGORAND]: [ new MyAlgoWallet(), new PeraWallet() ],
  ...evmChainMap,
  [CHAIN_ID_SOLANA]: getWrappedSolanaWallets(),
  [CHAIN_ID_APTOS]: getWrappedAptosWallets(),
  [CHAIN_ID_INJECTIVE]: configureInjectiveWallets(),
  [CHAIN_ID_NEAR]: await configureNearWallets()
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

import { getNetworkInfo } from "@injectivelabs/networks";
import {
  AptosSnapAdapter,
  AptosWalletAdapter,
  BitkeepWalletAdapter,
  FewchaWalletAdapter,
  FletchWalletAdapter,
  MartianWalletAdapter,
  NightlyWalletAdapter as AptosNightlyWalletAdapter,
  PontemWalletAdapter,
  RiseWalletAdapter,
  SpikaWalletAdapter,
  TokenPocketWalletAdapter,
  WalletAdapterNetwork as AptosWalletAdapterNetwork,
} from "@manahippo/aptos-wallet-adapter";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";
import { WalletAdapterNetwork as SolanaWalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  BackpackWalletAdapter,
  BloctoWalletAdapter,
  BraveWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  ExodusWalletAdapter,
  NightlyWalletAdapter as SolanaNightlyWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
import { ConnectType as TerraConnectType } from "@terra-money/wallet-provider";
import { AptosAdapter, AptosWallet } from "@xlabs-libs/wallet-aggregator-aptos";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { KeplrWallet } from "@xlabs-libs/wallet-aggregator-injective";
import { NearModalSelectorWallet } from "@xlabs-libs/wallet-aggregator-near";
import {
  SolanaAdapter,
  SolanaWallet,
} from "@xlabs-libs/wallet-aggregator-solana";
import {
  getWallets as getTerraWallets,
  TerraWallet,
} from "@xlabs-libs/wallet-aggregator-terra";
import {
  getWallets as getXplaWallets,
  XplaWallet,
} from "@xlabs-libs/wallet-aggregator-xpla";
import { ConnectType as XplaConnectType } from "@xpla/wallet-provider";
import {
  CLUSTER,
  getInjectiveNetworkChainId,
  getInjectiveNetworkName,
  getNearConnectionConfig,
  NEAR_TOKEN_BRIDGE_ACCOUNT,
  SOLANA_HOST,
} from "../utils/consts";

export const createSolanaWallets = (): Wallet[] => {
  const wallets: SolanaAdapter[] = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new SolanaNightlyWalletAdapter(),
    new SolletWalletAdapter(),
    new SolletExtensionWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    new SlopeWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter(),
    new ExodusWalletAdapter(),
    new BraveWalletAdapter(),
  ];

  const network =
    CLUSTER === "mainnet"
      ? SolanaWalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? SolanaWalletAdapterNetwork.Devnet
      : undefined;

  if (network) {
    wallets.push(new BloctoWalletAdapter({ network }));
  }

  return wallets.map(
    (adapter: SolanaAdapter) =>
      new SolanaWallet(adapter, new Connection(SOLANA_HOST))
  );
};

export const createAptosWallets = (): Wallet[] => {
  const network =
    CLUSTER === "mainnet"
      ? AptosWalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? AptosWalletAdapterNetwork.Testnet
      : AptosWalletAdapterNetwork.Devnet;

  const wallets: AptosAdapter[] = [
    new AptosWalletAdapter(),
    new MartianWalletAdapter(),
    new RiseWalletAdapter(),
    new AptosNightlyWalletAdapter(),
    new PontemWalletAdapter(),
    new FletchWalletAdapter(),
    new FewchaWalletAdapter(),
    new SpikaWalletAdapter(),
    new AptosSnapAdapter({ network }),
    new BitkeepWalletAdapter(),
    new TokenPocketWalletAdapter(),
    // new BloctoWalletAdapter(
    //   network !== WalletAdapterNetwork.Devnet
    //     ? {
    //         network,
    //       }
    //     : undefined
    // ),
  ];

  return wallets.map((adapter) => new AptosWallet(adapter));
};
export const createInjectiveWallets = () => {
  if (!["mainnet", "testnet"].includes(process.env.REACT_APP_CLUSTER || ""))
    return [];

  const network = getInjectiveNetworkName();
  const networkInfo = getNetworkInfo(network);

  const opts = {
    networkChainId: getInjectiveNetworkChainId(),
    broadcasterOptions: {
      network,
      endpoints: {
        indexerApi: networkInfo.indexerApi,
        sentryGrpcApi: networkInfo.sentryGrpcApi,
        sentryHttpApi: networkInfo.sentryHttpApi,
      },
    },
  };

  return [new KeplrWallet(opts)];
};

export const createNearWallets = async () => {
  return [
    new NearModalSelectorWallet({
      config: getNearConnectionConfig(),
      contractId: NEAR_TOKEN_BRIDGE_ACCOUNT || "",
      modules: [
        ...(await setupDefaultWallets()),
        setupNearWallet(),
        setupMyNearWallet(),
        setupSender(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
      ],
    }),
  ];
};

export const createTerraWallets = async () => {
  let wallets: TerraWallet[] = [];

  try {
    wallets = await getTerraWallets([TerraConnectType.READONLY]);
  } catch (err) {
    console.error("Failed to init terra chain wallets. Error:", err);
  }

  return wallets;
};

export const createXplaWallets = async () => {
  let xplaWallets: XplaWallet[] = [];

  try {
    xplaWallets = await getXplaWallets([XplaConnectType.READONLY]);
  } catch (err) {
    console.error("Failed to init terra chain wallets. Error:", err);
  }

  return xplaWallets;
};

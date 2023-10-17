import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  //SlopeWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  //ExodusWalletAdapter,
  //BackpackWalletAdapter,
  NightlyWalletAdapter,
  //BloctoWalletAdapter,
  //BraveWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
import { CHAIN_ID_SOLANA, Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import {
  SolanaAdapter,
  SolanaWallet,
} from "@xlabs-libs/wallet-aggregator-solana";
import { useMemo } from "react";
import { CLUSTER, SOLANA_HOST } from "../utils/consts";

export const getWrappedWallets = (): Wallet[] => {
  const wallets: SolanaAdapter[] = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    //new BackpackWalletAdapter(),
    new NightlyWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    //new SlopeWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter(),
    //new ExodusWalletAdapter(),
    //new BraveWalletAdapter(),
  ];

  const network =
    CLUSTER === "mainnet"
      ? WalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? WalletAdapterNetwork.Devnet
      : undefined;

  if (network) {
    //wallets.push(new BloctoWalletAdapter({ network }));
  }

  return wallets.map(
    (adapter: SolanaAdapter) =>
      new SolanaWallet(adapter, new Connection(SOLANA_HOST))
  );
};

interface ISolanaContext {
  publicKey?: string;
  wallet?: SolanaWallet;
}

export const useSolanaWallet = (): ISolanaContext => {
  const wallet = useWallet<SolanaWallet>(CHAIN_ID_SOLANA);

  //TIP: Replace Solana wallet address here to debug
  const publicKey = useMemo(() => wallet?.getAddress(), [wallet]);

  return useMemo(
    () => ({
      publicKey,
      wallet,
    }),
    [publicKey, wallet]
  );
};

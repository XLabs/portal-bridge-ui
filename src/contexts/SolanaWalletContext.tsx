import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  SlopeWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  SolletExtensionWalletAdapter,
  ExodusWalletAdapter,
  BackpackWalletAdapter,
  NightlyWalletAdapter,
  BloctoWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
import { CHAIN_ID_SOLANA, Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useWalletFromChain } from "@xlabs-libs/wallet-aggregator-react";
import { SolanaAdapter, SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { useMemo } from "react";
import { CLUSTER, SOLANA_HOST } from "../utils/consts";

export const getWrappedWallets = (): Wallet[] => {
  const wallets: SolanaAdapter[] = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new NightlyWalletAdapter(),
    new SolletWalletAdapter(),
    new SolletExtensionWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    new SlopeWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter(),
    new ExodusWalletAdapter(),
  ];

  const network =
    CLUSTER === "mainnet"
      ? WalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? WalletAdapterNetwork.Devnet
      : undefined;

  if (network) {
    wallets.push(new BloctoWalletAdapter({ network }));
  }

  return wallets.map((adapter: SolanaAdapter) =>
    new SolanaWallet(adapter, new Connection(SOLANA_HOST)))
}

interface ISolanaContext {
  publicKey?: string;
  wallet?: SolanaWallet;
}

export const useSolanaWallet = (): ISolanaContext => {
  const wallet = useWalletFromChain(CHAIN_ID_SOLANA) as SolanaWallet;

  const publicKey = useMemo(() => wallet?.getAddress(), [ wallet ])

  return useMemo(() => ({
    publicKey,
    wallet
  }), [
    publicKey,
    wallet
  ]);
}

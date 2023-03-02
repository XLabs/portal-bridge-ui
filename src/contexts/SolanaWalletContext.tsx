import { FC, useMemo } from "react";
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  SlopeWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  ExodusWalletAdapter,
  BackpackWalletAdapter,
  NightlyWalletAdapter,
  BloctoWalletAdapter,
  BraveWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { CLUSTER, SOLANA_HOST } from "../utils/consts";

export const SolanaWalletProvider: FC = (props) => {
  const wallets = useMemo(() => {
    const wallets: Adapter[] = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new BraveWalletAdapter(),
      new NightlyWalletAdapter(),
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

    return wallets;
  }, []);

  return (
    <ConnectionProvider endpoint={SOLANA_HOST}>
      <WalletProvider wallets={wallets} autoConnect>
        {props.children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useSolanaWallet = useWallet;

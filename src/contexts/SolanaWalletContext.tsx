import { FC, useMemo, useState, useEffect } from "react";
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
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
  BraveWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { CLUSTER, SOLANA_HOST } from "../utils/consts";

declare global {
  interface Navigator {
    brave: {
      isBrave(): Promise<boolean>;
    };
  }
}

export const isBraveBrowser = async () => {
  if (window.navigator.brave) {
    return await window.navigator.brave.isBrave();
  }
  return false;
};

export const SolanaWalletProvider: FC = (props) => {
  const [isBrave, setIsBrave] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIfIsBraveBrowser = async () => {
      const getIsBrave: boolean = await isBraveBrowser();
      setIsBrave(getIsBrave);
    };

    checkIfIsBraveBrowser();
  }, []);

  const wallets = useMemo(() => {
    const wallets: Adapter[] = [
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

    if (isBrave) {
      wallets.push(new BraveWalletAdapter());
    }

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
  }, [isBrave]);

  return isBrave !== null ? (
    <ConnectionProvider endpoint={SOLANA_HOST}>
      <WalletProvider wallets={wallets} autoConnect>
        {props.children}
      </WalletProvider>
    </ConnectionProvider>
  ) : (
    <></>
  );
};

export const useSolanaWallet = useWallet;

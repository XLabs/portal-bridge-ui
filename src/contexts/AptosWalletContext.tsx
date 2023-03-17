import {
  AptosSnapAdapter,
  AptosWalletAdapter,
  BitkeepWalletAdapter,
  FewchaWalletAdapter,
  FletchWalletAdapter,
  MartianWalletAdapter,
  NetworkInfo,
  NightlyWalletAdapter,
  PontemWalletAdapter,
  RiseWalletAdapter,
  SpikaWalletAdapter,
  TokenPocketWalletAdapter,
  WalletAdapterNetwork,
} from "@manahippo/aptos-wallet-adapter";
import { useMemo } from "react";
import { CLUSTER } from "../utils/consts";
import { AptosWallet, AptosAdapter } from "@xlabs-libs/wallet-aggregator-aptos";
import { CHAIN_ID_APTOS, Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";

export const getWrappedWallets = (): Wallet[] => {
  const network =
    CLUSTER === "mainnet"
      ? WalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? WalletAdapterNetwork.Testnet
      : WalletAdapterNetwork.Devnet;

  const wallets: AptosAdapter[] = [
    new AptosWalletAdapter(),
    new MartianWalletAdapter(),
    new RiseWalletAdapter(),
    new NightlyWalletAdapter(),
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

interface IAptosContext {
  wallet?: AptosWallet;
  account?: string;
  network?: NetworkInfo;
}

export const useAptosContext = (): IAptosContext => {
  const wallet = useWallet<AptosWallet>(CHAIN_ID_APTOS);

  const account = useMemo(() => wallet?.getAddress(), [wallet]);
  const network = useMemo(() => wallet?.getAdapter().network, [wallet]);

  return useMemo(
    () => ({
      wallet,
      account,
      network,
    }),
    [wallet, account, network]
  );
};

import {
  AptosSnapAdapter,
  AptosWalletAdapter,
  BitkeepWalletAdapter,
  BloctoWalletAdapter,
  FewchaWalletAdapter,
  FletchWalletAdapter,
  MartianWalletAdapter,
  NightlyWalletAdapter,
  PontemWalletAdapter,
  RiseWalletAdapter,
  SpikaWalletAdapter,
  TokenPocketWalletAdapter,
  useWallet,
  WalletAdapterNetwork,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";
import { ReactChildren, useMemo } from "react";
import { CLUSTER } from "../utils/consts";

export const useAptosContext = useWallet;

export const AptosWalletProvider = ({
  children,
}: {
  children: ReactChildren;
}) => {
  const wallets = useMemo(() => {
    const network =
      CLUSTER === "mainnet"
        ? WalletAdapterNetwork.Mainnet
        : CLUSTER === "testnet"
        ? WalletAdapterNetwork.Testnet
        : WalletAdapterNetwork.Devnet;
    return [
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
      new BloctoWalletAdapter(
        network !== WalletAdapterNetwork.Devnet
          ? {
              network,
            }
          : undefined
      ),
    ];
  }, []);
  return (
    <WalletProvider
      wallets={wallets}
      onError={(error: Error) => {
        console.log("wallet errors: ", error);
      }}
    >
      {children}
    </WalletProvider>
  );
};

export default AptosWalletProvider;

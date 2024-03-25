import { isEVMChain } from "@certusone/wormhole-sdk";
import { ChainId } from "@xlabs-libs/wallet-aggregator-core";
import {
  EVMWallet,
  InjectedWallet,
  WalletConnectWallet,
} from "@xlabs-libs/wallet-aggregator-evm";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";

export type Provider = ethers.providers.Web3Provider | undefined;
export type Signer = ethers.Signer | undefined;

interface IEthereumContext {
  provider: Provider;
  evmChainId: number | undefined;
  signer: Signer;
  signerAddress: string | undefined;
  wallet: EVMWallet | undefined;
}

export const getEvmWallets = (): EVMWallet[] => {
  return [
    new InjectedWallet(),
    new WalletConnectWallet({
      connectorOptions: {
        projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
        showQrModal: true,
        qrModalOptions: {
          themeMode: "light",
        },
        metadata: {
          url: "https://portalbridge.com",
          name: "Wormhole Portal Bridge",
          description: "Wormhole Portal Bridge",
          icons: ["https://portalbridge.com/favicon.ico"],
        },
      },
    }),
  ];
};

export const useEthereumProvider = (chainId: ChainId): IEthereumContext => {
  const wallet = useWallet<EVMWallet>(chainId);

  const [signerAddress, setSignerAddress] = useState<string | undefined>();
  const [evmChainId, setEvmChainId] = useState<number | undefined>();
  const [signer, setSigner] = useState<ethers.Signer | undefined>();
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();

  useEffect(() => {
    if (!isEVMChain(chainId)) return () => {};

    setSignerAddress(wallet?.getAddress());
    setEvmChainId(wallet?.getNetworkInfo()?.chainId);
    setSigner(wallet?.getSigner());
    setProvider(wallet?.getProvider());

    const handleNetworkChange = () => {
      setEvmChainId(wallet?.getNetworkInfo()?.chainId);
    };

    wallet?.on("networkChanged", handleNetworkChange);
    return () => {
      wallet?.off("networkChanged", handleNetworkChange);
    };
  }, [wallet, chainId]);

  return useMemo(
    () => ({
      provider,
      evmChainId,
      signer,
      signerAddress,
      wallet,
    }),
    [provider, evmChainId, signer, signerAddress, wallet]
  );
};

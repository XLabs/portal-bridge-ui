import { isEVMChain } from "@certusone/wormhole-sdk";
import { ChainId } from "@xlabs-libs/wallet-aggregator-core";
import { EVMWallet } from "@xlabs-libs/wallet-aggregator-evm";
import { useWalletFromChain } from "@xlabs-libs/wallet-aggregator-react";
import { ethers } from "ethers";
import {
  useEffect,
  useMemo,
  useState
} from "react";

export type Provider = ethers.providers.Web3Provider | undefined;
export type Signer = ethers.Signer | undefined;

interface IEthereumContext {
  provider: Provider;
  evmChainId: number | undefined;
  signer: Signer;
  signerAddress: string | undefined;
  wallet: EVMWallet | undefined;
}

export const useEthereumProvider = (chainId: ChainId): IEthereumContext => {
  const wallet = useWalletFromChain<EVMWallet>(chainId);

  const [ signerAddress, setSignerAddress ] = useState<string | undefined>();
  const [ evmChainId, setEvmChainId ] = useState<number | undefined>();
  const [ signer, setSigner ] = useState<ethers.Signer | undefined>();
  const [ provider, setProvider ] = useState<ethers.providers.Web3Provider | undefined>();

  useEffect(() => {
    if (!isEVMChain(chainId)) return () => {};

    setSignerAddress(wallet?.getAddress());
    setEvmChainId(wallet?.getNetworkInfo()?.chainId);
    setSigner(wallet?.getSigner());
    setProvider(wallet?.getProvider());

    const handleNetworkChange = () => {
      setEvmChainId(wallet?.getNetworkInfo()?.chainId);
    };

    wallet?.on('networkChanged', handleNetworkChange);
    return () => {
      wallet?.off('networkChanged', handleNetworkChange);
    };
  }, [ wallet, chainId ])

  return useMemo(
    () => ({
      provider,
      evmChainId,
      signer,
      signerAddress,
      wallet
    }),
    [
      provider,
      evmChainId,
      signer,
      signerAddress,
      wallet
    ]
  );
};

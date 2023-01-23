import { isEVMChain } from "@certusone/wormhole-sdk";
import { ChainId } from "@xlabs-libs/wallet-aggregator-core";
import { EVMWallet } from "@xlabs-libs/wallet-aggregator-evm";
import { useWalletFromChain } from "@xlabs-libs/wallet-aggregator-react";
import { ethers } from "ethers";
import {
  useMemo
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
  const wallet = useWalletFromChain(chainId) as EVMWallet;

  const isEVM = useMemo(() => isEVMChain(chainId), [ chainId ]);

  const provider = useMemo(() => isEVM ? wallet?.getProvider() : undefined, [ isEVM, wallet ]);
  const evmChainId = useMemo(() => isEVM ? wallet?.getEvmChainId() : undefined, [ isEVM, wallet ]);
  const signer = useMemo(() => isEVM ? wallet?.getSigner() : undefined, [ isEVM, wallet ]);
  const signerAddress = useMemo(() => isEVM ? wallet?.getAddress() : undefined, [ isEVM, wallet ]);

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

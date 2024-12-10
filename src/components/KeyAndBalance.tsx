import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  isTerraChain,
  CHAIN_ID_SUI,
  CHAIN_ID_SEI,
} from "@certusone/wormhole-sdk";
import ConnectWalletButton from "./ConnectWalletButton";
import { isEVMChain } from "@xlabs-libs/wallet-aggregator-core";
import { CHAIN_ID_WORLDCHAIN } from "../utils/consts";

function isChainAllowed(chainId: ChainId) {
  console.log("chainId", chainId, isEVMChain(chainId) );
  return (
    isEVMChain(chainId) ||
    chainId === CHAIN_ID_SOLANA ||
    isTerraChain(chainId) ||
    chainId === CHAIN_ID_ALGORAND ||
    chainId === CHAIN_ID_NEAR ||
    chainId === CHAIN_ID_XPLA ||
    chainId === CHAIN_ID_APTOS ||
    chainId === CHAIN_ID_INJECTIVE ||
    chainId === CHAIN_ID_SUI ||
    chainId === CHAIN_ID_WORLDCHAIN ||
    chainId === CHAIN_ID_SEI
  );
}

function KeyAndBalance({ chainId }: { chainId: ChainId }) {
  if (isChainAllowed(chainId)) {
    return <ConnectWalletButton chainId={chainId} />;
  }

  return null;
}

export default KeyAndBalance;

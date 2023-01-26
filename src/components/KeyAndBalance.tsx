import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  isEVMChain,
  isTerraChain,
} from "@certusone/wormhole-sdk";
import AptosWalletKey from "./AptosWalletKey";
import ConnectWalletButton from "./ConnectWalletButton";
import InjectiveWalletKey from "./InjectiveWalletKey";
import NearWalletKey from "./NearWalletKey";
import TerraWalletKey from "./TerraWalletKey";
import XplaWalletKey from "./XplaWalletKey";

function KeyAndBalance({ chainId }: { chainId: ChainId }) {
  if (isEVMChain(chainId)) {
    return <ConnectWalletButton chainId={chainId} />;
  }
  if (chainId === CHAIN_ID_SOLANA) {
    return <ConnectWalletButton chainId={chainId} />;
  }
  if (isTerraChain(chainId)) {
    return <TerraWalletKey />;
  }
  if (chainId === CHAIN_ID_ALGORAND) {
    return <ConnectWalletButton chainId={CHAIN_ID_ALGORAND} />;
  }
  if (chainId === CHAIN_ID_NEAR) {
    return <NearWalletKey />;
  }
  if (chainId === CHAIN_ID_XPLA) {
    return <XplaWalletKey />;
  }
  if (chainId === CHAIN_ID_APTOS) {
    return <AptosWalletKey />;
  }
  if (chainId === CHAIN_ID_INJECTIVE) {
    return <InjectiveWalletKey />;
  }
  return null;
}

export default KeyAndBalance;

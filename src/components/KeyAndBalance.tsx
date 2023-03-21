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
import ConnectWalletButton from "./ConnectWalletButton";
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
    return <ConnectWalletButton chainId={chainId} />;
  }
  if (chainId === CHAIN_ID_NEAR) {
    return <ConnectWalletButton chainId={chainId} />;
  }
  if (chainId === CHAIN_ID_XPLA) {
    return <XplaWalletKey />;
  }
  if (chainId === CHAIN_ID_APTOS) {
    return <ConnectWalletButton chainId={chainId} />;
  }
  if (chainId === CHAIN_ID_INJECTIVE) {
    return <ConnectWalletButton chainId={chainId} />;
  }
  return null;
}

export default KeyAndBalance;

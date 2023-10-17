import { ChainId } from "@certusone/wormhole-sdk";
import { useEffect, useState } from "react";

const isSource = (sourceChain: ChainId, selectedSourceChain: ChainId) =>
  sourceChain === selectedSourceChain;

function useRoundTripTransfer(
  source: ChainId,
  target: ChainId,
  selectedSourceChain: ChainId,
  onRoundTripTransfer: (chainId: ChainId) => void = () => {},
  ids: string[] = [],
  predicate: (id: string) => boolean = () => true
) {
  const [isRoundTripTransfer, setIsRoundTripTransfer] = useState(false);
  useEffect(() => {
    const apply = ids.some(predicate) || predicate("");
    if (apply) {
      if (isSource(source, selectedSourceChain)) {
        onRoundTripTransfer(target);
      } else if (isSource(target, selectedSourceChain)) {
        onRoundTripTransfer(source);
      }
      setIsRoundTripTransfer(true);
    } else {
      setIsRoundTripTransfer(false);
    }
  }, [
    source,
    target,
    ids,
    predicate,
    onRoundTripTransfer,
    selectedSourceChain,
  ]);

  return isRoundTripTransfer;
}

export default useRoundTripTransfer;

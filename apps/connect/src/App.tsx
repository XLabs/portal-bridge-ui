import type {
  ChainName,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { useCallback, useMemo, useRef, useState } from "react";
import customTheme from "./theme/connect";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import { useQueryParams } from "./hooks/useQueryParams";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import {
  ExtendedTransferDetails,
  LiquidMarketsWarningContextType,
  ValidateTransferHandler,
  ValidateTransferResult,
  WarningLiquidMarkets,
  validateTransfer,
} from "./providers/liquid-markets";
import ModalWarning from "./components/molecules/ModalWarning";

const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
};
export default function Root() {
  const { txHash, sourceChain, targetChain } = useQueryParams();
  const [warning, setWarning] = useState<LiquidMarketsWarningContextType>({
    warningType: WarningLiquidMarkets.NO_WARNING,
    corridor: undefined,
  });
  const [open, setOpen] = useState(false);

  const ref = useRef<((e: ValidateTransferResult) => void) | null>(null);
  const actionResult = useCallback(
    (resolve: (e: ValidateTransferResult) => void) => {
      ref.current = resolve;
    },
    [ref]
  );

  const validate: ValidateTransferHandler = useCallback(
    async (e: ExtendedTransferDetails): Promise<ValidateTransferResult> => {
      const result = await validateTransfer(e);
      setWarning({ ...result });
      setOpen(result.warningType !== WarningLiquidMarkets.NO_WARNING);
      return new Promise(actionResult);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onContinue = () => {
    setOpen(false);
    if (ref.current) {
      ref?.current({ isValid: true });
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  const config = useMemo(
    () => ({
      ...defaultConfig,
      validateTransferHandler: validate,
      searchTx: {
        ...(txHash && { txHash }),
        ...(sourceChain && { chainName: sourceChain as ChainName }),
      },
      bridgeDefaults: {
        ...(sourceChain && { fromNetwork: sourceChain as ChainName }),
        ...(targetChain && { toNetwork: targetChain as ChainName }),
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txHash, sourceChain, targetChain]
  );
  const messages = Object.values(messageConfig);
  return (
    <>
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      <ModalWarning
        isOpen={open}
        warningType={warning.warningType}
        corridor={warning.corridor}
        onClose={onClose}
        onContinue={onContinue}
      />
      <WormholeConnect config={config} theme={customTheme} />
    </>
  );
}

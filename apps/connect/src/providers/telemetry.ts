import mixpanel from "mixpanel-browser";
import { isPreview, isProduction } from "../utils/constants";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

export type WormholeConnectEvent = Parameters<
  NonNullable<WormholeConnectConfig["eventHandler"]>
>[0];

mixpanel.init(
  isProduction
    ? "a5bb05fa95759da34eac66cd9444790b"
    : "fdaf35ef8f838559e248a71c80ff1626",
  {
    ignore_dnt: true,
    ip: true,
    debug: isPreview,
    track_pageview: "full-url",
  }
);

const sendEvent = (e: any) => {
  try {
    mixpanel.track(e.event, e.properties);
  } catch (error) {
    console.error(error);
  }
};

const getErrorMessage = (error: any) => {
  return [
    !!error?.code && `Code: ${error.code}`,
    !!error?.name && `Name: ${error.name}`,
    !!error?.message && `Message: ${error.message}`,
  ]
    .filter(Boolean)
    .join(" ");
};

let lastChain: string;
export const eventHandler = (e: WormholeConnectEvent) => {
  // Ignore the load event
  if (e.type === "load") return;

  // Start the trace when the event is load
  const span = { event: e.type, properties: e.details as unknown };
  // Wallet connect information
  if (e.type === "wallet.connect") {
    const side = e.details.side;
    const chain = `${e.details.chain}-${side}`;
    if (lastChain !== chain) {
      sendEvent({
        ...span,
        properties: {
          [`wallet-${side}`]: e.details.wallet,
          [`chain-${side}`]: e.details.chain,
        },
      });
    }
    lastChain = chain;
    return;
  }
  const getTokenAddress = (token: typeof e.details.fromToken): string =>
    typeof token?.tokenId === "object" ? token.tokenId.address : "native";

  // Convert WormholeConnectEvent to Attributes
  const isTransferError =
    e.type === "transfer.error" || e.type === "transfer.redeem.error";
  const attributes: { [key: string]: string | number | undefined } = {
    fromChain: e.details.fromChain.toString(),
    toChain: e.details.toChain.toString(),
    fromTokenSymbol: e.details.fromToken?.symbol,
    fromTokenAddress: getTokenAddress(e.details.fromToken),
    toTokenSymbol: e.details.toToken?.symbol,
    toTokenAddress: getTokenAddress(e.details.toToken),
    txId: e.details.txId,
    USDAmount: e.details.USDAmount,
    amount: e.details.amount,
    route:
      {
        ManualTokenBridge: "Manual Bridge",
        AutomaticTokenBridge: "Relayer",
        ManualCCTP: "CCTP Manual",
        AutomaticCCTP: "CCTP Relayer",
        ManualNtt: "NTT Manual",
        AutomaticNtt: "NTT Relayer",
        MayanSwap: "Mayan Swap",
        MayanSwapWH: "Mayan Swap",
        MayanSwapMCTP: "Mayan Swap MCTP",
        MayanSwapSWIFT: "Mayan Swap Swift",
        cosmosGateway: "Cosmos Gateway",
        ethBridge: "Eth Bridge",
        wstETHBridge: "wstETH Bridge",
        tbtc: "TBTC",
        usdtBridge: "USDT Bridge",
      }[e.details.route] || "Manual Bridge",
    ...(isTransferError
      ? {
          "error-type": e.error.type || "unknown",
          "error-message": getErrorMessage(e.error?.original),
        }
      : {}),
  };

  // Transfer event information
  sendEvent({ ...span, properties: { ...attributes } });
};

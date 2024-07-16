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
    ip: false,
    debug: isPreview,
  }
);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const sendEvent = (e: any) => {
  try {
    mixpanel.track(e.event, e.properties);
  } catch (error) {
    console.error(error);
  }
};
let lastChain: string;

/* eslint-disable  @typescript-eslint/no-explicit-any */
const getErrorMessage = (error: any) => {
  let message = "";
  if (error?.code) {
    message += `Code: ${error.code} `;
  }
  if (error?.name) {
    message += `Name: ${error.name} `;
  }
  if (error?.message) {
    message += `Message: ${error.message}`;
  }
  return message;
};



export const eventHandler = (e: WormholeConnectEvent) => {
  // Ignore the load event
  if (e.type === "load") return;

  // Start the trace when the event is load
  let span = { event: e.type, properties: e.details as unknown };
  // Wallet connect information
  if (e.type === "wallet.connect") {
    const side = e.details.side;
    span = {
      ...span,
      properties: {
        [`wallet-${side}`]: e.details.wallet,
        [`chain-${side}`]: e.details.chain,
      },
    };
    const chain = `${e.details.chain}-${side}`;
    if (lastChain !== chain) {
      sendEvent(span);
    }
    lastChain = chain;
  } else {
    // Convert WormholeConnectEvent to Attributes
    const attributes: { [key: string]: string } = {};

    attributes["fromChain"] = e.details.fromChain;
    attributes["toChain"] = e.details.toChain;
    attributes["fromTokenSymbol"] = e.details.fromToken?.symbol;
    attributes["fromTokenAddress"] =
      typeof e.details.fromToken?.tokenId === "object"
        ? e.details.fromToken?.tokenId.address
        : "native";
    attributes["toTokenSymbol"] = e.details.toToken?.symbol;
    attributes["toTokenAddress"] =
      typeof e.details.toToken?.tokenId === "object"
        ? e.details.toToken?.tokenId.address
        : "native";

    let routeName;
    switch (e.details.route) {
      case "bridge":
        routeName = "Manual Bridge";
        break;
      case "relay":
        routeName = "Relayer";
        break;
      case "ethBridge":
        routeName = "Eth Bridge";
        break;
      case "wstETHBridge":
        routeName = "wstETH Bridge";
        break;
      case "cctpManual":
        routeName = "CCTP Manual";
        break;
      case "cctpRelay":
        routeName = "CCTP Relayer";
        break;
      case "tbtc":
        routeName = "TBTC";
        break;
      case "cosmosGateway":
        routeName = "Cosmos Gateway";
        break;
      case "nttManual":
        routeName = "NTT Manual";
        break;
      case "nttRelay":
        routeName = "NTT Relayer";
        break;

      default:
        routeName = "Manual Bridge";
        break;
    }
    attributes["route"] = routeName;
    if (e.type === "transfer.error" || e.type === "transfer.redeem.error") {
      attributes["error-type"] = e.error.type || "unknown";
      attributes["error-message"] = getErrorMessage(e.error?.original);
    }

    // Transfer event information
    span = {
      ...span,
      properties: {
        ...attributes,
      },
    };
    sendEvent(span);
  }
};

import mixpanel from "mixpanel-browser";

mixpanel.init("fdaf35ef8f838559e248a71c80ff1626", {
  ignore_dnt: true,
  ip: false,
  debug: true,
});

let sessionId = localStorage.getItem("session.id");
if (!sessionId) {
  const newSessionId = crypto.randomUUID();
  localStorage.setItem("session.id", JSON.stringify(newSessionId));
  sessionId = newSessionId;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const sendEvent = (e: any) => {
  try {
    mixpanel.identify(localStorage.getItem("session.id") || ""); // TODO fix errAnonDistinctIdAssignedAlready error https://docs.mixpanel.com/docs/tracking-methods/id-management/identifying-users
    mixpanel.track(e.event, e.properties);
  } catch (error) {
    console.error(error);
  }
};
let lastChain: string;
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const eventHandler = (e: any) => {
  // Ignore the load event
  if (e.type === "load") return;

  // Start the trace when the event is load
  let span = { event: e.type, properties: e.details };
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

import { Tracer, Span, Attributes, Context } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  SimpleSpanProcessor,
  WebTracerProvider,
  ReadableSpan,
  TracerConfig,
  Span as SpanSdk,
} from "@opentelemetry/sdk-trace-web";
import mixpanel, { Dict } from "mixpanel-browser";
import { OTLPExporterError } from "@opentelemetry/otlp-exporter-base";
import { createContext, useContext } from "react";
export type OpenTelemetryContextType = {
  tracer: Tracer;
};

export type OpenTelemetryProviderProps = {
  children: JSX.Element;
};

export const OpenTelemetryContext =
  createContext<OpenTelemetryContextType | null>(null);

class MixpanelSpanProcessor extends SimpleSpanProcessor {
  onStart(span: SpanSdk, context: Context): void {
    super.onStart(span, context);
  }
}

interface MixpanelSpan {
  event: string;
  properties: Dict | undefined;
}

const APP_NAME =
  import.meta.env.VITE_APP_NAME || "portal-bridge/wormhole-connect";

let sessionId = localStorage.getItem("session.id");
if (!sessionId) {
  const newSessionId = crypto.randomUUID();
  localStorage.setItem("session.id", JSON.stringify(newSessionId));
  sessionId = newSessionId;
}
const tracerProvider = new WebTracerProvider({
  resource: new Resource({
    ["service.name"]: APP_NAME,
    ["session.id"]: sessionId,
  }),
});
const TRACER = `tracer://${APP_NAME}`;

export const tracer = tracerProvider.getTracer(TRACER);

mixpanel.init("fdaf35ef8f838559e248a71c80ff1626", {
  ignore_dnt: true,
  ip: false,
  debug: true,
}); // TODO remove $device_id

class MixpanelExporter extends OTLPTraceExporter {
  convertMixpanel(spans: ReadableSpan[]): MixpanelSpan[] {
    const mixpanelSpan = spans.map((span) => {
      return {
        event: span.name,
        properties: {
          time: span.startTime[0],
          ...span.attributes,
        },
      };
    });
    return mixpanelSpan;
  }
  send(
    objects: ReadableSpan[],
    onSuccess: () => void,
    onError: (error: OTLPExporterError) => void
  ): void {
    const mixpanelSpan = this.convertMixpanel(objects);
    console.log("MixpanelExporter send", mixpanelSpan);
    try {
      mixpanel.identify(localStorage.getItem("session.id") || "");
      mixpanelSpan.forEach(
        (span: { event: string; properties: Dict | undefined }) => {
          mixpanel.track(span.event, span.properties);
        }
      );
      onSuccess();
    } catch (error) {
      onError(error as OTLPExporterError);
    }
  }
}

const providerConfig: TracerConfig = {
  resource: new Resource({
    "service.name": "portal-bridge",
  }),
};

const provider = new WebTracerProvider(providerConfig);

// we will use ConsoleSpanExporter to check the generated spans in dev console
//provider.addSpanProcessor(new MixpanelSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new MixpanelSpanProcessor(new MixpanelExporter()));
provider.register({
  contextManager: new ZoneContextManager(),
});

let span: Span;
let lastChain: string;
// Send the event to the opentelemetry
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const eventHandler = (e: any) => {
  // Ignore the load event
  if (e.type === "load") return;

  // Start the trace when the event is load
  span = provider.getTracer(TRACER).startSpan(e.type);

  // Wallet connect information
  if (e.type === "wallet.connect") {
    const side = e.details.side;
    span.setAttributes({
      [`wallet-${side}`]: e.details.wallet,
      [`chain-${side}`]: e.details.chain,
    });
    const chain = `${e.details.chain}-${side}`;
    if (lastChain !== chain) {
      span?.end();
    }
    lastChain = chain;
  } else {
    // Convert WormholeConnectEvent to Attributes
    const attributes: Attributes = {};

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
    span.setAttributes(attributes);
    span?.end();
  }
};

// Custom hook to use the OpenTelemetry context
export const useOpenTelemetry = () => {
  const context = useContext(OpenTelemetryContext);
  if (context === null) {
    throw new Error(
      "useOpenTelemetry must be used within a OpenTelemetryProvider"
    );
  }
  return context;
};

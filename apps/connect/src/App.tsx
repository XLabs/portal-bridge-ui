import type {
  ChainName,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { createContext, useMemo } from "react";
import customTheme from "./theme/connect";
import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";
import { useQueryParams } from "./hooks/useQueryParams";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

// OPENTELEMETRY CONFIG INIT

import {
  SimpleSpanProcessor,
  TracerConfig,
  WebTracerProvider,
  ReadableSpan,
  ConsoleSpanExporter,
  Tracer,
  Span as SpanSdk,
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Attributes, Context, Span } from "@opentelemetry/api";
import { OTLPExporterError } from "@opentelemetry/otlp-exporter-base";
import mixpanel, { Dict } from "mixpanel-browser";
import { WormholeConnectEvent } from "../../../../wormhole-connect/wormhole-connect/lib/src/telemetry/types";

const APP_NAME =
  import.meta.env.VITE_APP_NAME || "portal-bridge/wormhole-connect";
const TRACER = `tracer://${APP_NAME}`;

mixpanel.init("7413605f415a765835417c9ffe8ff702", {
  ignore_dnt: true,
  debug: true,
});

export type OpenTelemetryContextType = {
  tracer: Tracer;
};

export type OpenTelemetryProviderProps = {
  children: JSX.Element;
};

class MixpanelSpanProcessor extends SimpleSpanProcessor {
  onStart(span: SpanSdk, context: Context): void {
    //console.log('MixpanelSpanProcessor onStart', span, context);
    super.onStart(span, context);
  }
}

interface MixpanelSpan {
  event: string;
  properties: Dict | undefined;
}
const OpenTelemetryContext = createContext<OpenTelemetryContextType | null>(
  null
);
const sessionId = crypto.randomUUID();
localStorage.setItem("session.id", JSON.stringify(sessionId));
const tracerProvider = new WebTracerProvider({
  resource: new Resource({
    ["service.name"]: APP_NAME,
    ["session.id"]: sessionId,
  }),
});

class MixpanelExporter extends OTLPTraceExporter {
  convertMixpanel(spans: ReadableSpan[]): MixpanelSpan[] {
    console.log("MixpanelExporter convert", spans);
    // Must convert this in different types of span depending on the event
    const mixpanelSpan = spans.map((span) => {
      return {
        event: span.name,
        properties: {
          time: span.startTime[0],
          URL: span.attributes["http.url"],
          attributes: span.attributes,
          events: span.events,
          links: span.links,
          status: span.status,
          resource: span.resource,
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
const mixpanelExporter = new MixpanelExporter({
  url: "https://api.mixpanel.com/import?strict=1&project_id=3285009", // TODO replace with real project id
  headers: {
    Authorization: "Basic NzQxMzYwNWY0MTVhNzY1ODM1NDE3YzlmZmU4ZmY3MDI6", // TODO replace with real token
    accept: "application/json",
    "Content-Type": "application/json",
  },
});
// we will use ConsoleSpanExporter to check the generated spans in dev console
provider.addSpanProcessor(new MixpanelSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new MixpanelSpanProcessor(mixpanelExporter));
// custome processor and exporter?
provider.register({
  contextManager: new ZoneContextManager(),
});

// END OPENTELEMETRY CONFIG
// move to provider
let span: Span;
const defaultConfig: WormholeConnectConfig = {
  ...wormholeConnectConfig,
  eventHandler: (e: WormholeConnectEvent) => {
    console.log('WormholeConnectEvent', e);
    // Send the event to the opentelemetry
    // con el load
    if (e.type === "load") {
      span = provider.getTracer(TRACER).startSpan('transfer / redeem error'); 
    }
    else if (e.type === "transfer.error" || e.type === "transfer.redeem.start") {
      // en caso de errores
      span?.end();
      span = provider.getTracer(TRACER).startSpan(e.type);
    } else {
      // Convert WormholeConnectEvent to Attributes
      const attributes: Attributes = {};
      for (const key in e.details) {
        if (Object.prototype.hasOwnProperty.call(e.details, key)) {
          const value = (e.details as any)[key];
          attributes[key] = value;
        }
      }
      // para los demas eventos
      span?.addEvent(e.type, attributes);
    }
    
  },
};

export default function Root() {
  const { txHash, sourceChain, targetChain } = useQueryParams();
  const config = useMemo(
    () => ({
      ...defaultConfig,
      searchTx: {
        ...(txHash && { txHash }),
        ...(sourceChain && { chainName: sourceChain as ChainName }),
      },
      bridgeDefaults: {
        ...(sourceChain && { fromNetwork: sourceChain as ChainName }),
        ...(targetChain && { toNetwork: targetChain as ChainName }),
      },
    }),
    [txHash, sourceChain, targetChain]
  );
  const messages = Object.values(messageConfig);
  return (
    <>
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      <WormholeConnect config={config} theme={customTheme} />
    </>
  );
}

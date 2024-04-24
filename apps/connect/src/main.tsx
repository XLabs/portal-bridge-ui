import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import theme from "./theme/portal.ts";
import Background from "./components/atoms/Background.tsx";
import App from "./App.tsx";

// OPENTELEMETRY CONFIG INIT

import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  SimpleSpanProcessor,
  TracerConfig,
  WebTracerProvider,
  Span,
  ReadableSpan,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Context } from "@opentelemetry/api";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { OTLPExporterError } from "@opentelemetry/otlp-exporter-base";
import mixpanel, { Dict } from "mixpanel-browser";

mixpanel.init("7413605f415a765835417c9ffe8ff702", {
  ignore_dnt: true,
  debug: true,
});

class MixpanelSpanProcessor extends SimpleSpanProcessor {
  onStart(span: Span, context: Context): void {
    //console.log('MixpanelSpanProcessor onStart', span, context);
    super.onStart(span, context);
  }
}

class MixpanelExporter extends OTLPTraceExporter {
  convert(spans: ReadableSpan[]): any {
    // Must convert this in different types of span depending on the event
    const mixpanelSpan = spans.map((span) => {
      return {
        event: span.name,
        properties: {
          time: span.startTime[0],
          distinct_id: "91304156-cafc-4673-a237-623d1129c801", // TODO generate userId per session
          $insert_id:
            span.spanContext().spanId || "91304156-cafc-4673-a237-623d1129c801", // TODO generate a unique id per span
          "target.id": span.attributes["target.id"],
          "target.data-testid": span.attributes["target.data-testid"],
          ip: span.attributes.ip || "136.24.0.114", // TODO get the real ip
          URL: span.attributes["http.url"],
          kind: span.kind,
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
    const mixpanelSpan = this.convert(objects);
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

// Register event when click for now
const allowedElements = new Set<string>(["A", "BUTTON", "DIV"]);
let previousTargetedElementXPath = "";
let previousTimestamp = 0;
registerInstrumentations({
  instrumentations: [
    new UserInteractionInstrumentation({
      eventNames: ["click"],
      shouldPreventSpanCreation: (_, element, span) => {
        // prevent span creation if the element has a specific attribute
        // @ts-expect-error target_element is not a standard attribute
        const targetElement = span.attributes.target_element;
        if (targetElement && !allowedElements.has(targetElement)) return true;

        // @ts-expect-error target_xpath is not a standard attribute
        const targetElementXPath = span.attributes.target_xpath;
        const timestamp = new Date().getTime();
        // To avoid the multiple click event in react
        // https://github.com/open-telemetry/opentelemetry-js-contrib/issues/1368#issuecomment-2002452694
        // and use a timestamp to avoid loss events with the case that the user click multiple times in the same element
        if (
          previousTargetedElementXPath == targetElementXPath &&
          previousTimestamp >= timestamp - 100
        )
          return true;
        else {
          previousTargetedElementXPath = targetElementXPath;
          previousTimestamp = timestamp;
        }
        span.setAttribute("target.id", element.id);
        span.setAttribute(
          "target.data-testid",
          element.getAttribute("data-testid") || ""
        );
        return false;
      },
    }),
  ],
});

// END OPENTELEMETRY CONFIG

if (redirects && redirects?.source?.length > 0) {
  const matcher = new RegExp(redirects.source.join("|"));
  if (matcher.test(window.location.hash)) {
    window.location.href = `${redirects.target}${window.location.hash}`;
  }
}

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Background>
          <CssBaseline />
          <App />
        </Background>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

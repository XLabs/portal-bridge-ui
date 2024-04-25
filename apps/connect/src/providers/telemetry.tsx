import { Tracer, Span, Attributes, Context } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
	SimpleSpanProcessor, WebTracerProvider, ReadableSpan, TracerConfig, ConsoleSpanExporter,
	Span as SpanSdk,
} from "@opentelemetry/sdk-trace-web";
import mixpanel, { Dict } from "mixpanel-browser";
import { OTLPExporterError } from "@opentelemetry/otlp-exporter-base";
import { createContext, useContext } from "react";
import { WormholeConnectEvent } from "../../../../../wormhole-connect/wormhole-connect/lib/src/telemetry/types";

export type OpenTelemetryContextType = {
	tracer: Tracer;
};

export type OpenTelemetryProviderProps = {
	children: JSX.Element;
};

export const OpenTelemetryContext = createContext<OpenTelemetryContextType | null>(
	null
);

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
	localStorage.setItem("session.id", JSON.stringify(sessionId));
	sessionId = newSessionId;
}
const tracerProvider = new WebTracerProvider({
	resource: new Resource({
		["service.name"]: APP_NAME,
		["session.id"]: sessionId,
	}),
});
const TRACER = `tracer://${APP_NAME}`;

const tracer = tracerProvider.getTracer(TRACER);

// TODO use env variable for token project id
mixpanel.init("7413605f415a765835417c9ffe8ff702", {
	ignore_dnt: true,
	debug: true,
});

class MixpanelExporter extends OTLPTraceExporter {
	convertMixpanel(spans: ReadableSpan[]): MixpanelSpan[] {
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
			mixpanel.identify(localStorage.getItem("session.id") || '');
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
provider.addSpanProcessor(new MixpanelSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new MixpanelSpanProcessor(new MixpanelExporter()));
provider.register({
	contextManager: new ZoneContextManager(),
});

let span: Span;
export const eventHandler = (e: WormholeConnectEvent) => {
	console.log('WormholeConnectEvent', e);
	// Send the event to the opentelemetry
	// Start the trace when the event is load
	if (e.type === "load") {
		span = provider.getTracer(TRACER).startSpan('transfer / redeem error');
		return;
	}
	// Convert WormholeConnectEvent to Attributes
	const attributes: Attributes = {};
	Object.keys(e).forEach(field => {
		const data = (e as any)[field];
		if (field !== "type") {
			for (const key in data) {
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					const value = data[key];
					attributes[`${field}-${key}`] = typeof value === "object" ? JSON.stringify(value) : value;
				}
			}
		}
	});
	span?.addEvent(e.type, attributes);
	// End the trace when the event is transfer.error
	if (e.type === "transfer.error") { // TODO; include transfer.redeem.error event
		span?.end();
		// Reset the span to start a new trace
		span = provider.getTracer(TRACER).startSpan(e.type);
	}

};


// Provider component
export const OpenTelemetryProvider = ({
	children,
}: OpenTelemetryProviderProps) => {
	return (
		<OpenTelemetryContext.Provider value={{ tracer }}>
			{children}
		</OpenTelemetryContext.Provider>
	);
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

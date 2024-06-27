import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import theme from "./theme/portal.ts";
import Background from "./components/atoms/Background.tsx";
import App from "./App.tsx";
import { OpenTelemetryContext, tracer } from "./providers/telemetry.ts";
import { BrowserRouter } from "react-router-dom";

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
        <OpenTelemetryContext.Provider value={{ tracer }}>
          <Background>
            <CssBaseline />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Background>
        </OpenTelemetryContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

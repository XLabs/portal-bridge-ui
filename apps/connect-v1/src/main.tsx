import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { GlobalStyles } from "@mui/material";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { App } from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { ENV } from "@env";
import { themePortal } from "./theme/portal.ts";
import { globalStyles } from "./theme/globalStyles.ts";

if (ENV.redirects && ENV.redirects?.source?.length > 0) {
  const matcher = new RegExp(ENV.redirects.source.join("|"));
  if (matcher.test(window.location.hash)) {
    window.location.href = `${ENV.redirects.target}${window.location.hash}`;
  }
}

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={themePortal}>
      <GlobalStyles styles={globalStyles} />
      <QueryClientProvider client={client}>
        <CssBaseline />
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

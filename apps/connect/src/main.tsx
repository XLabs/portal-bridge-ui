import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme/portal.ts";
import Background from "./components/atoms/Background.tsx";
import App from "./App.tsx";

if (redirects) {
  const matcher = new RegExp(redirects.join("|"));
  const hash = window.location.hash;
  if (matcher.test(hash)) {
    window.location.href = advancedToolsHref+hash;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Background>
        <CssBaseline />
        <App />
      </Background>
    </ThemeProvider>
  </React.StrictMode>
);

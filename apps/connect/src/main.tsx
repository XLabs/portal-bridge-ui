import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { RouterProvider, createHashRouter as createRouter } from "react-router-dom";
import theme from "./theme/portal.ts";
import TokenBridge from "./routes/token.tsx";
import SuiBridge from "./routes/sui.tsx";
import CosmosBridge from "./routes/cosmos.tsx";
import USDCBridge from "./routes/usdc.tsx";
import Root from "./routes/root.tsx";
import Background from "./components/atoms/Background.tsx";

const router = createRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <TokenBridge />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Background>
        <CssBaseline />
        <RouterProvider router={router} />
      </Background>
    </ThemeProvider>
  </React.StrictMode>
);

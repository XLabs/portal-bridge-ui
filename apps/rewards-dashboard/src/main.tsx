import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppWithReownInjected from "./providers/Web3Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithReownInjected />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Web3Provider} from "./providers/Web3Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider />
  </React.StrictMode>
);

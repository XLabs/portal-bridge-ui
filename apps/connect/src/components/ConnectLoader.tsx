/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { useEffect, useState } from "react";
import styled from "@mui/material/styles/styled";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export type WormholeLoaderProps = {
  config: WormholeConnectConfig;
};

const SpinnerContainer = styled(Box)(() => ({
  margin: 10,
  display: "flex",
  justifyContent: "center",
}));

/*const { VITE_APP_JS_WC_INTEGRITY_SHA_384, VITE_APP_CSS_WC_INTEGRITY_SHA_384 } =
  import.meta.env;
*/
export default function ConnectLoader({ config }: WormholeLoaderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    // script.src = `assets/wormhole-connect/main.js`;
    script.type = "module";
    /*if (VITE_APP_JS_WC_INTEGRITY_SHA_384) {
      script.integrity = `sha384-${VITE_APP_JS_WC_INTEGRITY_SHA_384}`;
    }*/
    script.async = true;
    script.onload = () => setLoading(false);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `assets/wormhole-connect/main.css`;
    /*if (VITE_APP_CSS_WC_INTEGRITY_SHA_384) {
    link.href = `assets/wormhole-connect/main.css?id=${VITE_APP_CSS_WC_INTEGRITY_SHA_384}`;
    if (VITE_APP_CSS_WC_INTEGRITY_SHA_384) {
      link.integrity = `sha384-${VITE_APP_CSS_WC_INTEGRITY_SHA_384}`;
    }*/
    document.body.appendChild(script);
    document.head.appendChild(link);
    return () => {
      script.remove();
      link.remove();
    };
  }, []);

  return (
    <>
      {loading ? (
        <SpinnerContainer>
          <CircularProgress />
        </SpinnerContainer>
      ) : null}
      <div
        id="wormhole-connect"
        style={{ display: loading ? "none" : "block" }}
        //@ts-ignore
        config={JSON.stringify(config)}
      ></div>
    </>
  );
}

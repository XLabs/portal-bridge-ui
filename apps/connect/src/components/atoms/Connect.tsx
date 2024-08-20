import { memo, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import customTheme from "../../theme/connect";
import Banner from "./Banner";
import { useConnectConfig } from "../../hooks/useConnectConfig";

export const Connect = memo(() => {
  const config = useConnectConfig();

  useEffect(() => {
    if (config) {
      localStorage.setItem("Connect Config", JSON.stringify(config, null, 2));
    }
  }, [config]);

  return (
    <>
      {!!config && <WormholeConnect config={config} theme={customTheme} />}
      <Banner />
    </>
  );
});

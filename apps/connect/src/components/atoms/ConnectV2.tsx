import { memo, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { theme } from "../../theme/connect";
import Banner from "./Banner";
import { useConnectConfig } from "../../hooks/useConnectConfigv2";

export const ConnectV2 = memo(() => {
  const config = useConnectConfig();

  useEffect(() => {
    if (config) {
      localStorage.setItem(
        "Connect v2 Config",
        JSON.stringify(config, null, 2)
      );
    }
  }, [config]);
  return (
    <>
      {!!config && <WormholeConnect config={config} theme={theme} />}
      <Banner />
    </>
  );
});

import { memo } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import customTheme from "../../theme/connect";
import Banner from "./Banner";
import { useConnectConfig } from "../../hooks/useConnectConfig";

export const Connect = memo(() => {
  const config = useConnectConfig();
  return (
    <>
      <WormholeConnect config={config} theme={customTheme} />
      <Banner />
    </>
  );
});

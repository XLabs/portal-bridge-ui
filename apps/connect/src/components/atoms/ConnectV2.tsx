import { memo } from "react";
import WormholeConnect, {
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import customTheme from "../../theme/connect";
import Banner from "./Banner";
import { ENV } from "../../env/v2-token-bridge.mainnet";

export const ConnectV2 = memo(() => {
  return (
    <>
      <WormholeConnect
        config={ENV.wormholeConnectConfig as WormholeConnectConfig}
        theme={customTheme}
      />
      <Banner />
    </>
  );
});

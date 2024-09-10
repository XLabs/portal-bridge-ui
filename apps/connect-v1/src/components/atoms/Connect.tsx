import { memo, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useConnectConfig } from "../../hooks/useConnectConfig";
import { Container, Banner, themeConnectV1 } from "@xlabs/common-library";

export const Connect = memo(() => {
  const config = useConnectConfig();

  useEffect(() => {
    if (config) {
      localStorage.setItem("Connect Config", JSON.stringify(config, null, 2));
    }
  }, [config]);

  return (
    <Container>
      {!!config && <WormholeConnect config={config} theme={themeConnectV1} />}
      <Banner />
    </Container>
  );
});

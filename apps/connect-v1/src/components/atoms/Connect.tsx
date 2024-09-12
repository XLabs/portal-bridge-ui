import { memo, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useConnectConfig } from "../../hooks/useConnectConfig";
import { theme as themeConnectV1 } from "../../theme/connect";
import { styled } from "@mui/material";
import { NAVBAR_WIDTH } from "./NavBar";
import { Banner } from "./Banner";

export const Container = styled("div")(({ theme }) => ({
  paddingRight: `${NAVBAR_WIDTH}px`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
  },
}));
export const Connect = memo(() => {
  const config = useConnectConfig();

  useEffect(() => {
    if (config) {
      localStorage.setItem(
        "Connect Config v1",
        JSON.stringify(config, null, 2)
      );
    }
  }, [config]);

  return (
    <Container>
      {!!config && <WormholeConnect config={config} theme={themeConnectV1} />}
      <Banner />
    </Container>
  );
});

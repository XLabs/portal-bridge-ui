import { memo, useEffect } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect-v1";
import { theme } from "../../theme/connect";
import Banner from "./Banner";
import { useConnectConfig } from "../../hooks/useConnectConfig";
import { styled } from "@mui/material";
import { NAVBAR_WIDTH } from "./NavBar";

const Container = styled("div")(({ theme }) => ({
  paddingRight: `${NAVBAR_WIDTH}px`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
  },
}));

export const Connect = memo(() => {
  const config = useConnectConfig();

  useEffect(() => {
    if (config) {
      localStorage.setItem("Connect Config", JSON.stringify(config, null, 2));
    }
  }, [config]);

  return (
    <Container>
      {!!config && <WormholeConnect config={config} theme={theme} />}
      <Banner />
    </Container>
  );
});

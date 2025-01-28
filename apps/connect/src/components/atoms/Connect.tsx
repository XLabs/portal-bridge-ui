import { memo, useEffect, useState } from "react";
import WormholeConnect, {
  nttRoutes,
} from "@wormhole-foundation/wormhole-connect";
import { useConnectConfig } from "../../hooks/useConnectConfig";
import { styled } from "@mui/material";
import { NAVBAR_WIDTH } from "./NavBar";
import { theme } from "../../theme/connect";
import { Banner } from "./Banner";
import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { fetchTokens } from "../../utils/fetchTokens";

export const Container = styled("div")(({ theme }) => ({
  paddingRight: `${NAVBAR_WIDTH}px`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
  },
}));

export const Connect = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<WormholeConnectConfig | null>(null);

  const offlineConfig = useConnectConfig();

  useEffect(() => {
    console.log("offline", offlineConfig);

    if (offlineConfig) {
      const asyncConfig = async () => {
        const nttTokensConfig = await fetchTokens("Mainnet");

        const newConfig = {
          ...offlineConfig,
          routes: [
            ...(offlineConfig.routes || []),
            ...nttRoutes({ tokens: nttTokensConfig }),
          ],
        };

        setConfig(newConfig);
        console.log("newConfig", newConfig);

        localStorage.setItem(
          "Connect Config",
          JSON.stringify(newConfig, null, 2)
        );

        setIsLoading(false);
      };

      asyncConfig();
    }
  }, [offlineConfig]);

  return (
    <Container>
      {isLoading ? (
        <div>LOADING...</div>
      ) : (
        <>
          {!!config && <WormholeConnect config={config} theme={theme} />}
          <Banner />
        </>
      )}
    </Container>
  );
});

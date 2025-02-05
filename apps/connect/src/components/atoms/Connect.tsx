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
import { fetchTokensConfig } from "../../utils/fetchTokens";

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
    if (offlineConfig) {
      const asyncConfig = async () => {
        const { nttTokensConfig, tokensConfig, wrappedTokensConfig } =
          await fetchTokensConfig("Mainnet");

        const nttRoutesConfig = nttTokensConfig
          ? nttRoutes({ tokens: nttTokensConfig })
          : [];

        const allTokensConfig: any = {};
        if (wrappedTokensConfig) {
          allTokensConfig.wrappedTokens = wrappedTokensConfig;
        }
        if (tokensConfig) {
          allTokensConfig.tokensConfig = tokensConfig;
        }

        const fullConfig = {
          ...offlineConfig,
          routes: [...(offlineConfig.routes || []), ...nttRoutesConfig],
          ...allTokensConfig,
        };

        setConfig(fullConfig);

        localStorage.setItem(
          "Connect Config",
          JSON.stringify(fullConfig, null, 2)
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

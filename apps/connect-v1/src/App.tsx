import {
  Footer,
  Main,
  messages as messageConfig,
  NavBar,
  NewsBar,
  Wrapper,
} from "@xlabs/common-library";
import { Connect } from "./components/atoms/Connect";
import { ENV } from "@env";
import { useBannerMessageConfig } from "./hooks/useBannerMessageConfig";
import { useMessages } from "./hooks/useMessages";

const messages = Object.values(messageConfig);

export const App = () => {
  const message = useBannerMessageConfig(messages) || undefined;
  const banners = useMessages();
  return (
    <Wrapper>
      <NewsBar message={message} banners={banners} />
      <Main>
        <NavBar
          navBar={[...ENV.navBar]}
          env={ENV.wormholeConnectConfig.env || "mainnet"}
        />
        <Connect />
      </Main>
      <Footer publicUrl={ENV.PUBLIC_URL} />
    </Wrapper>
  );
};

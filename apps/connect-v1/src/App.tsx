import { Connect } from "./components/atoms/Connect";
import NewsBar from "./components/atoms/NewsBar";
import { Main, Wrapper } from "./components/atoms/Container";
import { Footer } from "./components/atoms/Footer";
import { NavBar } from "./components/atoms/NavBar";
import { messages as messageConfig } from "./configs/messages";

const messages = Object.values(messageConfig);

export const App = () => {
  return (
    <Wrapper>
      <NewsBar messages={messages} />
      <Main>
        <NavBar />
        <Connect />
      </Main>
      <Footer />
    </Wrapper>
  );
};

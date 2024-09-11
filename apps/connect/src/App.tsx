import { Route, Routes } from "react-router-dom";
import { PrivacyPolicyPath } from "./utils/constants";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import { Connect } from "./components/atoms/Connect";
import { Main, Wrapper } from "./components/atoms/Container";
import { Footer } from "./components/atoms/Footer";
import { NavBar } from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import { messages as messageConfig } from "./configs/messages";

const messages = Object.values(messageConfig);

export const App = () => {
  return (
    <Wrapper>
      <NewsBar messages={messages} />
      <Main>
        <NavBar />
        <Routes>
          <Route path={PrivacyPolicyPath} element={<PrivacyPolicy />} />
          <Route path="*" element={<Connect />} />
        </Routes>
      </Main>
      <Footer />
    </Wrapper>
  );
};

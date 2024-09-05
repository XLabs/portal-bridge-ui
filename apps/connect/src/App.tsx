import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material";

import { PrivacyPolicyPath } from "./utils/constants";
import messageConfig from "./configs/messages";
import { NavBar } from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import { Connect } from "./components/atoms/Connect";
import { Footer } from "./components/atoms/Footer";

const messages = Object.values(messageConfig);

const Wrapper = styled("main")(({ theme }) => ({
  margin: "auto",
  width: "100%",
  maxWidth: 1440,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: `${theme.spacing(3)} `,
}));

export const App = () => {
  return (
    <Wrapper>
      <header>
        <NewsBar messages={messages} />
        <NavBar />
      </header>
      <Routes>
        <Route path={PrivacyPolicyPath} element={<PrivacyPolicy />} />
        <Route path="*" element={<Connect />} />
      </Routes>
      <Footer />
    </Wrapper>
  );
};

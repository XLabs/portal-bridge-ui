import NavBar from "./components/atoms/NavBar";
import NewsBar from "./components/atoms/NewsBar";
import messageConfig from "./configs/messages";

import { Route, Routes } from "react-router-dom";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import { PrivacyPolicyPath } from "./utils/constants";
import { ENV } from "@env";
import { Connect } from "./components/atoms/Connect";

export default function Root() {
  const messages = Object.values(messageConfig);

  return (
    <>
      {ENV.versions.map(({ appName, version }, idx) => (
        <meta
          name={appName}
          content={version}
          key={`${appName}-${version}-${idx}`}
        />
      ))}
      <div>
        <NewsBar messages={messages} />
        <NavBar />
      </div>
      <Routes>
        <Route path={PrivacyPolicyPath} element={<PrivacyPolicy />} />
        <Route path="*" element={<Connect />} />
      </Routes>
    </>
  );
}

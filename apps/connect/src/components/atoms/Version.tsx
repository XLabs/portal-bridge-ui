import React from "react";
import Footer from "./Footer";
import { ENV } from "@env";

export default function Version() {
  return (
    <Footer left="120px">
      {ENV.versions.map(({ appName, version }, idx) => (
        <React.Fragment key={`${appName}-${version}-${idx}`}>
          {appName}: {version}
          {idx < ENV.versions.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Footer>
  );
}

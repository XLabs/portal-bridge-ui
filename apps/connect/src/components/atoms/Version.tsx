import React from "react";
import Footer from "./Footer";

export default function Version() {
  return (
    <Footer left="120px">
      {versions
        .map(({ appName, version}, idx) => (
          <React.Fragment key={`${appName}-${version}-${idx}`}>
            {appName}: {version}
            {idx < versions.length - 1 && <br />}
          </React.Fragment>
        ))}
    </Footer>
  );
}

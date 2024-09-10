import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import React from "react";

window.React = global.React = React;

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

jest.mock("./src/env/env-vars.ts", () => ({ envVars: process.env }));

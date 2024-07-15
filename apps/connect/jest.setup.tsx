import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

jest.mock("./src/env/env-vars.ts", () => ({ envVars: process.env }));

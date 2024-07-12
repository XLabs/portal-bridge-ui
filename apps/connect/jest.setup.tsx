import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

const navBar: any[] = [];
const wormholeConnectConfig: any = {};

Object.assign(global, { TextDecoder, TextEncoder, navBar, wormholeConnectConfig });

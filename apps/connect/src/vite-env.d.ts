/// <reference types="vite/client" />

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
declare global {
    declare const wormholeConnectConfig: WormholeConnectConfig;
}

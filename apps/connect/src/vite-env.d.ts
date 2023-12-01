/// <reference types="vite/client" />

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

type NavLink = {
  label: string;
  active?: boolean;
  href: string;
};

declare global {
  declare const wormholeConnectConfig: WormholeConnectConfig;
  declare const navBar: NavLink[];
}

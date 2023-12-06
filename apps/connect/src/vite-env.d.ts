/// <reference types="vite/client" />

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

type NavLink = {
  label: string;
  active?: boolean;
  href: string;
};

type Redirect = {
  source: string[];
  target: string;
};

declare global {
  declare const wormholeConnectConfig: WormholeConnectConfig;
  declare const navBar: NavLink[];
  declare const redirects: Redirect;
}

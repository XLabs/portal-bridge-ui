import { type WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, PUBLIC_URL, wormholeConnectConfigCommon } from "./common";

export const ENV: Env = {
  PUBLIC_URL,
  navBar: [
    { label: "Home", href: `${PUBLIC_URL}/` },
    // {
    //   label: "Staking",
    //   href: "https://www.tally.xyz/gov/wormhole",
    //   isBlank: true,
    // },
    { label: "USDC", href: `${PUBLIC_URL}/usdc-bridge` },
    { label: "tBTC", active: true, href: `${PUBLIC_URL}/tbtc-bridge` },
    {
      label: "Advanced Tools",
      isBlank: true,
      href: `${PUBLIC_URL}/advanced-tools/`,
    },
    {
      label: "More",
      href: "",
      subMenu: {
        open: false,
        content: [{ label: "Cosmos", href: `${PUBLIC_URL}/cosmos` }],
      },
    },
  ],
  redirects: undefined,
  wormholeConnectConfig: {
    ...wormholeConnectConfigCommon,
    pageHeader: {
      text: "tBTC Transfer",
      align: "center",
    },
    routes: ["tbtc"],
    tokens: [
      "tBTC",
      "tBTCoptimism",
      "tBTCpolygon",
      "tBTCarbitrum",
      "tBTCbase",
      "tBTCsol",
    ],
  } as WormholeConnectConfig,
};

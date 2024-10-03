import {
  DEFAULT_ROUTES,
  type WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { Env, PUBLIC_URL, wormholeConnectConfigCommon } from "./common";
import { mergeDeep } from "../utils/mergeDeep";

export const ENV: Env = {
  PUBLIC_URL,
  navBar: [
    { label: "Home", href: `${PUBLIC_URL}/` },
    // {
    //   label: "Staking",
    //   href: "https://www.tally.xyz/gov/wormhole",
    //   isBlank: true,
    // },
    { label: "USDC", active: true, href: `${PUBLIC_URL}/usdc-bridge` },
    { label: "tBTC", href: `${PUBLIC_URL}/tbtc-bridge` },
    { label: "Rewards", href: `${PUBLIC_URL}/rewards-dashboard` },
  ],
  redirects: undefined,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    wormholeConnectConfigCommon,
    {
      ui: {
        pageHeader: { text: "USDC Transfer", align: "center" },
        partnerLogo:
          "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg class='white-mode ' id='Layer_2' data-name='Layer 2' role='button' viewBox='0 0 912 242' version='1.1' sodipodi:docname='circle.svg' width='912' height='242' inkscape:version='1.2.2 (b0a84865, 2022-12-01)' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs95'%3E%3Cstyle id='style83'%3E .cls-1-1 %7B fill: %23ffffff; %7D .cls-2 %7B fill: %23ffffff; %7D .cls-3 %7B fill: %23ffffff; %7D %3C/style%3E%3ClinearGradient id='linear-gradient' x1='177.86' y1='291.17999' x2='341.06' y2='127.98' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%233D3652' id='stop85' /%3E%3Cstop offset='1' stop-color='%233D3652' id='stop87' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='96.43' y1='207.75' x2='259.64001' y2='44.549999' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%233D3652' id='stop90' /%3E%3Cstop offset='1' stop-color='%233D3652' id='stop92' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath class='cls-1-1' d='m 219.58983,63.44052 -5,-8.78 a 5.14,5.14 0 0 0 -8.11,-1.08 l -11.5,11.49 a 5.17,5.17 0 0 0 -0.64,6.51 90.22,90.22 0 0 1 10,20.58 v 0 a 90.2,90.2 0 0 1 -85.45,119 89.38,89.38 0 0 1 -42.259999,-10.49 l 19.449999,-19.46 a 64.41,64.41 0 0 0 80.77,-88.29 5.15,5.15 0 0 0 -8.29,-1.41 l -11.64,11.56 a 5.14,5.14 0 0 0 -1.37,4.82 l 1,4.18 a 38.63,38.63 0 0 1 -56.75,42.39 l -5.13,-2.94 a 5.13,5.13 0 0 0 -6.199999,0.83 l -47.51,47.5 a 5.15,5.15 0 0 0 0.51,7.73 l 7,5.37 a 114.86,114.86 0 0 0 70.459999,23.88 116,116 0 0 0 100.66,-173.39 z' id='path97' /%3E%3Cpath class='cls-2' d='m 189.36983,28.890522 a 114.83,114.83 0 0 0 -70.46,-23.89 A 116,116 0 0 0 18.219831,178.44052 l 5,8.77 a 5.16,5.16 0 0 0 8.12,1.09 l 11.48,-11.48 a 5.19,5.19 0 0 0 0.64,-6.5 89.81,89.81 0 0 1 -10,-20.58 v 0 a 90.2,90.2 0 0 1 85.449999,-118.999998 89.29,89.29 0 0 1 42.25,10.52 l -19.46,19.449998 a 64.39,64.39 0 0 0 -87.209999,60.23 c 0,1.07 0.29,5.95 0.38,6.79 a 64.76,64.76 0 0 0 6.07,21.27 5.16,5.16 0 0 0 8.3,1.41 l 11.64,-11.65 a 5.15,5.15 0 0 0 1.38,-4.81 l -1,-4.19 a 38.62,38.62 0 0 1 56.749999,-42.38 l 5.13,2.94 a 5.16,5.16 0 0 0 6.2,-0.83 l 47.5,-47.499998 a 5.16,5.16 0 0 0 -0.5,-7.74 z' id='path99' /%3E%3Cg class='logo-header-text' data-svg-origin='385.4800109863281 103.79999542236328' id='g113' transform='translate(-99.84016,-46.929478)'%3E%3Cpath class='cls-3' d='m 484.48,199.84 a 4.7,4.7 0 0 0 -6.09,0.14 c -7.45,5.78 -16.09,11.13 -28.72,11.13 -23.12,0 -41.93,-19.47 -41.93,-43.42 0,-23.95 18.74,-43.59 41.76,-43.59 10,0 20.8,4.21 28.74,11.18 a 4.67,4.67 0 0 0 3.62,1.62 4.08,4.08 0 0 0 3,-1.7 l 7.52,-7.74 a 4.83,4.83 0 0 0 1.47,-3.58 4.93,4.93 0 0 0 -1.72,-3.54 C 479,108.9 465.81,103.8 449.32,103.8 c -35.2,0 -63.84,28.82 -63.84,64.24 a 63.94,63.94 0 0 0 63.84,63.89 60.32,60.32 0 0 0 43,-17.3 5.32,5.32 0 0 0 1.52,-3.85 4.21,4.21 0 0 0 -1.36,-3 z' data-svg-origin='385.4800109863281 103.80000305175781' style='visibility:inherit;opacity:1' id='path101' /%3E%3Cpath class='cls-3' d='m 539.21,105.54 h -11.39 a 5,5 0 0 0 -4.83,4.85 v 115 a 5,5 0 0 0 4.83,4.86 h 11.39 a 5,5 0 0 0 4.83,-4.86 v -115 a 5,5 0 0 0 -4.83,-4.85 z' data-svg-origin='522.989990234375 105.54000091552734' style='visibility:inherit;opacity:1' id='path103' /%3E%3Cpath class='cls-3' d='m 674,144.25 c 0,-21.34 -17.57,-38.71 -39.17,-38.71 h -46.97 a 4.85,4.85 0 0 0 -4.83,4.85 v 115 a 4.85,4.85 0 0 0 4.83,4.86 h 11.22 a 5,5 0 0 0 4.83,-4.86 v -42.77 h 23.54 L 650,227.77 a 4.72,4.72 0 0 0 4.15,2.43 h 13.46 a 4.83,4.83 0 0 0 4.27,-2.29 5.14,5.14 0 0 0 0,-5 L 649,180.27 c 15.46,-6.87 25,-20.53 25,-36.02 z m -21.05,0.35 c 0,10.83 -8.93,20 -19.5,20 h -29.19 v -39.11 h 29.15 c 10.59,0 19.5,8.75 19.5,19.11 z' data-svg-origin='583.0299682617188 105.54000091552734' style='visibility:inherit;opacity:1' id='path105' /%3E%3Cpath class='cls-3' d='m 796.59,199.84 a 4.7,4.7 0 0 0 -6.09,0.14 c -7.45,5.78 -16.09,11.13 -28.72,11.13 -23.12,0 -41.93,-19.47 -41.93,-43.42 0,-23.95 18.73,-43.59 41.75,-43.59 10,0 20.8,4.21 28.75,11.18 a 4.65,4.65 0 0 0 3.65,1.62 4.08,4.08 0 0 0 3,-1.7 l 7.52,-7.74 a 4.82,4.82 0 0 0 1.46,-3.58 4.88,4.88 0 0 0 -1.71,-3.54 c -13.1,-11.44 -26.29,-16.54 -42.78,-16.54 -35.2,0 -63.84,28.82 -63.84,64.24 a 63.94,63.94 0 0 0 63.84,63.89 60.34,60.34 0 0 0 43,-17.3 5.33,5.33 0 0 0 1.52,-3.86 4.2,4.2 0 0 0 -1.36,-3 z' data-svg-origin='697.6499633789062 103.79999542236328' style='visibility:inherit;opacity:1' id='path107' /%3E%3Cpath class='cls-3' d='m 901.35,210.94 h -45.2 V 110.39 a 5,5 0 0 0 -4.83,-4.85 h -11.39 a 4.85,4.85 0 0 0 -4.83,4.85 v 115 a 4.85,4.85 0 0 0 4.83,4.86 h 61.42 a 4.85,4.85 0 0 0 4.84,-4.86 v -9.55 a 4.85,4.85 0 0 0 -4.84,-4.9 z' data-svg-origin='835.0999755859375 105.54000091552734' style='visibility:inherit;opacity:1' id='path109' /%3E%3Cpath class='cls-3' d='m 1003.67,125 a 4.85,4.85 0 0 0 4.83,-4.85 v -9.73 a 4.85,4.85 0 0 0 -4.83,-4.85 h -69 a 4.85,4.85 0 0 0 -4.83,4.85 v 115 a 4.85,4.85 0 0 0 4.83,4.86 h 69 a 4.85,4.85 0 0 0 4.83,-4.86 v -9.55 a 4.85,4.85 0 0 0 -4.83,-4.85 h -53 v -34.31 h 44.51 a 4.85,4.85 0 0 0 4.84,-4.85 v -9.72 a 5,5 0 0 0 -4.84,-4.86 H 950.7 V 125 Z' data-svg-origin='929.8399658203125 105.56999969482422' style='visibility:inherit;opacity:1' id='path111' /%3E%3C/g%3E%3C/svg%3E%0A",
      } as WormholeConnectConfig["ui"],
      routes: [...DEFAULT_ROUTES],
      tokens: [
        "USDCeth",
        "USDCavax",
        "USDCarbitrum",
        "USDCoptimism",
        "USDCbase",
        "USDCpolygon",
        "USDCsol",
      ],
    }
  ),
};

import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import ConnectLoader from "../components/ConnectLoader";
import customTheme from "../theme/connect";
import mui from '../theme/portal';

const config: WormholeConnectConfig = {
  mode: mui.palette.mode,
  customTheme,
  env: import.meta.env.VITE_APP_CLUSTER || "mainnet",
  pageHeader: "Token Bridge",
  pageSubHeader: "Portal is a bridge that offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole. Unlike many other bridges, you avoid double wrapping and never have to retrace your steps.",
  
  moreTokens: {
    href: 'https://portalbridge.com?sourceChain={:sourceChain}&targetChain={:targetChain}',
    label: 'More tokens ...',
  },
  extraNetworks: {
    href: 'https://portalbridge.com?sourceChain={:sourceChain}&targetChain={:targetChain}',
    networks: [
      {
        name: 'algorand',
        icon: "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg viewBox='532.3494 45.7309 238.36 238.72' width='238.36' height='238.72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='lINT7W' transform='matrix(1, 0, 0, 1, 326.5293884277344, -159.9090576171875)'%3E%3Cpolygon class='cls-1' points='444.18 444.32 406.81 444.32 382.54 354.04 330.36 444.33 288.64 444.33 369.29 304.57 356.31 256.05 247.56 444.36 205.82 444.36 343.64 205.64 380.18 205.64 396.18 264.95 433.88 264.95 408.14 309.71 444.18 444.32' style='fill: rgb(255, 255, 255);'/%3E%3C/g%3E%3C/svg%3E",
        label: 'Algorand',
      },
      {
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch' focusable='false' aria-hidden='true' viewBox='0 0 24 24' data-testid='OpenInNewIcon'%3E%3Cpath d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E",
        name: 'more',
        label: 'More ...',
        href: 'https://portalbridge.com/#/transfer',
        showOpenInNewIcon: false,
      },
    ],
  },

};

export default function TokenBridge() {
  return <ConnectLoader config={config} />;
}

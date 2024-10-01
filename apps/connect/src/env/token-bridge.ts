import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { chains, Env, PUBLIC_URL, wormholeConnectConfigCommon } from "./common";
import { mergeDeep } from "../utils/mergeDeep";

const ADVANCE_TOOLS_HREF = `${PUBLIC_URL}/advanced-tools/`;
const ADVANCE_TOOLS_HREF_TEMPLATE = `${ADVANCE_TOOLS_HREF}#/transfer?sourceChain={:sourceChain}&targetChain={:targetChain}`;
const USDC_BRIDGE_HREF = `${PUBLIC_URL}/usdc-bridge/`;

export const ENV: Env = {
  PUBLIC_URL,
  navBar: [
    { label: "Home", active: true, href: `${PUBLIC_URL}/` },
    // {
    //   label: "Staking",
    //   href: "https://www.tally.xyz/gov/wormhole",
    //   isBlank: true,
    // },
    { label: "USDC", href: USDC_BRIDGE_HREF },
    { label: "tBTC", href: `${PUBLIC_URL}/tbtc-bridge` },
    { label: "Rewards", href: `${PUBLIC_URL}/rewards-dashboard` },
  ],
  redirects: {
    source: [
      "#/nft",
      "#/redeem",
      "#/nft-origin-verifier",
      "#/token-origin-verifier",
      "#/register",
      "#/migrate/Ethereum/:legacyAsset/",
      "#/migrate/BinanceSmartChain/:legacyAsset/",
      "#/migrate/Celo/:legacyAsset/",
      "#/migrate/Ethereum/",
      "#/migrate/BinanceSmartChain/",
      "#/migrate/Celo/",
      "#/stats",
      "#/withdraw-tokens-terra",
      "#/unwrap-native",
      "#/custody-addresses",
    ],
    target: ADVANCE_TOOLS_HREF,
  },
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    wormholeConnectConfigCommon,
    {
      ui: {} as WormholeConnectConfig["ui"],
      chains: [...chains, "Solana", "Injective", "Klaytn"],
      moreNetworks: {
        href: ADVANCE_TOOLS_HREF_TEMPLATE,
        target: "_blank",
        description:
          "Advance Tools offers unlimited transfers across chains for tokens and NFTs wrapped by Wormhole.",
        networks: [],
      },
      tokensConfig: {},
    } as WormholeConnectConfig
  ),
};

import { ENV as ENV_BASE } from "./maker-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      rpcs: MAINNET_RPCS,
      networks: [
        "ethereum",
        "solana",
      ],
      tokensConfig: {
        USDSsolana: {
          key: 'USDSsolana',
          symbol: 'USDS',
          nativeChain: 'solana',
          tokenId: {
            chain: 'solana',
            address: 'USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA',
          },
          icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='USDS-Coin' version='1.1' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: url(%23radial-gradient); %7D .cls-1, .cls-2 %7B stroke-width: 0px; %7D .cls-2 %7B fill: %23fff; %7D %3C/style%3E%3CradialGradient id='radial-gradient' cx='976.2772395' cy='23.9735075' fx='976.2772395' fy='23.9735075' r='2.0690868' gradientTransform='translate(-18064.581412 757167.6887207) rotate(-90) scale(774.3790283)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffd232'/%3E%3Cstop offset='1' stop-color='%23ff6d6d'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg id='USDS-Coin-2'%3E%3Ccircle id='Element' class='cls-1' cx='500' cy='500' r='500'/%3E%3Cpath id='Element-2' class='cls-2' d='M308.7752075,631.4499512h-71.1536255c5.8073578,111.0870361,98.7437439,207.6535034,263.558075,207.6535034,164.0899963,0,268.643158-90.0327148,268.643158-206.2026367,0-220.7210693-333.2608948-208.3778076-333.2608948-336.1646118,0-35.5768127,26.8637085-77.6894531,89.3042297-77.6894531,69.7028198,0,151.7467651,54.4559021,157.5562134,124.1566467h70.427124c-7.2602539-112.5398407-116.8963623-190.9537048-256.2999573-190.9537048-144.4844666,0-253.3941803,84.2232666-253.3941803,203.2969055,0,227.2569885,333.26091,197.4875183,333.26091,337.6174622,0,43.5634766-26.8637085,79.8667603-94.387207,79.8667603-84.2232971,0-169.1729736-58.8104248-174.2539062-141.5808716h.000061ZM368.3120117,313.4359436c0,172.8010559,330.3572388,138.677124,330.3572388,323.0970154,0,55.1802368-36.3032837,103.8267212-79.8667603,116.1679077,15.2468872-14.5205078,26.8637085-46.4672241,26.8637085-76.9609985,0-170.6238403-331.0836487-147.3901978-331.0836487-322.370575,0-58.812439,37.7561035-106.0060425,84.9496765-120.5264893-18.1526489,21.7807007-31.2202454,50.0972595-31.2202454,80.5931396h.0000305Z'/%3E%3C/g%3E%3C/svg%3E",
          coinGeckoId: 'usds',
          decimals: {
            default: 6,
          },
        },
    
        USDSethereum: {
          key: 'USDSethereum',
          symbol: 'USDS',
          nativeChain: 'ethereum',
          tokenId: {
            chain: 'ethereum',
            address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
          },
          icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='USDS-Coin' version='1.1' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: url(%23radial-gradient); %7D .cls-1, .cls-2 %7B stroke-width: 0px; %7D .cls-2 %7B fill: %23fff; %7D %3C/style%3E%3CradialGradient id='radial-gradient' cx='976.2772395' cy='23.9735075' fx='976.2772395' fy='23.9735075' r='2.0690868' gradientTransform='translate(-18064.581412 757167.6887207) rotate(-90) scale(774.3790283)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffd232'/%3E%3Cstop offset='1' stop-color='%23ff6d6d'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg id='USDS-Coin-2'%3E%3Ccircle id='Element' class='cls-1' cx='500' cy='500' r='500'/%3E%3Cpath id='Element-2' class='cls-2' d='M308.7752075,631.4499512h-71.1536255c5.8073578,111.0870361,98.7437439,207.6535034,263.558075,207.6535034,164.0899963,0,268.643158-90.0327148,268.643158-206.2026367,0-220.7210693-333.2608948-208.3778076-333.2608948-336.1646118,0-35.5768127,26.8637085-77.6894531,89.3042297-77.6894531,69.7028198,0,151.7467651,54.4559021,157.5562134,124.1566467h70.427124c-7.2602539-112.5398407-116.8963623-190.9537048-256.2999573-190.9537048-144.4844666,0-253.3941803,84.2232666-253.3941803,203.2969055,0,227.2569885,333.26091,197.4875183,333.26091,337.6174622,0,43.5634766-26.8637085,79.8667603-94.387207,79.8667603-84.2232971,0-169.1729736-58.8104248-174.2539062-141.5808716h.000061ZM368.3120117,313.4359436c0,172.8010559,330.3572388,138.677124,330.3572388,323.0970154,0,55.1802368-36.3032837,103.8267212-79.8667603,116.1679077,15.2468872-14.5205078,26.8637085-46.4672241,26.8637085-76.9609985,0-170.6238403-331.0836487-147.3901978-331.0836487-322.370575,0-58.812439,37.7561035-106.0060425,84.9496765-120.5264893-18.1526489,21.7807007-31.2202454,50.0972595-31.2202454,80.5931396h.0000305Z'/%3E%3C/g%3E%3C/svg%3E",
          coinGeckoId: 'usds',
          decimals: {
            default: 18,
          },
        },
      },
      nttGroups: {
        USDS: {
          nttManagers: [
            {
              chainName: 'ethereum',
              address: '0x7d4958454a3f520bDA8be764d06591B054B0bf33',
              tokenKey: 'USDSethereum',
              transceivers: [
                {
                  address: '0x16D2b6c87A18cB59DD59EFa3aa50055667cf481d',
                  type: 'wormhole',
                },
              ],
            },
            {
              chainName: 'solana',
              address: 'STTUVCMPuNbk21y1J6nqEGXSQ8HKvFmFBKnCvKHTrWn',
              tokenKey: 'USDSsolana',
              transceivers: [
                {
                  address: '4ZQYCg7ZiVeNp9DxUbgc4b9JpLXoX1RXYfMXS5saXpkC',
                  type: 'wormhole',
                },
              ],
            }
          ]
        },
      },
    }
  ),
};

import { ENV as ENV_BASE } from "./token-bridge";
import { mergeDeep } from "../utils/mergeDeep";
import {
  DEFAULT_ROUTES,
  MayanRouteWH,
  MayanRouteMCTP,
  MayanRouteSWIFT,
  nttRoutes,
  type WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { Env, MAINNET_RPCS } from "./common";

export const ENV: Env = {
  ...ENV_BASE,
  wormholeConnectConfig: mergeDeep<WormholeConnectConfig>(
    ENV_BASE.wormholeConnectConfig,
    {
      // ui: {
      //   moreChains: { chains: [ALGORAND, ACALA, SEI, MORE] },
      // } as WormholeConnectConfig["ui"],
      rpcs: MAINNET_RPCS,
      routes: [
        ...DEFAULT_ROUTES,
        MayanRouteWH,
        MayanRouteMCTP,
        MayanRouteSWIFT,
        ...nttRoutes({
          tokens: {
            W: [
              {
                chain: "Solana",
                manager: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                token: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
                transceiver: [
                  {
                    address: "NTtAaoDJhkeHeaVUHnyhwbPNAN6WgBpHkHBTc6d7vLK",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
              {
                chain: "Ethereum",
                manager: "0xc072B1AEf336eDde59A049699Ef4e8Fa9D594A48",
                token: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
                transceiver: [
                  {
                    address: "0xDb55492d7190D1baE8ACbE03911C4E3E7426870c",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Arbitrum",
                manager: "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
                token: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
                transceiver: [
                  {
                    address: "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Optimism",
                manager: "0x1a4F1a790f23Ffb9772966cB6F36dCd658033e13",
                token: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
                transceiver: [
                  {
                    address: "0x9bD8b7b527CA4e6738cBDaBdF51C22466756073d",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0x5333d0AcA64a450Add6FeF76D6D1375F726CB484",
                token: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
                transceiver: [
                  {
                    address: "0xD1a8AB69e00266e8B791a15BC47514153A5045a6",
                    type: "wormhole",
                  },
                ],
              },
            ],
            osETH: [
              {
                chain: "Ethereum",
                manager: "0x896b78fd7e465fb22e80c34ff8f1c5f62fa2c009",
                token: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
                transceiver: [
                  {
                    address: "0xAAFE766B966219C2f3F4271aB8D0Ff1883147AB6",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Arbitrum",
                manager: "0x485F6Ac6a3B97690910C1546842FfE0629582aD3",
                token: "0xf7d4e7273E5015C96728A6b02f31C505eE184603",
                transceiver: [
                  {
                    address: "0xAf7ae721070c25dF97043381509DBc042e65736F",
                    type: "wormhole",
                  },
                ],
              },
            ],
            Lido_wstETH: [
              {
                chain: "Ethereum",
                manager: "0xb948a93827d68a82F6513Ad178964Da487fe2BD9",
                token: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
                transceiver: [
                  {
                    address: "0xA1ACC1e6edaB281Febd91E3515093F1DE81F25c0",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Bsc",
                manager: "0x6981F5621691CBfE3DdD524dE71076b79F0A0278",
                token: "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
                transceiver: [
                  {
                    address: "0xbe3F7e06872E0dF6CD7FF35B7aa4Bb1446DC9986",
                    type: "wormhole",
                  },
                ],
              },
            ],
            ETHFI: [
              {
                chain: "Ethereum",
                manager: "0x344169Cc4abE9459e77bD99D13AA8589b55b6174",
                token: "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb",
                transceiver: [
                  {
                    address: "0x3bf4AebcaD920447c5fdD6529239Ab3922ce2186",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Arbitrum",
                manager: "0x90A82462258F79780498151EF6f663f1D4BE4E3b",
                token: "0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27",
                transceiver: [
                  {
                    address: "0x4386e36B96D437b0F1C04A35E572C10C6627d88a",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0xE87797A1aFb329216811dfA22C87380128CA17d8",
                token: "0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2",
                transceiver: [
                  {
                    address: "0x2153bEa70D96cd804aCbC89D82Ab36638fc1A5F4",
                    type: "wormhole",
                  },
                ],
              },
            ],
            WeatherXM: [
              {
                chain: "Ethereum",
                manager: "0xd24afd8eca7b51bcf3c0e6b3ca94c301b121ccce",
                token: "0xde654f497a563dd7a121c176a125dd2f11f13a83",
                transceiver: [
                  {
                    address: "0x8b209672c2120f84ceb70b22416645f8912ad0f0",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "NttWixqwUHAnpXym3UYUySQZtb4C57EZxpH721JfLyF",
                token: "wxmJYe17a2oGJZJ1wDe6ZyRKUKmrLj2pJsavEdTVhPP",
                transceiver: [
                  {
                    address: "PaK4UctEGihEm37c2qSrbpkucHBBDDqbvYzGXygbxkb",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            JitoSOL: [
              {
                chain: "Solana",
                manager: "nTTJS9XtWhfHkPiLmddSmdMrCJAtJrSCjPwuns3fvu5",
                token: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
                transceiver: [
                  {
                    address: "nTTJS9XtWhfHkPiLmddSmdMrCJAtJrSCjPwuns3fvu5",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
              {
                chain: "Arbitrum",
                manager: "0x02f5FB92F3794C535b1523183A417fB9efbB4f5d",
                token: "0x83e1d2310Ade410676B1733d16e89f91822FD5c3",
                transceiver: [
                  {
                    address: "0x89E928e6D95BA6D7419B2b9e384fC526b1649339",
                    type: "wormhole",
                  },
                ],
              },
            ],
            Swissborg: [
              {
                chain: "Solana",
                manager: "NttBm3HouTCFnUBz32fEs5joQFRjFoJPA8AyhtgjFrw",
                token: "3dQTr7ror2QPKQ3GbBCokJUmjErGg8kTJzdnYjNfvi3Z",
                transceiver: [
                  {
                    address: "39eUvaqshuCbTo7CmQkHG7zBBLaDAPK3qg89cMSmqKWx",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
              {
                chain: "Ethereum",
                manager: "0x66a28B080918184851774a89aB94850a41f6a1e5",
                token: "0x64d0f55Cd8C7133a9D7102b13987235F486F2224",
                transceiver: [
                  {
                    address: "0x45E581d6841F0a99Fc34F70871ef56b353813ddb",
                    type: "wormhole",
                  },
                ],
              },
            ],
            Agora: [
              {
                chain: "Ethereum",
                manager: "0xCD024C7eB854f6799A343828773cB3A8107d17d4",
                token: "0x87B46212e805A3998B7e8077E9019c90759Ea88C",
                transceiver: [
                  {
                    address: "0x6eB0d287A539AAB2eB962De550Fe5dDA29b0fe52",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "NttADdCvGLUhukNyePei9CkmHoe6S9xjqgqfQv51PQg",
                token: "AGAxefyrPTi63FGL2ukJUTBtLJStDpiXMdtLRWvzambv",
                transceiver: [
                  {
                    address: "4FnEwHLcuu3CHf8YG31RWBCVpshGGxNyfYAszq2JABxi",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            XBorg: [
              {
                chain: "Ethereum",
                manager: "0xa4489105efa4b029485d6bd3A4f52131baAE4B1B",
                token: "0xEaE00D6F9B16Deb1BD584c7965e4c7d762f178a1",
                transceiver: [
                  {
                    address: "0x7135766F279b9A50F7A7199cfF1be284521a0409",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Arbitrum",
                manager: "0x7135766F279b9A50F7A7199cfF1be284521a0409",
                token: "0x93FA0B88C0C78e45980Fa74cdd87469311b7B3E4",
                transceiver: [
                  {
                    address: "0x874303ba6a34fC33ADcdFFd4293a41f32246D6a0",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "NttXP2tPLxGkNA3yrSfFZbtDbfKPKBrJUR6Jcqh6sRi",
                token: "XBGdqJ9P175hCC1LangCEyXWNeCPHaKWA17tymz2PrY",
                transceiver: [
                  {
                    address: "328hfTbiEzfbXSHCWqrBg3g1VZ9bRxNtUTffjQ4Tqark",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            Cheese: [
              {
                chain: "Arbitrum",
                manager: "0xfC843c4B402634a8Fc02137AAa7942474e043d72",
                token: "0x05AEa20947A9A376eF50218633BB0a5A05d40A0C",
                transceiver: [
                  {
                    address: "0x33D2E8093143a317234cB070C2BB6A641dDeFA4d",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "NTtxeqz2XjMnpcEoWMqb6pz84zHweJRYWyzmsmmW49E",
                token: "AbrMJWfDVRZ2EWCQ1xSCpoVeVgZNpq1U2AoYG98oRXfn",
                transceiver: [
                  {
                    address: "AoUmFKEGhsfnJSny6fMDF3JMgyEgjoG4yAk8YFGbfp6c",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            FANTOM_USDC: [
              {
                chain: "Fantom",
                manager: "0x68dB2f05Aa2d77DEf981fd2be32661340c9222FB",
                token: "0x2F733095B80A04b38b0D10cC884524a3d09b836a",
                transceiver: [
                  {
                    address: "0x8b47f02E7E20174C76Af910adc0Ad8A4B0342f4c",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Ethereum",
                manager: "0xeBdCe9a913d9400EE75ef31Ce8bd34462D01a1c1",
                token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                transceiver: [
                  {
                    address: "0x55f7820357FA17A1ECb48E959D5E637bFF956d6F",
                    type: "wormhole",
                  },
                ],
              },
            ],
            Renzo: [
              {
                chain: "Ethereum",
                manager: "0x4ba5ea226da36466EA7EbCf018df66a615D27c7c",
                token: "0x3B50805453023a91a8bf641e279401a0b23FA6F9",
                transceiver: [
                  {
                    address: "0x591Be6DBC81D65924dcC78912bBC9306D09c2faa",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "NtTtwqVX4SCNECrZ8ZmEaxAPFcm5r7Szx4tBmYLU17p",
                token: "3DK98MXPz8TRuim7rfQnebSLpA7VSoc79Bgiee1m4Zw5",
                transceiver: [
                  {
                    address: "DC5fFP5we3qshuoiQ4M7gjBnNKcKaqu4ibheetZeXfCY",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            Layer3: [
              {
                chain: "Ethereum",
                manager: "0x7926D63FEb9b950908b297cC995B6853bCA21847",
                token: "0x88909D489678dD17aA6D9609F89B0419Bf78FD9a",
                transceiver: [
                  {
                    address: "0x6C55F346C20Ca2b0C62e30790907f0a41C978ccc",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62",
                token: "0x46777C76dBbE40fABB2AAB99E33CE20058e76C59",
                transceiver: [
                  {
                    address: "0x8D77Ac62A6571a408e5C9655fF5dE90d537C3045",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "ntT5xGC7XEuR8Po9U3Umze12T9LBdaTCuEc9Cby6qPa",
                token: "5k84VjAKoGPXa7ias1BNgKUrX7e61eMPWhZDqsiD4Bpe",
                transceiver: [
                  {
                    address: "5JGpVmGF976mzhzQrfk2BSwqG8b2xg4NxQ88upmZ3iyR",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            VaultCraft: [
              {
                chain: "Arbitrum",
                manager: "0x0fa98307C08a4A832291767600ABaDb02209DF3f",
                token: "0xFeae6470A79b7779888f4a64af315Ca997D6cF33",
                transceiver: [
                  {
                    address: "0x8052D5245341F67a8033798987d5d4b323a0913A",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Ethereum",
                manager: "0xBfdc5171Cf63acE266aF9cA06DAD6301Ef6455d3",
                token: "0xcE246eEa10988C495B4A90a905Ee9237a0f91543",
                transceiver: [
                  {
                    address: "0xBf238579EFc1Da2cE9E8d1237aAE37531C16B37a",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Optimism",
                manager: "0xDafC709d84f5FE09546fD054220EA59b47517379",
                token: "0x43Ad2CFDDA3CEFf40d832eB9bc33eC3FACE86829",
                transceiver: [
                  {
                    address: "0x0f5325Ea19504403fA543688bC84F9DC3327D78b",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0xDafC709d84f5FE09546fD054220EA59b47517379",
                token: "0x43Ad2CFDDA3CEFf40d832eB9bc33eC3FACE86829",
                transceiver: [
                  {
                    address: "0x0f5325Ea19504403fA543688bC84F9DC3327D78b",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Avalanche",
                manager: "0x30F64191353Db3f2135CAb366039c916BE38B598",
                token: "0x58890c4d6268CA329C9Ff626dc4Da07c1977Deb4",
                transceiver: [
                  {
                    address: "0xdcA6fd78f1128F9593Af4c59e48FfEc177295654",
                    type: "wormhole",
                  },
                ],
              },
            ],
            USDS: [
              {
                chain: "Ethereum",
                manager: "0x7d4958454a3f520bDA8be764d06591B054B0bf33",
                token: "0xdc035d45d973e3ec169d2276ddab16f1e407384f",
                transceiver: [
                  {
                    address: "0x16D2b6c87A18cB59DD59EFa3aa50055667cf481d",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Solana",
                manager: "STTUVCMPuNbk21y1J6nqEGXSQ8HKvFmFBKnCvKHTrWn",
                token: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
                transceiver: [
                  {
                    address: "4ZQYCg7ZiVeNp9DxUbgc4b9JpLXoX1RXYfMXS5saXpkC",
                    type: "wormhole",
                  },
                ],
                quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ",
              },
            ],
            Avail: [
              {
                chain: "Ethereum",
                manager: "0x2E65520ff593b583A2e5895174eF7F40F78a90BD",
                token: "0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8",
                transceiver: [
                  {
                    address: "0xFaD96a1B1dad4a4391EEAb773Df739032526f389",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0x4b3d190ca333a1414376Dd565ACBa58350A36d67",
                token: "0xd89d90d26B48940FA8F58385Fe84625d468E057a",
                transceiver: [
                  {
                    address: "0xc986dD854B8F4acb5ccF2fa1cdacC113e6de0892",
                    type: "wormhole",
                  },
                ],
              },
            ],
            stAvail: [
              {
                chain: "Ethereum",
                manager: "0x71C4259648E5e6502C3cd29fB9aa818EF0142DD2",
                token: "0x3742f3Fcc56B2d46c7B8CA77c23be60Cd43Ca80a",
                transceiver: [
                  {
                    address: "0xb61306eCA0284aa4FcD09C1f40f7824A59824697",
                    type: "wormhole",
                  },
                ],
              },
              {
                chain: "Base",
                manager: "0x931c9E3a44A48F5b80D7B4aBB25E28AB12D1Ad2A",
                token: "0x74cb668d23E6e54524e2E1e4d1c392F5fd611783",
                transceiver: [
                  {
                    address: "0x2C1812D91086Cd5538F408Ed47C813780a3F5583",
                    type: "wormhole",
                  },
                ],
              },
            ],
          },
        }),
      ],
      wrappedTokens: {
        stBTC: {
          Sui: "0x5f496ed5d9d045c5b788dc1bb85f54100f2ede11e46f6a232c29daada4c5bdb6::coin::COIN",
          Aptos:
            "0x91d7249ba13f34e24892b126eea6b1acf00730ac56a3779477d0bf27f04c688b::coin::T",
          Bsc: "0x86EA0AED4d21AA13db4A00d93B8716dFbBcA4A8B",
        },
        enzoBTC: {
          Sui: "0x8f2b5eb696ed88b71fea398d330bccfa52f6e2a5a8e1ac6180fcb25c6de42ebc::coin::COIN",
          Aptos:
            "0x1d9a4d969e7a0d67052fee38da3086a89cb2fddfa322849ee0215b85ff01fa60::coin::T",
          Bsc: "0xE90669eB2dc5109710500b8a54cC847ad8702E6b",
        },
        joeEthereum: {
          Solana: "47uDEdzSvmwtWZi4The5upP1gB3i9zaGpCVYYLoJhf79",
        },
        spx6900: {
          Solana: "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr",
          Base: "0x50dA645f148798F68EF2d7dB7C1CB22A6819bb2C",
        },
        tBTC: {
          Arbitrum: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
          Polygon: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
          Optimism: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
          Base: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
          Solana: "6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU",
        },
        WOM: {
          Ethereum: "0xc0B314a8c08637685Fc3daFC477b92028c540CFB",
          Avalanche: "0xa15E4544D141aa98C4581a1EA10Eb9048c3b3382",
          Base: "0xD9541B08B375D58ae104EC247d7443D2D7235D64",
          Scroll: "0x1a7aD8A6171A1EA84DD1E6d649cbd616189660D9",
          Optimism: "0xD2612B256F6f76feA8C6fbca0BF3166D0d13a668",
          Arbitrum: "0x7B5EB3940021Ec0e8e463D5dBB4B7B09a89DDF96",
        },
        "USDC.e": {
          Ethereum: "0x566957eF80F9fd5526CD2BEF8BE67035C0b81130",
          Bsc: "0x672147dD47674757C457eB155BAA382cc10705Dd",
          Avalanche: "0x543672E9CBEC728CBBa9C3Ccd99ed80aC3607FA8",
          Sui: "0xcf72ec52c0f8ddead746252481fb44ff6e8485a39b803825bde6b00d77cdb0bb::coin::COIN",
          Aptos:
            "0xc7160b1c2415d19a88add188ec726e62aab0045f0aed798106a2ef2994a9101e::coin::T",
          Arbitrum: "0x9A3Fba8a0870Fb9765023681DAa5390C7919C916",
          Fantom: "0x6e0e8cf6Ad151e1260A4D398faaEDFC450A9f00a",
          Base: "0x59f4f969dd3A91A943651C9625E96822DC84Ef94",
          Celo: "0x0E21B5BdFb6eDBa7d903a610d4DE2F8c72586017",
        },
        BONK: {
          Ethereum: "0x1151CB3d861920e07a38e03eEAd12C32178567F6",
          Bsc: "0xA697e272a73744b343528C3Bc4702F2565b2F422",
          Polygon: "0xe5B49820e5A1063F6F4DdF851327b5E8B2301048",
          Avalanche: "0xC07C98a93591504584738e4569928DDb3b9f12A7",
          Sui: "0x6907963ca849faff0957b9a8269a7a07065e3def2eef49cc33b50ab946ea5a9f::coin::COIN",
          Aptos:
            "0x2a90fae71afc7460ee42b20ee49a9c9b29272905ad71fef92fbd8b3905a24b56::coin::T",
          Arbitrum: "0x09199d9A5F4448D0848e4395D065e1ad9c4a1F74",
          Wormchain:
            "wormhole10qt8wg0n7z740ssvf3urmvgtjhxpyp74hxqvqt7z226gykuus7eq9mpu8u",
          Osmosis:
            "ibc/CA3733CB0071F480FAE8EF0D9C3D47A49C6589144620A642BBE0D59A293D110E",
          Fantom: "0x3fEcdF1248fe7642d29f879a75CFC0339659ab93",
          Base: "0xDF1Cf211D38E7762c9691Be4D779A441a17A6cFC",
          Celo: "0x3fc50bc066aE2ee280876EeefADfdAbF6cA02894",
        },
        OP: {
          Ethereum: "0x1df721D242E0783F8fCab4A9FfE4F35bdf329909",
          Bsc: "0x0D5155720F292F5155c4Cf923AeFE523fe52a266",
          Polygon: "0x43a85384f880C9A6F00F21D6ec95b8CEee6A5d96",
          Avalanche: "0x137e3b33DC1Fe64bC6FC3d3fF2A801A2fdfcB4b2",
          Sui: "0xe817f4f6f07f0da308698a4d9cd8af8a5d05b234edc55ce524916dc8d2b42fa5::coin::COIN",
          Aptos:
            "0x863d1f83048111cb48be29cf86d2d3da6c48b64e6c60aa72ca3e3f4abe198386",
          Arbitrum: "0x3Ac2EBFf77Aab7cA87FC0e4e1c1b4a5E219957C2",
          Fantom: "0xC07B1b12122e4835e7b3d3920Cd55CA1EB238D6C",
          Base: "0x75A078Ab8d977BCECAFAfAAcA4339e6EACf648d3",
          Celo: "0x5a3203696ee43b0c80a1BFd446cc33c88B39BaeB",
        },
        ARB: {
          Ethereum: "0xe5EB5EbDB1dc46C7235BAa55a650B248caeCc01B",
          Bsc: "0xe4A57a1F98D93558eD877459980986B5fd295Daf",
          Polygon: "0xA7050dda333E67AAa76086ee66F7deDEE4E1e1fd",
          Avalanche: "0x0c0582EC56A1aA983EDda43cF19bC7bBd86Fba79",
          Optimism: "0x5F33522034D2281667b9354D2e9A0317755146AC",
          Sui: "0x37f44326b8ffd853e74030a00ede720380d164dcc33949aaf729c675865c4da3::coin::COIN",
          Aptos:
            "0xb628b3c69a4747cadc570ca75efaf43cff1979db3993d85db7d071a984b9e445",
          Fantom: "0x3f3a9fcAdE548b59E2c335E4f2dF2ae4ed4A6B63",
          Base: "0x9e325590933809B3b79B9C892f07D5A89d322542",
          Celo: "0xfA9f0D9b7E903970e16f65BD648ddD282E2772a1",
        },
        AUDIUS: {
          Solana: "9LzCMqDgTKYz9Drzqnpgee3SGa89up3a247ypMj2xrqM",
        },
        pSTAKE: {
          Sui: "0x61017ce4bd0b75b266af53edd60bbe391ba1a9fbe9a7d8553657c94ef73ee2ab::coin::COIN",
        },
        pxEth: {
          Sui: "0xf4530aa5ef8af33c497ec38f54ff9dd45fad9157264efae9693eb62faf8667b5::coin::COIN",
        },
      },
      tokensConfig: {
        stBTC: {
          key: "stBTC",
          symbol: "stBTC",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3",
          },
          coinGeckoId: "lorenzo-stbtc",
          decimals: 18,
          icon: "images/tokens/stBTC.svg",
        },
        enzoBTC: {
          key: "enzoBTC",
          symbol: "enzoBTC",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x6A9A65B84843F5fD4aC9a0471C4fc11AFfFBce4a",
          },
          icon: "images/tokens/enzoBTC.svg",
          decimals: 8,
          coinGeckoId: "lorenzo-stbtc",
        },
        joeEthereum: {
          key: "joeEthereum",
          symbol: "JOE",
          nativeChain: "Ethereum",
          icon: "https://coin-images.coingecko.com/coins/images/32333/large/joe.png?1697452551",
          tokenId: {
            chain: "Ethereum",
            address: "0x76e222b07c53d28b89b0bac18602810fc22b49a8",
          },
          coinGeckoId: "joe-coin",
          decimals: 8,
          displayName: "Joe Coin",
        },
        spx6900: {
          key: "spx6900",
          symbol: "SPX6900",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
          },
          icon: "images/tokens/spx6900.svg",
          coinGeckoId: "spx6900",
          decimals: 8,
        },
        $WIF: {
          key: "$WIF",
          symbol: "$WIF",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          },
          icon: "https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
          coinGeckoId: "dogwifcoin",
          color: "",
          decimals: 6,
        },
        ETHFIethereum: {
          key: "ETHFIethereum",
          symbol: "ETHFI",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb",
          },
          icon: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg?1710254562",
          coinGeckoId: "ether-fi",
          decimals: 18,
        },
        ETHFIarbitrum: {
          key: "ETHFIarbitrum",
          symbol: "ETHFI",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27",
          },
          icon: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg?1710254562",
          coinGeckoId: "ether-fi",
          decimals: 18,
        },
        ETHFIbase: {
          key: "ETHFIbase",
          symbol: "ETHFI",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2",
          },
          icon: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg?1710254562",
          coinGeckoId: "ether-fi",
          decimals: 18,
        },
        WOM: {
          key: "WOM",
          symbol: "WOM",
          nativeChain: "Bsc",
          tokenId: {
            chain: "Bsc",
            address: "0xad6742a35fb341a9cc6ad674738dd8da98b94fb1",
          },
          icon: "https://assets.coingecko.com/coins/images/26946/standard/Wombat_Token.png?1696526001",
          coinGeckoId: "wombat-exchange",
          decimals: 18,
        },
        "USDC.e": {
          key: "USDC.e",
          symbol: "USDC.e",
          nativeChain: "Polygon",
          tokenId: {
            chain: "Polygon",
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          },
          icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='86977684-12db-4850-8f30-233a7c267d11' width='2000' height='2000' viewBox='0 0 2000 2000' style='max-height: 100%25%3b max-width: 100%25%3b'%3e%3cpath fill='%232775ca' d='M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z'%3e%3c/path%3e%3cpath fill='white' d='M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z'%3e%3c/path%3e%3cpath fill='white' d='M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zm441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z'%3e%3c/path%3e%3c/svg%3e",
          coinGeckoId: "bridged-usdc-polygon-pos-bridge",
          color: "#FC8E03",
          decimals: 6,
        },
        BONK: {
          key: "BONK",
          symbol: "BONK",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          },
          icon: "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
          coinGeckoId: "bonk",
          color: "#FC8E03",
          decimals: 5,
        },
        Wsolana: {
          key: "Wsolana",
          symbol: "W",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 6,
        },
        Wethereum: {
          key: "Wethereum",
          symbol: "W",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Warbitrum: {
          key: "Warbitrum",
          symbol: "W",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Woptimism: {
          key: "Woptimism",
          symbol: "W",
          nativeChain: "Optimism",
          tokenId: {
            chain: "Optimism",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        Wbase: {
          key: "Wbase",
          symbol: "W",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
          },
          icon: "https://assets.coingecko.com/coins/images/35087/standard/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png?1708688954",
          coinGeckoId: "wormhole",
          decimals: 18,
        },
        osETHethereum: {
          key: "osETHethereum",
          symbol: "osETH",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
          },
          icon: "https://coin-images.coingecko.com/coins/images/33117/large/Frame_27513839.png?1700732599",
          coinGeckoId: "stakewise-staked-eth",
          decimals: 18,
        },
        osETHarbitrum: {
          key: "osETHarbitrum",
          symbol: "osETH",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0xf7d4e7273E5015C96728A6b02f31C505eE184603",
          },
          icon: "https://coin-images.coingecko.com/coins/images/33117/large/Frame_27513839.png?1700732599",
          coinGeckoId: "stakewise-staked-eth",
          decimals: 18,
        },
        wstETHBsc: {
          key: "wstETHBsc",
          symbol: "wstETH",
          nativeChain: "Bsc",
          tokenId: {
            chain: "Bsc",
            address: "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
          },
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9Im1heC1oZWlnaHQ6IDEwMCU7IG1heC13aWR0aDogMTAwJTsiPjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMjU2IiBmaWxsPSIjMDBBM0ZGIj48L3JlY3Q+PHBhdGggb3BhY2l0eT0iMC42IiBkPSJNMzYxLjAxMiAyMzcuODEyTDM2My44NzggMjQyLjIwOUMzOTYuMjA0IDI5MS43OTggMzg4Ljk4NCAzNTYuNzQyIDM0Ni41MiAzOTguMzQ4QzMyMS41MzkgNDIyLjgyNiAyODguNzk4IDQzNS4wNjYgMjU2LjA1NiA0MzUuMDY5QzI1Ni4wNTYgNDM1LjA2OSAyNTYuMDU2IDQzNS4wNjkgMzYxLjAxMiAyMzcuODEyWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0yNTYuMDQ0IDI5Ny43NjRMMzYxIDIzNy44MTJDMjU2LjA0NSA0MzUuMDY5IDI1Ni4wNDQgNDM1LjA2OSAyNTYuMDQ0IDQzNS4wNjlDMjU2LjA0NCAzOTIuMTA4IDI1Ni4wNDQgMzQyLjg4IDI1Ni4wNDQgMjk3Ljc2NFoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTE1MC45ODggMjM3LjgxMkwxNDguMTIyIDI0Mi4yMDlDMTE1Ljc5NiAyOTEuNzk4IDEyMy4wMTYgMzU2Ljc0MiAxNjUuNDggMzk4LjM0OEMxOTAuNDYxIDQyMi44MjYgMjIzLjIwMiA0MzUuMDY2IDI1NS45NDQgNDM1LjA2OUMyNTUuOTQ0IDQzNS4wNjkgMjU1Ljk0NCA0MzUuMDY5IDE1MC45ODggMjM3LjgxMloiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggb3BhY2l0eT0iMC42IiBkPSJNMjU1LjkxNCAyOTcuNzY0TDE1MC45NTggMjM3LjgxMkMyNTUuOTE0IDQzNS4wNjkgMjU1LjkxNCA0MzUuMDY5IDI1NS45MTQgNDM1LjA2OUMyNTUuOTE0IDM5Mi4xMDggMjU1LjkxNCAzNDIuODggMjU1LjkxNCAyOTcuNzY0WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0yNTYuMDgzIDE2My44MzNWMjY3LjIzM0wzNDYuNDkxIDIxNS41NjZMMjU2LjA4MyAxNjMuODMzWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBvcGFjaXR5PSIwLjYiIGQ9Ik0yNTYuMDU2IDE2My44MzNMMTY1LjU4MyAyMTUuNTY1TDI1Ni4wNTYgMjY3LjIzM1YxNjMuODMzWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMjU2LjA1NiA3Ni44NzVMMTY1LjU4MyAyMTUuNTk5TDI1Ni4wNTYgMTYzLjcyMlY3Ni44NzVaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIG9wYWNpdHk9IjAuNiIgZD0iTTI1Ni4wODMgMTYzLjcwNkwzNDYuNTYgMjE1LjU4NUwyNTYuMDgzIDc2Ljc5MTZWMTYzLjcwNloiIGZpbGw9IndoaXRlIj48L3BhdGg+PC9zdmc+Cgo=",
          coinGeckoId: "wrapped-steth",
          color: "#3AA3FF",
          decimals: 18,
        },
        WeatherXMethereum: {
          key: "WeatherXMethereum",
          symbol: "WXM",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xde654f497a563dd7a121c176a125dd2f11f13a83",
          },
          icon: "https://assets.coingecko.com/coins/images/38154/standard/weatherxm-network-logo.png?1716668976",
          coinGeckoId: "weatherxm-network",
          decimals: 18,
        },
        WeatherXMsolana: {
          key: "WeatherXMsolana",
          symbol: "WXM",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "wxmJYe17a2oGJZJ1wDe6ZyRKUKmrLj2pJsavEdTVhPP",
          },
          icon: "https://assets.coingecko.com/coins/images/38154/standard/weatherxm-network-logo.png?1716668976",
          coinGeckoId: "weatherxm-network",
          decimals: 9,
        },
        JitoSOLsolana: {
          key: "JitoSOLsolana",
          symbol: "JITOSOL",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
          },
          icon: "https://assets.coingecko.com/coins/images/28046/standard/JitoSOL-200.png?1696527060",
          coinGeckoId: "jito-staked-sol",
          decimals: 9,
        },
        JitoSOLarbitrum: {
          key: "JitoSOLarbitrum",
          symbol: "JITOSOL",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0x83e1d2310Ade410676B1733d16e89f91822FD5c3",
          },
          icon: "https://assets.coingecko.com/coins/images/28046/standard/JitoSOL-200.png?1696527060",
          coinGeckoId: "jito-staked-sol",
          decimals: 9,
        },
        Swissborgethereum: {
          key: "Swissborgethereum",
          symbol: "BORG",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x64d0f55Cd8C7133a9D7102b13987235F486F2224",
          },
          icon: "https://assets.coingecko.com/coins/images/2117/standard/YJUrRy7r_400x400.png?1696503083",
          coinGeckoId: "swissborg",
          decimals: 18,
        },
        Swissborgsolana: {
          key: "Swissborgsolana",
          symbol: "BORG",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "3dQTr7ror2QPKQ3GbBCokJUmjErGg8kTJzdnYjNfvi3Z",
          },
          icon: "https://assets.coingecko.com/coins/images/2117/standard/YJUrRy7r_400x400.png?1696503083",
          coinGeckoId: "swissborg",
          decimals: 9,
        },
        Agoraethereum: {
          key: "Agoraethereum",
          symbol: "AGA",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x87B46212e805A3998B7e8077E9019c90759Ea88C",
          },
          icon: "https://assets.coingecko.com/coins/images/38230/standard/agora-avatar-black.png?1716828738",
          coinGeckoId: "agorahub",
          decimals: 18,
        },
        Agorasolana: {
          key: "Agorasolana",
          symbol: "AGA",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "AGAxefyrPTi63FGL2ukJUTBtLJStDpiXMdtLRWvzambv",
          },
          icon: "https://assets.coingecko.com/coins/images/38230/standard/agora-avatar-black.png?1716828738",
          coinGeckoId: "agorahub",
          decimals: 9,
        },
        XBorgethereum: {
          key: "XBorgethereum",
          symbol: "XBG",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xEaE00D6F9B16Deb1BD584c7965e4c7d762f178a1",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "xborg",
          decimals: 18,
        },
        XBorgarbitrum: {
          key: "XBorgarbitrum",
          symbol: "XBG",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0x93FA0B88C0C78e45980Fa74cdd87469311b7B3E4",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "xborg",
          decimals: 18,
        },
        XBorgsolana: {
          key: "XBorgsolana",
          symbol: "XBG",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "XBGdqJ9P175hCC1LangCEyXWNeCPHaKWA17tymz2PrY",
          },
          icon: "https://bafybeiemq2qpk3fahebltwzbdsugrzhxuono3ugxa25imywc7mbfhwl2lm.ipfs.dweb.link/",
          coinGeckoId: "",
          decimals: 9,
        },
        Cheesearbitrum: {
          key: "Cheesearbitrum",
          symbol: "CHEESE",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0x05AEa20947A9A376eF50218633BB0a5A05d40A0C",
          },
          icon: "https://assets.coingecko.com/coins/images/37156/standard/cheese_icon_500x500.png?1713499473",
          coinGeckoId: "cheese-2",
          decimals: 18,
        },
        Cheesesolana: {
          key: "Cheesesolana",
          symbol: "CHEESE",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "AbrMJWfDVRZ2EWCQ1xSCpoVeVgZNpq1U2AoYG98oRXfn",
          },
          icon: "https://assets.coingecko.com/coins/images/37156/standard/cheese_icon_500x500.png?1713499473",
          coinGeckoId: "cheese-2",
          decimals: 6,
        },
        RenzoEthereum: {
          key: "RenzoEthereum",
          symbol: "REZ",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x3B50805453023a91a8bf641e279401a0b23FA6F9",
          },
          icon: "https://assets.coingecko.com/coins/images/37327/standard/renzo_200x200.png?1714025012",
          coinGeckoId: "renzo",
          decimals: 18,
        },
        RenzoSolana: {
          key: "RenzoSolana",
          symbol: "REZ",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "3DK98MXPz8TRuim7rfQnebSLpA7VSoc79Bgiee1m4Zw5",
          },
          icon: "https://assets.coingecko.com/coins/images/37327/standard/renzo_200x200.png?1714025012",
          coinGeckoId: "renzo",
          decimals: 9,
        },
        OP: {
          key: "OP",
          symbol: "OP",
          nativeChain: "Optimism",
          tokenId: {
            chain: "Optimism",
            address: "0x4200000000000000000000000000000000000042",
          },
          icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='optimism-logo-circle' width='122' height='122' viewBox='0 0 122 122' style='max-height: 100%25; max-width: 100%25;'%3E%3Ccircle id='Ellipse_11' data-name='Ellipse 11' cx='61' cy='61' r='61' fill='%23ff0420'%3E%3C/circle%3E%3Cpath id='Path_139' data-name='Path 139' d='M113.533,178.026a14.656,14.656,0,0,1-8.924-2.563,8.762,8.762,0,0,1-3.432-7.413,16.433,16.433,0,0,1,.229-2.471q.595-3.3,1.693-7.917,3.112-12.585,16.062-12.585a15.966,15.966,0,0,1,6.315,1.19,9.6,9.6,0,0,1,4.393,3.478,9.333,9.333,0,0,1,1.6,5.492,16.288,16.288,0,0,1-.229,2.425q-.687,4.073-1.647,7.917-1.6,6.269-5.537,9.381Q120.123,178.026,113.533,178.026Zm.641-6.59a6.5,6.5,0,0,0,4.348-1.51,8.424,8.424,0,0,0,2.608-4.622q1.053-4.3,1.6-7.505a10.5,10.5,0,0,0,.183-1.968q0-4.165-4.347-4.164a6.681,6.681,0,0,0-4.393,1.51,8.573,8.573,0,0,0-2.563,4.622q-.824,3.066-1.647,7.505a9.791,9.791,0,0,0-.183,1.922Q109.78,171.436,114.174,171.436Z' transform='translate(-70.332 -100.849)' fill='%23fff'%3E%3C/path%3E%3Cpath id='Path_140' data-name='Path 140' d='M205.3,178.612a.97.97,0,0,1-.778-.32,1.1,1.1,0,0,1-.137-.824l6.315-29.746a1.31,1.31,0,0,1,.5-.824,1.4,1.4,0,0,1,.87-.32h12.173a14.148,14.148,0,0,1,8.146,2.105,6.9,6.9,0,0,1,3.112,6.087,10.955,10.955,0,0,1-.275,2.38,12.39,12.39,0,0,1-4.622,7.78q-3.432,2.517-9.427,2.517H215l-2.105,10.022a1.311,1.311,0,0,1-.5.824,1.4,1.4,0,0,1-.869.32Zm16.2-17.482a5.451,5.451,0,0,0,3.341-1.052,4.942,4.942,0,0,0,1.922-3.02,8.022,8.022,0,0,0,.137-1.373,2.543,2.543,0,0,0-.778-2.014,3.836,3.836,0,0,0-2.654-.732h-5.491l-1.739,8.191Z' transform='translate(-142.055 -101.892)' fill='%23fff'%3E%3C/path%3E%3C/svg%3E",
          coinGeckoId: "optimism",
          decimals: 18,
        },
        ARB: {
          key: "ARB",
          symbol: "ARB",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
          },
          icon: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242",
          coinGeckoId: "arbitrum",
          decimals: 18,
        },
        Layer3Ethereum: {
          key: "Layer3Ethereum",
          symbol: "L3",
          displayName: "Layer3",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x88909D489678dD17aA6D9609F89B0419Bf78FD9a",
          },
          icon: "https://assets.coingecko.com/coins/images/37768/standard/Square.png?1722045128",
          coinGeckoId: "layer3",
          decimals: 18,
        },
        Layer3Base: {
          key: "Layer3Base",
          symbol: "L3",
          displayName: "Layer3",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0x46777C76dBbE40fABB2AAB99E33CE20058e76C59",
          },
          icon: "https://assets.coingecko.com/coins/images/37768/standard/Square.png?1722045128",
          coinGeckoId: "layer3",
          decimals: 18,
        },
        Layer3Solana: {
          key: "Layer3Solana",
          symbol: "L3",
          displayName: "Layer3",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "5k84VjAKoGPXa7ias1BNgKUrX7e61eMPWhZDqsiD4Bpe",
          },
          icon: "https://assets.coingecko.com/coins/images/37768/standard/Square.png?1722045128",
          coinGeckoId: "layer3",
          decimals: 9,
        },
        AUDIUS: {
          key: "AUDIUS",
          symbol: "AUDIO",
          displayName: "Audius",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998",
          },
          icon: "https://assets.coingecko.com/coins/images/12913/standard/AudiusCoinLogo_2x.png?1696512701",
          coinGeckoId: "audius",
          decimals: 18,
        },
        VaultCraftEthereum: {
          key: "VaultCraftEthereum",
          symbol: "VCX",
          displayName: "VaultCraft",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xce246eea10988c495b4a90a905ee9237a0f91543",
          },
          icon: "https://assets.coingecko.com/coins/images/33237/standard/VCX_Token_200x200.png?1701147660",
          coinGeckoId: "vaultcraft",
          decimals: 18,
        },
        VaultCraftArbitrum: {
          key: "VaultCraftArbitrum",
          symbol: "wVCX",
          displayName: "VaultCraft",
          nativeChain: "Arbitrum",
          tokenId: {
            chain: "Arbitrum",
            address: "0xFeae6470A79b7779888f4a64af315Ca997D6cF33",
          },
          icon: "https://assets.coingecko.com/coins/images/33237/standard/VCX_Token_200x200.png?1701147660",
          coinGeckoId: "vaultcraft",
          decimals: 18,
        },
        VaultCraftOptimism: {
          key: "VaultCraftOptimism",
          symbol: "wVCX",
          displayName: "VaultCraft",
          nativeChain: "Optimism",
          tokenId: {
            chain: "Optimism",
            address: "0x43Ad2CFDDA3CEFf40d832eB9bc33eC3FACE86829",
          },
          icon: "https://assets.coingecko.com/coins/images/33237/standard/VCX_Token_200x200.png?1701147660",
          coinGeckoId: "vaultcraft",
          decimals: 18,
        },
        VaultCraftBase: {
          key: "VaultCraftBase",
          symbol: "wVCX",
          displayName: "VaultCraft",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0x43Ad2CFDDA3CEFf40d832eB9bc33eC3FACE86829",
          },
          icon: "https://assets.coingecko.com/coins/images/33237/standard/VCX_Token_200x200.png?1701147660",
          coinGeckoId: "vaultcraft",
          decimals: 18,
        },
        VaultCraftAvalanche: {
          key: "VaultCraftAvalanche",
          symbol: "wVCX",
          displayName: "VaultCraft",
          nativeChain: "Avalanche",
          tokenId: {
            chain: "Avalanche",
            address: "0x58890c4d6268CA329C9Ff626dc4Da07c1977Deb4",
          },
          icon: "https://assets.coingecko.com/coins/images/33237/standard/VCX_Token_200x200.png?1701147660",
          coinGeckoId: "vaultcraft",
          decimals: 18,
        },
        pSTAKE: {
          key: "pSTAKE",
          symbol: "PSTAKE",
          displayName: "pSTAKE",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006",
          },
          icon: "https://assets.coingecko.com/coins/images/23931/standard/512_x_512_Dark.png?1721243699",
          coinGeckoId: "pstake-finance",
          decimals: 18,
        },
        USDSEthereum: {
          key: "USDSEthereum",
          symbol: "USDS",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
          },
          icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='USDS-Coin' version='1.1' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: url(%23radial-gradient); %7D .cls-1, .cls-2 %7B stroke-width: 0px; %7D .cls-2 %7B fill: %23fff; %7D %3C/style%3E%3CradialGradient id='radial-gradient' cx='976.2772395' cy='23.9735075' fx='976.2772395' fy='23.9735075' r='2.0690868' gradientTransform='translate(-18064.581412 757167.6887207) rotate(-90) scale(774.3790283)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffd232'/%3E%3Cstop offset='1' stop-color='%23ff6d6d'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg id='USDS-Coin-2'%3E%3Ccircle id='Element' class='cls-1' cx='500' cy='500' r='500'/%3E%3Cpath id='Element-2' class='cls-2' d='M308.7752075,631.4499512h-71.1536255c5.8073578,111.0870361,98.7437439,207.6535034,263.558075,207.6535034,164.0899963,0,268.643158-90.0327148,268.643158-206.2026367,0-220.7210693-333.2608948-208.3778076-333.2608948-336.1646118,0-35.5768127,26.8637085-77.6894531,89.3042297-77.6894531,69.7028198,0,151.7467651,54.4559021,157.5562134,124.1566467h70.427124c-7.2602539-112.5398407-116.8963623-190.9537048-256.2999573-190.9537048-144.4844666,0-253.3941803,84.2232666-253.3941803,203.2969055,0,227.2569885,333.26091,197.4875183,333.26091,337.6174622,0,43.5634766-26.8637085,79.8667603-94.387207,79.8667603-84.2232971,0-169.1729736-58.8104248-174.2539062-141.5808716h.000061ZM368.3120117,313.4359436c0,172.8010559,330.3572388,138.677124,330.3572388,323.0970154,0,55.1802368-36.3032837,103.8267212-79.8667603,116.1679077,15.2468872-14.5205078,26.8637085-46.4672241,26.8637085-76.9609985,0-170.6238403-331.0836487-147.3901978-331.0836487-322.370575,0-58.812439,37.7561035-106.0060425,84.9496765-120.5264893-18.1526489,21.7807007-31.2202454,50.0972595-31.2202454,80.5931396h.0000305Z'/%3E%3C/g%3E%3C/svg%3E",
          coinGeckoId: "usds",
          decimals: 18,
        },
        USDSSolana: {
          key: "USDSSolana",
          symbol: "USDS",
          nativeChain: "Solana",
          tokenId: {
            chain: "Solana",
            address: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
          },
          icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='USDS-Coin' version='1.1' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: url(%23radial-gradient); %7D .cls-1, .cls-2 %7B stroke-width: 0px; %7D .cls-2 %7B fill: %23fff; %7D %3C/style%3E%3CradialGradient id='radial-gradient' cx='976.2772395' cy='23.9735075' fx='976.2772395' fy='23.9735075' r='2.0690868' gradientTransform='translate(-18064.581412 757167.6887207) rotate(-90) scale(774.3790283)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffd232'/%3E%3Cstop offset='1' stop-color='%23ff6d6d'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg id='USDS-Coin-2'%3E%3Ccircle id='Element' class='cls-1' cx='500' cy='500' r='500'/%3E%3Cpath id='Element-2' class='cls-2' d='M308.7752075,631.4499512h-71.1536255c5.8073578,111.0870361,98.7437439,207.6535034,263.558075,207.6535034,164.0899963,0,268.643158-90.0327148,268.643158-206.2026367,0-220.7210693-333.2608948-208.3778076-333.2608948-336.1646118,0-35.5768127,26.8637085-77.6894531,89.3042297-77.6894531,69.7028198,0,151.7467651,54.4559021,157.5562134,124.1566467h70.427124c-7.2602539-112.5398407-116.8963623-190.9537048-256.2999573-190.9537048-144.4844666,0-253.3941803,84.2232666-253.3941803,203.2969055,0,227.2569885,333.26091,197.4875183,333.26091,337.6174622,0,43.5634766-26.8637085,79.8667603-94.387207,79.8667603-84.2232971,0-169.1729736-58.8104248-174.2539062-141.5808716h.000061ZM368.3120117,313.4359436c0,172.8010559,330.3572388,138.677124,330.3572388,323.0970154,0,55.1802368-36.3032837,103.8267212-79.8667603,116.1679077,15.2468872-14.5205078,26.8637085-46.4672241,26.8637085-76.9609985,0-170.6238403-331.0836487-147.3901978-331.0836487-322.370575,0-58.812439,37.7561035-106.0060425,84.9496765-120.5264893-18.1526489,21.7807007-31.2202454,50.0972595-31.2202454,80.5931396h.0000305Z'/%3E%3C/g%3E%3C/svg%3E",
          coinGeckoId: "usds",
          decimals: 6,
        },
        pxEth: {
          key: "pxEth",
          symbol: "PXETH",
          displayName: "Dinero Staked ETH",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x04C154b66CB340F3Ae24111CC767e0184Ed00Cc6",
          },
          icon: "https://assets.coingecko.com/coins/images/33608/large/pxETH-icon-transbg_72dpi.png?1702512024",
          coinGeckoId: "dinero-staked-eth",
          decimals: 18,
        },
        AvailEthereum: {
          key: "AvailEthereum",
          symbol: "AVAIL",
          displayName: "Avail",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8",
          },
          icon: "https://assets.coingecko.com/coins/images/37372/standard/avail-logo.png?1714145201",
          coinGeckoId: "avail",
          decimals: 18,
        },
        AvailBase: {
          key: "AvailBase",
          symbol: "AVAIL.W",
          displayName: "Avail",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0xd89d90d26B48940FA8F58385Fe84625d468E057a",
          },
          icon: "https://assets.coingecko.com/coins/images/37372/standard/avail-logo.png?1714145201",
          coinGeckoId: "avail",
          decimals: 18,
        },
        stAvailEthereum: {
          key: "stAvailEthereum",
          symbol: "STAVAIL",
          displayName: "Deq Staked AVAIL",
          nativeChain: "Ethereum",
          tokenId: {
            chain: "Ethereum",
            address: "0x3742f3Fcc56B2d46c7B8CA77c23be60Cd43Ca80a",
          },
          icon: "https://assets.coingecko.com/coins/images/51343/large/stAVAIL_200x200.png?1730824445",
          coinGeckoId: "staked-avail",
          decimals: 18,
        },
        stAvailBase: {
          key: "stAvailBase",
          symbol: "STAVAIL.W",
          displayName: "Deq Staked AVAIL",
          nativeChain: "Base",
          tokenId: {
            chain: "Base",
            address: "0x74cb668d23E6e54524e2E1e4d1c392F5fd611783",
          },
          icon: "https://assets.coingecko.com/coins/images/51343/large/stAVAIL_200x200.png?1730824445",
          coinGeckoId: "staked-avail",
          decimals: 18,
        },
      },
    }
  ),
};

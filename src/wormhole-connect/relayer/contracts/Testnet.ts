import { CHAIN_ID_AVAX, CHAIN_ID_BSC, CHAIN_ID_CELO, CHAIN_ID_ETH, CHAIN_ID_FANTOM, CHAIN_ID_MOONBEAM, CHAIN_ID_POLYGON, CHAIN_ID_SUI } from "@certusone/wormhole-sdk";

export const Contracts = {
    [CHAIN_ID_ETH]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_POLYGON]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_BSC]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_AVAX]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_FANTOM]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_CELO]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_MOONBEAM]: {
        address: '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b'
    },
    [CHAIN_ID_SUI]: {
        address: '0xb30040e5120f8cb853b691cb6d45981ae884b1d68521a9dc7c3ae881c0031923',
        packageId: '0x12eb7e64389d8f0e052d8bda10f46aab1dcb6efeec59decf1897708450171050',
        tokenBridgePackageId: '0x562760fc51d90d4ae1835bac3e91e0e6987d3497b06f066941d3e51f6e8d76d0'
    }
} as const;

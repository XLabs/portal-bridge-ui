import { CHAIN_ID_AVAX, CHAIN_ID_BSC, CHAIN_ID_CELO, CHAIN_ID_ETH, CHAIN_ID_FANTOM, CHAIN_ID_MOONBEAM, CHAIN_ID_POLYGON, CHAIN_ID_SUI } from "@certusone/wormhole-sdk";

export const Contracts  = {
    [CHAIN_ID_ETH]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_POLYGON]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_BSC]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_AVAX]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_FANTOM]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_CELO]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_MOONBEAM]: {
        address: '0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca'
    },
    [CHAIN_ID_SUI]: {
        address: '0x57f4e0ba41a7045e29d435bc66cc4175f381eb700e6ec16d4fdfe92e5a4dff9f',
        packageId: '0x38035f4c1e1772d43a3535535ea5b29c1c3ab2c0026d4ad639969831bd1d174d',
        tokenBridgePackageId: '0x26efee2b51c911237888e5dc6702868abca3c7ac12c53f76ef8eba0697695e3d'
    }
} as const;
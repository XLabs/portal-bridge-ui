import { ENV } from "@env";
import isRouteSupported from "./isRouteSupported";
jest.mock("@env", () => ({
    ...require('../env/token-bridge.mainnet')
}));

const Layer3Ethereum = ENV.wormholeConnectConfig?.tokensConfig?.Layer3Ethereum.tokenId?.address;
const Layer3Solana = ENV.wormholeConnectConfig?.tokensConfig?.Layer3Solana.tokenId?.address;

describe('isRouteSupported', () => {
    // Disable manual NTT for Lido wstETH
    it('is wstETH manual NTT disabled fo sourceToken 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', async () => {
        const td = {
            route: "ManualNtt",
            fromToken:  {
                tokenId: {
                    address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
                }
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });

    it('is wstETH manual NTT disabled fo sourceToken 0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C', async () => {
        const td = {
            route: "ManualNtt",
            fromToken: {
                tokenId: ENV.wormholeConnectConfig?.tokensConfig?.wstETHBsc.tokenId
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });

    it(`is Layer3 AutomaticTokenBridge is disabled for sourceToken ${Layer3Ethereum}`, async () => {
        const td = {
            route: "AutomaticTokenBridge",
            fromToken: {
                tokenId: {
                    address: Layer3Ethereum
                }
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });

    it(`is Layer3 ManualTokenBridge is disabled for sourceToken ${Layer3Ethereum}`, async () => {
        const td = {
            route: "ManualTokenBridge",
            fromToken: {
                tokenId: {
                    address: Layer3Ethereum
                }
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });

    it(`is Layer3 AutomaticTokenBridge is disabled for sourceToken ${Layer3Solana}`, async () => {
        const td = {
            route: "AutomaticTokenBridge",
            fromToken: {
                tokenId: {
                    address: Layer3Solana
                }
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });

    it(`is Layer3 ManualTokenBridge is disabled for sourceToken ${Layer3Solana}`, async () => {
        const td = {
            route: "ManualTokenBridge",
            fromToken: {
                tokenId: {
                    address: Layer3Solana
                }
            }
        } as any;
        expect(await isRouteSupported(td)).toBe(false);
    });
});
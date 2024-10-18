import { ENV } from "@env";
import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
const Layer3Ethereum = ENV.wormholeConnectConfig?.tokensConfig?.Layer3Ethereum.tokenId?.address;
const Layer3Solana = ENV.wormholeConnectConfig?.tokensConfig?.Layer3Solana.tokenId?.address;

export type TransferDetails = Parameters<NonNullable<WormholeConnectConfig["isRouteSupportedHandler"]>>[0]

/**
 * Check if the td involve a token in the list of tokens
 * 
 * @param td transfer details to check against
 * @param tokens list of token address to check against
 * @returns true if the token is in the list of tokens
 */
const isFromToken = (td: TransferDetails, ...tokens: string[]) => td.fromToken.tokenId !== 'native' && tokens.includes(td.fromToken.tokenId.address);

/**
 * Check if a route is in the list of routes
 * 
 * @param td transfer details to check against
 * @param routes list of routes to disable
 * @returns true it the route is in the list of routes
 */
const isRoute = (td: TransferDetails, ...routes: string[]) => routes.includes(td.route);

export default async function isRouteSupported(td: TransferDetails): Promise<boolean> {
    // Disable manual NTT for Lido wstETHƒ
    if (isRoute(td, "ManualNtt") && isFromToken(td, "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C")) {
        return false;
    }
    if (isRoute(td, "ManualTokenBridge", "AutomaticTokenBridge") && isFromToken(td, Layer3Ethereum!, Layer3Solana!)) {
        console.info(`Route ${td.route} is disabled for token ${(td.fromToken.tokenId as any).address}`);
        return false;
    }
    return true;
  }

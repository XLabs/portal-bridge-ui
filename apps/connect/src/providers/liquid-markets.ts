import { ChainId, toChainId } from "@certusone/wormhole-sdk";
import { ChainName } from "@wormhole-foundation/wormhole-connect";
import { createContext, useContext } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
let topCorridors: any;
export interface Corridor {
  fromChain: ChainName;
  toChain: ChainName;
  fromToken: string;
  toToken: string;
}
export interface ExtendedTransferDetails extends TransferDetails {
  fromWalletAddress: string;
  toWalletAddress: string;
}

export interface ValidateTransferResult {
  isValid: boolean;
  error?: string;
}

export type ValidateTransferHandler = (
  transferDetails: ExtendedTransferDetails
) => Promise<ValidateTransferResult>;

export enum WarningLiquidMarkets {
  NO_WARNING,
  MANUALLY_WARNED_CORRIDOR = "Manually Warned Corridor",
  RARE_CORRIDOR = "Rare Corridor",
  NEW_CORRIDOR = "New Corridor",
}
export interface ValidateTransferResult {
  isValid: boolean;
  error?: string;
}

export type LiquidMarketsWarningContextType = {
  warningType: WarningLiquidMarkets;
  corridor?: Corridor;
};
export const warningType = WarningLiquidMarkets.NO_WARNING;
export const LiquidMarketsWarningContext =
  createContext<LiquidMarketsWarningContextType | null>(null);

export const useLiquidMarketsWarning = () => {
  const context = useContext(LiquidMarketsWarningContext);
  if (context === null) {
    throw new Error(
      "useOpenTelemetry must be used within a OpenTelemetryProvider"
    );
  }
  return context;
};

/*function parse(banner: Record<string, string>): Corridor {
  const fromChain = banner.fromChain;
  const toChain = banner.toChain;
  const fromToken = banner.fromToken;
  const toToken = banner.toToken;
  return {
    fromChain,
    toChain,
    fromToken,
    toToken
  };
};

async function fetchCorridors(
  location: string = "/data/manually-warned-corridor.json"
): Promise<Corridor[]> {
  const response = await fetch(location);
  if (response.status !== 200) {
    return [];
  } else {
    const json = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.map((banner: Record<string, any>) => parse(banner));
  }
}*/

export interface TokenDetails {
  symbol: string;
  tokenId:
    | {
        address: string;
        chain: string;
      }
    | "native";
}

export interface TransferDetails {
  route: string;
  fromToken: TokenDetails;
  toToken: TokenDetails;
  fromChain: ChainName | ChainId;
  toChain: ChainName | ChainId;
}
export interface ExtendedTransferDetails extends TransferDetails {
  fromWalletAddress: string;
  toWalletAddress: string;
}
// let dexPools: any;
export const validateTransfer = async (
  e: ExtendedTransferDetails
): Promise<LiquidMarketsWarningContextType> => {
  console.log("transfer.initiate", e);

  // Manually warned corridor
  /*const warnedCorridors = await fetchCorridors();
    warnedCorridors.forEach((corridor) => {
      if (e.fromChain === corridor.fromChain && e.toChain === corridor.toChain && e.toToken.tokenId === corridor.toToken) {
        return { warningType: WarningLiquidMarkets.MANUALLY_WARNED_CORRIDOR, corridor };
      }
    });*/

  if (!topCorridors) {
    topCorridors = await (
      await fetch("https://api.staging.wormscan.io/api/v1/top-100-corridors")
    ).json();
  }
  const fromChainId = toChainId(e.fromChain);
  const receiverChainId = toChainId(e.toChain);

  const isTopCorridor = topCorridors?.corridors.find(
    (corridor: {
      emitter_chain: number;
      token_chain: number;
      token_address: string | { address: string; chain: string };
    }) =>
      fromChainId === corridor.emitter_chain &&
      receiverChainId === corridor.token_chain &&
      e.toToken.tokenId === corridor.token_address
  );
  if (isTopCorridor) {
    return { warningType: WarningLiquidMarkets.NO_WARNING };
  }

  // Rare corridor
  /*if (!dexPools) {
      // TODO translate symbol to chain name key like: ethereum -> eth  or bsc -> bsc
      // TODO change to actual API
      dexPools = await (await fetch(`https://arkham-api?chain=${e.toChain}&address=${e.toToken.tokenId}` )).json();
    }
    if (dexPools?.pools?.length > 0) {
      return { warningType: WarningLiquidMarkets.RARE_CORRIDOR,
        corridor: {
          fromChain: e.fromChain,
          toChain: e.toChain,
          fromToken: typeof e.fromToken.tokenId === 'string' ? e.fromToken.tokenId : e.fromToken.tokenId.address,
          toToken: typeof e.toToken.tokenId === 'string' ? e.toToken.tokenId : e.toToken.tokenId.address
        }
      }
    }*/
  // Manually allowed corridor
  // if (https://api.staging.wormscan.io/api/v1/top-100-corridors) {
  // return;
  // }

  return {
    warningType: WarningLiquidMarkets.MANUALLY_WARNED_CORRIDOR,
    corridor: {
      fromChain: e.fromChain,
      toChain: e.toChain,
      fromToken:
        typeof e.fromToken.tokenId === "string"
          ? e.fromToken.tokenId
          : e.fromToken.tokenId.address,
      toToken:
        typeof e.toToken.tokenId === "string"
          ? e.toToken.tokenId
          : e.toToken.tokenId.address,
    },
  };
};

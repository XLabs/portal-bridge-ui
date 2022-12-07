import { ChainId, CHAIN_ID_TERRA } from "@certusone/wormhole-sdk";
import { CHAIN_ID_AURORA } from "@certusone/wormhole-sdk";

export type DisableTransfers = boolean | "to" | "from";

export interface WarningMessage {
  text: string;
  link?: {
    url: string;
    text: string;
  };
}

export interface ChainConfig {
  disableTransfers?: DisableTransfers;
  warningMessage?: WarningMessage;
}

export type ChainConfigMap = {
  [key in ChainId]?: ChainConfig;
};

export const CHAIN_CONFIG_MAP: ChainConfigMap = {
  [CHAIN_ID_AURORA]: {
    disableTransfers: true,
    warningMessage: {
      text: "As a precautionary measure, Wormhole Network and Portal have paused Aurora support temporarily.",
    },
  } as ChainConfig,
  [CHAIN_ID_TERRA]: {
    disableTransfers: "from",
    warningMessage: {
      text: "Transfers from Terra Classic to other chains are currently unavailable due to a network software upgrade. Transfers from other chains to Terra Classic are unaffected.",
    },
  },
};

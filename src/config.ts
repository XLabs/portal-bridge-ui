import { ChainId } from "@certusone/wormhole-sdk/lib/esm/utils/consts";
import { CHAIN_ID_AURORA } from "@certusone/wormhole-sdk/lib/esm/utils/consts";

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
};

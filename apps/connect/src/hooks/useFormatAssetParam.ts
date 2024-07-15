import { ENV } from "@env";
import { MAINNET, TESTNET } from "@wormhole-foundation/wormhole-connect";
import { useMemo } from "react";

const tokensList =
  ENV.wormholeConnectConfig.env === "mainnet" ? MAINNET.tokens : TESTNET.tokens;
function getFormatedAsset(asset: string | null): string | null {
  const allTokens = {
    ...tokensList,
    ...ENV.wormholeConnectConfig?.tokensConfig,
  };
  if (allTokens && asset) {
    const tokenParam = Object.values(allTokens).find(
      (config) => config?.tokenId?.address === asset || config?.key === asset
    );
    if (tokenParam) {
      return tokenParam.key;
    }
  }
  return null;
}

export function useFormatAssetParam(asset: string | null) {
  const formatedAsset = useMemo(() => getFormatedAsset(asset), [asset]);
  return formatedAsset;
}

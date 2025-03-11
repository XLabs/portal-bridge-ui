import { ENV } from "@env";
import { MAINNET, TESTNET } from "@xlabs/wormhole-connect";
import { useMemo } from "react";

const tokensList =
  ENV.wormholeConnectConfig.network === "Mainnet"
    ? MAINNET.tokens
    : TESTNET.tokens;
function getFormatedAsset(asset: string | null): string | null {
  const allTokens = [
    ...tokensList,
    ...Object.values(ENV.wormholeConnectConfig?.tokensConfig || {}),
  ];
  if (allTokens && asset) {
    const tokenParam = allTokens.find((config) =>
      [
        config?.tokenId?.address?.toLowerCase?.(),
        config?.symbol?.toLowerCase?.(),
      ].includes(asset.toLowerCase())
    );
    if (tokenParam) {
      return tokenParam.symbol;
    }
  }
  return null;
}

export function useFormatAssetParam(asset: string | null) {
  const formatedAsset = useMemo(() => getFormatedAsset(asset), [asset]);
  return formatedAsset;
}

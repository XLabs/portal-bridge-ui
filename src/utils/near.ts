import { Account } from "near-api-js";
import { AlgoMetadata } from "../hooks/useAlgoMetadata";

export const fetchSingleMetadata = async (
  address: string,
  account: Account
): Promise<AlgoMetadata> => {
  const assetInfo = await account.viewFunction(address, "ft_metadata");
  return {
    tokenName: assetInfo.name,
    symbol: assetInfo.symbol,
    decimals: assetInfo.decimals,
  };
};

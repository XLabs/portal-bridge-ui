import { Chain, toChainId } from "@wormhole-foundation/sdk";
import { isCosmWasmChain, isEVMChain } from "../utils/constants";
import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

export type ExtendedTransferDetails = Parameters<
  NonNullable<WormholeConnectConfig["validateTransferHandler"]>
>[0];
export interface SanctionResponse {
  addressRiskIndicators: { categoryRiskScoreLevel: number; riskType: string }[];
  entities: { riskScoreLevel: number }[];
}

export const TRM_URL =
  "https://hjukqn406c.execute-api.us-east-2.amazonaws.com/addresses";
export const ACCOUNT_ID = "PortalBridge";
export const RISK_LEVEL_SANCTION: number = 10;
export const RISK_ADDRESS_INDICATOR_TYPE = "OWNERSHIP";

// TRM screening chain names map with wormhole chain ids
// https://documentation.trmlabs.com/tag/Supported-Blockchain-List
export const getTrmChainName = (chain: Chain) => {
  const id = toChainId(chain);
  const trmChainNames: any = {
    [toChainId("Algorand")]: "algorand",
    [toChainId("Arbitrum")]: "arbitrum",
    [toChainId("Avalanche")]: "avalanche_c_chain",
    [toChainId("Bsc")]: "binance_smart_chain",
    [toChainId("Btc")]: "bitcoin",
    [toChainId("Celo")]: "celo",
    [toChainId("Klaytn")]: "klaytn",
    [toChainId("Optimism")]: "optimism",
    [toChainId("Polygon")]: "polygon",
    [toChainId("Solana")]: "solana",
  };

  if (trmChainNames[id]) return trmChainNames[id];
  if (isCosmWasmChain(chain)) return "cosmos";
  // TO DO: Add support for other evm chains with the new sdk
  if (isEVMChain(chain) || chain === "Worldchain") return "ethereum";

  return "";
};
const isSanctioned = async ({
  chain,
  address,
}: {
  chain: string;
  address: string;
}) => {
  try {
    const [response]: SanctionResponse[] = await fetch(TRM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ address, chain, accountExternalId: ACCOUNT_ID }]),
    }).then((r) => r.json());

    return !!(
      response?.addressRiskIndicators?.some(
        (risk) =>
          risk?.riskType === RISK_ADDRESS_INDICATOR_TYPE &&
          risk?.categoryRiskScoreLevel >= RISK_LEVEL_SANCTION
      ) ||
      response?.entities?.some(
        (entity) => entity?.riskScoreLevel >= RISK_LEVEL_SANCTION
      )
    );
  } catch (error) {
    console.error("Error validating transfer", { chain, address, error });
    return false;
  }
};

export const isSanctionedAddress = async (
  transferDetails: ExtendedTransferDetails
) => {
  const [isOriginSanctioned, isTargetSanctioned, isTargetSanctionedEth] =
    await Promise.all([
      isSanctioned({
        chain: getTrmChainName(transferDetails.fromChain as any),
        address: transferDetails.fromWalletAddress,
      }),
      isSanctioned({
        chain: getTrmChainName(transferDetails.toChain as any),
        address: transferDetails.toWalletAddress,
      }),
      ...(transferDetails.toChain !== "Ethereum" &&
      (isEVMChain(transferDetails.toChain as any) ||
        transferDetails.toChain === "Worldchain")
        ? [
            isSanctioned({
              chain: "ethereum",
              address: transferDetails.toWalletAddress,
            }),
          ]
        : []),
    ]);

  return isOriginSanctioned || isTargetSanctioned || isTargetSanctionedEth;
};
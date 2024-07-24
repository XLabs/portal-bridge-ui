import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

export interface SanctionResponse {
  addressRiskIndicators: { categoryRiskScoreLevel: number; riskType: string }[];
  entities: { riskScoreLevel: number }[];
}

export const TRM_URL =
"https://hjukqn406c.execute-api.us-east-2.amazonaws.com/addresses";
export const ACCOUNT_ID = "PortalBridge";
export const RISK_LEVEL_SANCTION: number = 10;
export const RISK_ADDRESS_INDICATOR_TYPE = "OWNERSHIP";

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

export const validateTransferHandler: NonNullable<
  WormholeConnectConfig["validateTransferHandler"]
> = async (transferDetails) => {
  const [isOriginSanctioned, isTargetSanctioned] = await Promise.all([
    isSanctioned({
      chain: transferDetails.fromChain,
      address: transferDetails.fromWalletAddress,
    }),
    isSanctioned({
      chain: transferDetails.toChain,
      address: transferDetails.toWalletAddress,
    }),
  ]);

  return { isValid: !isOriginSanctioned && !isTargetSanctioned };
};

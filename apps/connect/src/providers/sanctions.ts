import {
  CHAIN_ID_ALGORAND,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_BTC,
  CHAIN_ID_CELO,
  CHAIN_ID_OPTIMISM,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_KLAYTN,
  isCosmWasmChain,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { Chain, toChainId } from "@wormhole-foundation/sdk";
import { toChainNameFormat } from "../utils/transferVerification";
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
    [CHAIN_ID_ALGORAND]: "algorand",
    [CHAIN_ID_ARBITRUM]: "arbitrum",
    [CHAIN_ID_AVAX]: "avalanche_c_chain",
    [CHAIN_ID_BSC]: "binance_smart_chain",
    [CHAIN_ID_BTC]: "bitcoin",
    [CHAIN_ID_CELO]: "celo",
    [CHAIN_ID_KLAYTN]: "klaytn",
    [CHAIN_ID_OPTIMISM]: "optimism",
    [CHAIN_ID_POLYGON]: "polygon",
    [CHAIN_ID_SOLANA]: "solana",
  };

  if (trmChainNames[id]) return trmChainNames[id];
  if (isCosmWasmChain(toChainNameFormat(chain))) return "cosmos";
  if (isEVMChain(toChainNameFormat(chain))) return "ethereum";

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
        chain: getTrmChainName(transferDetails.fromChain),
        address: transferDetails.fromWalletAddress,
      }),
      isSanctioned({
        chain: getTrmChainName(transferDetails.toChain),
        address: transferDetails.toWalletAddress,
      }),
      ...(transferDetails.toChain !== "Ethereum" &&
      isEVMChain(toChainNameFormat(transferDetails.toChain))
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

import { ChainId } from "@certusone/wormhole-sdk";
import { Cluster, getTrmChainName } from "./consts";

interface ISanctionResponse {
  accountExternalId: string;
  address: string;
  addressRiskIndicators: {
    category: string;
    categoryRiskScoreLevel: number;
    riskType: string;
  }[];
  entities: {
    category: string;
    riskScoreLevel: number;
    entity: string;
  }[];
  trmAppUrl: string;
}

export const getIsSanctioned = async (
  chainId: ChainId,
  CLUSTER: Cluster,
  addr?: string
) => {
  const trmChain = getTrmChainName(chainId);

  if (addr && trmChain && CLUSTER === "mainnet") {
    const resp = await fetch("https://sanctioned-address.glitch.me/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          // address: "149w62rY42aZBox8fGcmqNsXUzSStKeq8C", // sanctioned address example
          // chain: "bitcoin", // sanctioned address example
          address: addr,
          chain: trmChain,
          accountExternalId: "PortalBridge",
        },
      ]),
    });

    const data = await resp.json();
    const screeningData = data[0] as ISanctionResponse;

    let isSanctioned = false;

    screeningData.addressRiskIndicators.forEach((risk) => {
      if (risk.categoryRiskScoreLevel >= 10) {
        isSanctioned = true;
      }
    });

    screeningData.entities.forEach((entity) => {
      if (entity.riskScoreLevel >= 10) {
        isSanctioned = true;
      }
    });

    return isSanctioned;
  }
  return false;
};

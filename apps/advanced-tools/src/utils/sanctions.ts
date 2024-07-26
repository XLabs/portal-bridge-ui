import { ChainId } from "@certusone/wormhole-sdk";
import { Cluster, getTrmChainName } from "./consts";

interface SanctionResponse {
  accountExternalId: string;
  address: string;
  addressRiskIndicators: {
    category: string;
    categoryRiskScoreLevel: number;
    riskType: "OWNERSHIP" | "COUNTERPARTY" | "INDIRECT";
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
  if (!addr) return;

  const trmChain = getTrmChainName(chainId);
  const localStorageKey = `${trmChain}-${addr}-1`;
  const rightNow = new Date();

  let storedResult = "";
  const storedValue = localStorage.getItem(localStorageKey);

  if (storedValue) {
    const stored = JSON.parse(storedValue);

    if (new Date(stored.expires) < rightNow) {
      localStorage.removeItem(localStorageKey);
    } else {
      storedResult = stored.isSanctioned;
    }
  }

  if (storedResult !== "") return storedResult;

  if (trmChain && CLUSTER === "mainnet") {
    let isSanctioned = false;

    const resp = await fetch(
      "https://hjukqn406c.execute-api.us-east-2.amazonaws.com/addresses",
      {
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
      }
    );

    const data = await resp.json();
    const screeningData = data[0] as SanctionResponse;

    screeningData.addressRiskIndicators.forEach((risk) => {
      if (risk.categoryRiskScoreLevel >= 10 && risk.riskType === "OWNERSHIP") {
        isSanctioned = true;
      }
    });

    screeningData.entities.forEach((entity) => {
      if (entity.riskScoreLevel >= 10) {
        isSanctioned = true;
      }
    });

    // store result on localStorage for one week
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        expires: new Date(rightNow.getTime() + 7 * 24 * 60 * 60 * 1000),
        isSanctioned: isSanctioned,
      })
    );

    return isSanctioned;
  }
  return false;
};

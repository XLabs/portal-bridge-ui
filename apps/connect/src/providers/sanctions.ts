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
  const uppercaseByBitWallets = BYBIT_WALLETS.map((wallet) =>
    wallet.toUpperCase()
  );
  const isBybitWallet =
    uppercaseByBitWallets.includes(
      transferDetails.fromWalletAddress.toUpperCase()
    ) ||
    uppercaseByBitWallets.includes(
      transferDetails.toWalletAddress.toUpperCase()
    );

  if (isBybitWallet) {
    return true;
  }

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
      (isEVMChain(transferDetails.toChain) ||
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

const BYBIT_WALLETS = [
  "0x47666Fab8bd0Ac7003bce3f5C3585383F09486E2",
  "0xA4B2Fd68593B6F34E51cB9eDB66E71c1B4Ab449e",
  "0xdD90071D52F20e85c89802e5Dc1eC0A7B6475f92",
  "0x36ed3C0213565530C35115d93A80F9c04d94E4Cb",
  "0x1542368a03ad1f03d96D51B414f4738961Cf4443",
  "0x1eB27f136BFe7947f80d6ceE3Cf0bfDf92b45e57",
  "0xFc926659Dd8808f6e3e0a8d61B20B871F3Fa6465",
  "0xCd1a4A457cA8b0931c3BF81Df3CFa227ADBdb6E9",
  "0x0e8C1E2881F35Ef20343264862A242FB749d6b35",
  "0x83Ef5E80faD88288F770152875Ab0bb16641a09E",
  "0x6d46bd3AfF100f23C194e5312f93507978a6DC91",
  "0xBC3e5e8C10897a81b63933348f53f2e052F89a7E",
  "0x23Db729908137cb60852f2936D2b5c6De0e1c887",
  "0xbdE2Cc5375fa9E0383309A2cA31213f2D6cabcbd",
  "0x30a822CDD2782D2B2A12a08526452e885978FA1D",
  "0x959c4CA19c4532C97A657D82d97acCBAb70e6fb4",
  "0xfa3FcCCB897079fD83bfBA690E7D47Eb402d6c49",
  "0x51E9d833Ecae4E8D9D8Be17300AEE6D3398C135D",
  "0x5Af75eAB6BEC227657fA3E749a8BFd55f02e4b1D",
  "0x52207Ec7B1b43AA5DB116931a904371ae2C1619e",
  "0x4C198B3B5F3a4b1Aa706daC73D826c2B795ccd67",
  "0x40e98FeEEbaD7Ddb0F0534Ccaa617427eA10187e",
  "0xB72334cB9D0b614D30C4c60e2bd12fF5Ed03c305",
  "0x1bb0970508316DC735329752a4581E0a4bAbc6B4",
  "0x2290937A4498C96eFfb87b8371a33D108F8D433f",
  "0xD3C611AeD139107DEC2294032da3913BC26507fb",
  "0x9eF42873Ae015AA3da0c4354AeF94a18D2B3407b",
  "0xf0a16603289eAF35F64077Ba3681af41194a1c09",
  "0xb172F7e99452446f18FF49A71bfEeCf0873003b4",
  "0x09278b36863bE4cCd3d0c22d643E8062D7a11377",
  "0x684d4b58Dc32af786BF6D572A792fF7A883428B9",
  "0x660BfcEa3A5FAF823e8f8bF57dd558db034dea1d",
  "0xE9bc552fdFa54b30296d95F147e3e0280FF7f7e6",
  "0x3A21F4E6Bbe527D347ca7c157F4233c935779847",
  "0x83c7678492D623fb98834F0fbcb2E7b7f5Af8950",
  "0xBCA02B395747D62626a65016F2e64A20bd254A39",
  "0x96244D83DC15d36847C35209bBDc5bdDE9bEc3D8",
  "0xB4a862A81aBB2f952FcA4C6f5510962e18c7f1A2",
  "0xCd7eC020121Ead6f99855cbB972dF502dB5bC63a",
  "0x140c9Ab92347734641b1A7c124ffDeE58c20C3E3",
  "0x8c7235e1A6EeF91b980D0FcA083347FBb7EE1806",
  "0x9271EDdda0F0f2bB7b1A0c712bdF8dbD0A38d1Ab",
  "0xe69753Ddfbedbd249E703EB374452E78dae1ae49",
  "0x723a7084028421994d4a7829108D63aB44658315",
  "0xA5A023E052243b7cce34Cbd4ba20180e8Dea6Ad6",
  "0xEB0bAA3A556586192590CAD296b1e48dF62a8549",
  "0x55CCa2f5eB07907696afe4b9Db5102bcE5feB734",
  "0xf03AfB1c6A11A7E370920ad42e6eE735dBedF0b1",
  "0x21032176B43d9f7E9410fB37290a78f4fEd6044C",
  "0xD5b58Cf7813c1eDC412367b97876bD400ea5c489",
  "0x1512fcb09463A61862B73ec09B9b354aF1790268",
  "0xF302572594a68aA8F951faE64ED3aE7DA41c72Be",
  "0xaf620e6d32b1c67f3396ef5d2f7d7642dc2e6ce9",
];

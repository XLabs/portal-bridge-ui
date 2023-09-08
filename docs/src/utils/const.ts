export const CHAIN_ID_SOLANA = 1;
export const CHAIN_ID_ETH = 2;
export const CHAIN_ID_TERRA = 3;
export const CHAIN_ID_BSC = 4;
export const CHAIN_ID_POLYGON = 5;
export const CHAIN_ID_AVAX = 6;
export const CHAIN_ID_OASIS = 7;
export const CHAIN_ID_ALGORAND = 8;
export const CHAIN_ID_AURORA = 9;
export const CHAIN_ID_FANTOM = 10;
export const CHAIN_ID_KARURA = 11;
export const CHAIN_ID_ACALA = 12;
export const CHAIN_ID_KLAYTN = 13;
export const CHAIN_ID_CELO = 14;
export const CHAIN_ID_NEAR = 15;
export const CHAIN_ID_MOONBEAM = 16;
export const CHAIN_ID_NEON = 17;
export const CHAIN_ID_TERRA2 = 18;
export const CHAIN_ID_INJECTIVE = 19;
export const CHAIN_ID_OSMOSIS = 20;
export const CHAIN_ID_SUI = 21;
export const CHAIN_ID_APTOS = 22;
export const CHAIN_ID_ARBITRUM = 23;
export const CHAIN_ID_OPTIMISM = 24;
export const CHAIN_ID_GNOSIS = 25;
export const CHAIN_ID_PYTHNET = 26;
export const CHAIN_ID_XPLA = 28;
export const CHAIN_ID_BTC = 29;
export const CHAIN_ID_BASE = 30;
export const CHAIN_ID_SEI = 32;
export const CHAIN_ID_WORMCHAIN = 3104;
export const CHAIN_ID_SEPOLIA = 10002;

export const CHAIN_ID_TO_NAME: Record<number, string> = {
  [CHAIN_ID_SOLANA]: "Solana",
  [CHAIN_ID_ETH]: "Ethereum",
  [CHAIN_ID_TERRA]: "Terra",
  [CHAIN_ID_BSC]: "Binance Smart Chain",
  [CHAIN_ID_POLYGON]: "Polygon",
  [CHAIN_ID_AVAX]: "Avalanche",
  [CHAIN_ID_OASIS]: "Oasis",
  [CHAIN_ID_ALGORAND]: "Algorand",
  [CHAIN_ID_AURORA]: "Aurora",
  [CHAIN_ID_FANTOM]: "Fantom",
  [CHAIN_ID_KARURA]: "Karura",
  [CHAIN_ID_ACALA]: "Acala",
  [CHAIN_ID_KLAYTN]: "Klaytn",
  [CHAIN_ID_CELO]: "Celo",
  [CHAIN_ID_NEAR]: "Near",
  [CHAIN_ID_MOONBEAM]: "Moonbeam",
  [CHAIN_ID_NEON]: "Neon",
  [CHAIN_ID_TERRA2]: "Terra2",
  [CHAIN_ID_INJECTIVE]: "Injective",
  [CHAIN_ID_OSMOSIS]: "Osmosis",
  [CHAIN_ID_SUI]: "Sui",
  [CHAIN_ID_APTOS]: "Aptos",
  [CHAIN_ID_ARBITRUM]: "Arbitrum",
  [CHAIN_ID_OPTIMISM]: "Optimism",
  [CHAIN_ID_GNOSIS]: "Gnosis",
  [CHAIN_ID_PYTHNET]: "Pyth Network",
  [CHAIN_ID_XPLA]: "XPLA",
  [CHAIN_ID_BTC]: "Bitcoin",
  [CHAIN_ID_BASE]: "Base",
  [CHAIN_ID_SEI]: "Sei",
  [CHAIN_ID_WORMCHAIN]: "Wormchain",
  [CHAIN_ID_SEPOLIA]: "Sepolia",
};

export const CHAIN_ID_TO_SYMBOL: Record<number, string> = {
  [CHAIN_ID_SOLANA]: "SOL",
  [CHAIN_ID_ETH]: "ETH",
  [CHAIN_ID_TERRA]: "LUNA",
  [CHAIN_ID_BSC]: "BNB",
  [CHAIN_ID_POLYGON]: "MATIC",
  [CHAIN_ID_AVAX]: "AVAX",
  [CHAIN_ID_OASIS]: "ROSE",
  [CHAIN_ID_ALGORAND]: "ALGO",
  [CHAIN_ID_AURORA]: "AURORA",
  [CHAIN_ID_FANTOM]: "FTM",
  [CHAIN_ID_KARURA]: "KAR",
  [CHAIN_ID_ACALA]: "ACA",
  [CHAIN_ID_KLAYTN]: "KLAY",
  [CHAIN_ID_CELO]: "CELO",
  [CHAIN_ID_NEAR]: "NEAR",
  [CHAIN_ID_MOONBEAM]: "GLMR",
  [CHAIN_ID_NEON]: "NEON",
  [CHAIN_ID_TERRA2]: "LUNA",
  [CHAIN_ID_INJECTIVE]: "INJ",
  [CHAIN_ID_OSMOSIS]: "OSMO",
  [CHAIN_ID_SUI]: "SUI",
  [CHAIN_ID_APTOS]: "APTOS",
  [CHAIN_ID_ARBITRUM]: "ARB",
  [CHAIN_ID_OPTIMISM]: "OPT",
  [CHAIN_ID_GNOSIS]: "GNO",
  [CHAIN_ID_PYTHNET]: "PYTH",
  [CHAIN_ID_XPLA]: "XPLA",
  [CHAIN_ID_BTC]: "BTC",
  [CHAIN_ID_BASE]: "BASE",
  [CHAIN_ID_SEI]: "SEI",
  [CHAIN_ID_WORMCHAIN]: "WORM",
  [CHAIN_ID_SEPOLIA]: "SEPOLIA",
};

export const CHAIN_ID_TO_CSS_ID: Record<number, string> = {
  [CHAIN_ID_SOLANA]: "target-chain-sol",
  [CHAIN_ID_ETH]: "target-chain-eth",
  [CHAIN_ID_TERRA]: "target-chain-terra",
  [CHAIN_ID_BSC]: "target-chain-bsc",
  [CHAIN_ID_POLYGON]: "target-chain-polygon",
  [CHAIN_ID_AVAX]: "target-chain-avax",
  [CHAIN_ID_OASIS]: "target-chain-oasis",
  [CHAIN_ID_ALGORAND]: "target-chain-algorand",
  [CHAIN_ID_AURORA]: "target-chain-aurora",
  [CHAIN_ID_FANTOM]: "target-chain-fantom",
  [CHAIN_ID_KARURA]: "target-chain-karura",
  [CHAIN_ID_ACALA]: "target-chain-acala",
  [CHAIN_ID_KLAYTN]: "target-chain-klaytn",
  [CHAIN_ID_CELO]: "target-chain-celo",
  [CHAIN_ID_NEAR]: "target-chain-near",
  [CHAIN_ID_MOONBEAM]: "target-chain-moonbeam",
  [CHAIN_ID_NEON]: "target-chain-neon",
  [CHAIN_ID_TERRA2]: "target-chain-terra2",
  [CHAIN_ID_INJECTIVE]: "target-chain-injective",
  [CHAIN_ID_OSMOSIS]: "target-chain-osmosis",
  [CHAIN_ID_SUI]: "target-chain-sui",
  [CHAIN_ID_APTOS]: "target-chain-aptos",
  [CHAIN_ID_ARBITRUM]: "target-chain-arbitrum",
  [CHAIN_ID_OPTIMISM]: "target-chain-optimism",
  [CHAIN_ID_GNOSIS]: "target-chain-gnosis",
  [CHAIN_ID_PYTHNET]: "target-chain-pythnet",
  [CHAIN_ID_XPLA]: "target-chain-xpla",
  [CHAIN_ID_BTC]: "target-chain-btc",
  [CHAIN_ID_BASE]: "target-chain-base",
  [CHAIN_ID_SEI]: "target-chain-sei",
  [CHAIN_ID_WORMCHAIN]: "target-chain-wormchain",
  [CHAIN_ID_SEPOLIA]: "target-chain-sepolia",
};

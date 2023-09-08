import * as React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import {
  CHAIN_ID_TO_CSS_ID,
  CHAIN_ID_TO_NAME,
  CHAIN_ID_TO_SYMBOL,
} from "@site/src/utils/const";
import TOCInline from "@theme/TOCInline";
const moreAssets = {
  ETH: {
    symbol: "ETH",
    name: "Ether (Portal)",
    sourceAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    coingeckoId: "ether",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png",
  },
  CHAI: {
    symbol: "CHAI",
    name: "CHAI (Portal)",
    sourceAddress: "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215",
    logo: "https://raw.githubusercontent.com/lucasvo/chui/master/src/assets/logostill.png",
  },
  USDCso: {
    symbol: "USDCso",
    name: "USD Coin (Portal from Solana)",
    sourceAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    coingeckoId: "usd-coin",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  DAI: {
    symbol: "DAI",
    name: "DAI (Portal)",
    sourceAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    coingeckoId: "dai",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/xnorPhAzWXUczCP3KjU5yDxmKKZi5cSbxytQ1LgE3kG/logo.png",
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped BTC (Portal)",
    sourceAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    coingeckoId: "wrapped-bitcoin",
    logo: "https://etherscan.io/token/images/wbtc_28.png?v=1",
  },
  USDCet: {
    symbol: "USDCet",
    name: "USD Coin (Portal from Ethereum)",
    sourceAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    coingeckoId: "usd-coin",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  SWEAT: {
    symbol: "SWEAT",
    name: "Sweat Economy",
  },
  BUSDbs: {
    symbol: "BUSDbs",
    name: "Binance USD (Portal from BSC)",
    sourceAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    coingeckoId: "binance-usd",
    logo: "https://etherscan.io/token/images/binanceusd_32.png",
  },
  BONK: {
    symbol: "BONK",
    name: "BONK (Portal)",
    sourceAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    coingeckoId: "bonk",
    logo: "https://raw.githubusercontent.com/wormhole-foundation/wormhole-token-list/main/src/logogen/base/BONK.png",
  },
  TBTC: {
    symbol: "TBTC",
    name: "Threshold Bitcoin",
    sourceAddress: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
    coingeckoId: "tbtc",
    logo: "https://assets.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1674474504",
  },
};
function useLiquidityMarkets(): any {
  const [json, setJson] = React.useState("");
  React.useEffect(() => {
    const controller = new AbortController();
    async function getLiquidityMarkets() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/certusone/wormhole-token-list/main/src/markets.json",
          { signal: controller.signal }
        );
        const data = await response.json();
        const responseAssets = await fetch(
          "https://raw.githubusercontent.com/wormhole-foundation/wormhole-token-list/88fb7a1c4be00fb81c0532cc1482754e479397d5/src/utils/solana_wormhole_tokens.json",
          { signal: controller.signal }
        );

        const assets = await responseAssets.json();
        console.log("assets", { ...assets, ...moreAssets });

        setJson({ ...data, assets: { ...assets, ...moreAssets } });
      } catch (err) {
        console.log(err);
      }
    }
    getLiquidityMarkets();
    return () => controller.abort();
  }, []);

  return json;
}

function AssetTable(target, id, markets, tokens, assets) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Token (origin)</th>
            <th>Token (target)</th>
            <th>Markets</th>
            <th>Contract address</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(target).map((contractAddress) => (
            <tr key={`tr-${contractAddress}`}>
              <td>{tokens[contractAddress].symbol}</td>
              <td>{assets[tokens[contractAddress]?.symbol]?.name}</td>
              <td>
                {target[contractAddress].markets.map((type, idx) => (
                  <span key={`link-${contractAddress}-${idx}`}>
                    <a href={markets[type].link}>
                      {markets[type]?.name || "Not defined"}
                    </a>
                    {idx === target[contractAddress].markets.length - 1
                      ? ""
                      : ", "}
                  </span>
                ))}
              </td>
              <td>{contractAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
function formatTargetChain(source) {
  return Object.keys(source)
    .map((key) => {
      return {
        target: key,
        assets: Object.keys(source[key]).map((contract) => {
          return {
            name: source[key][contract].symbol,
            contract: contract,
            markets: source[key][contract].markets,
          };
        }),
      };
    })
    .filter((target) => target.assets.length !== 0);
}

interface TOCItem {
  value: string;
  id: string;
  level: number;
}

function LiquidityMarketTable({
  source,
  sourceId,
  markets,
  tokens,
  targets,
  assets,
}) {
  const sourceName = CHAIN_ID_TO_SYMBOL[sourceId];

  return (
    <>
      <h3 id={CHAIN_ID_TO_CSS_ID[sourceId]}>Target chain: {targets?.name}</h3>
      <Tabs className="tabItemMarket">
        {targets.items.map((item, idx) => {
          const targetName = CHAIN_ID_TO_SYMBOL[item.target];
          return (
            <TabItem
              key={`${targets?.name} ${idx}`}
              value={`${targetName} -> ${sourceName} ${idx}`}
              label={`${targetName} -> ${sourceName}`}
              default={idx === 0}
            >
              {AssetTable(
                source[item.target],
                item.target,
                markets,
                tokens,
                assets
              )}
            </TabItem>
          );
        })}
      </Tabs>
    </>
  );
}

export default function LiquidityMarkets({ children }) {
  const { tokenMarkets, markets, tokens, assets } = useLiquidityMarkets();

  let toc: TOCItem[] = [];
  let targets = {};

  if (!!tokenMarkets) {
    Object.keys(tokenMarkets).forEach((key: any) => {
      const target = formatTargetChain(tokenMarkets[key]);

      if (!!target && target.length !== 0) {
        targets[key] = { id: key, name: CHAIN_ID_TO_NAME[key], items: target };
        toc.push({
          value: `Target chain: ${CHAIN_ID_TO_NAME[key]}`,
          id: CHAIN_ID_TO_CSS_ID[key],
          level: 3,
        });
      }
    });
  }
  return (
    <>
      <TOCInline toc={toc} />
      {tokenMarkets && markets && tokens && (
        <>
          {children}
          {Object.keys(targets).map((key: any, idx) => (
            <LiquidityMarketTable
              key={idx}
              source={tokenMarkets[key]}
              sourceId={key}
              markets={markets}
              tokens={tokens[key]}
              assets={assets}
              targets={targets[key]}
            />
          ))}
        </>
      )}
    </>
  );
}

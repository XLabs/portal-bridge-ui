import * as React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { CHAIN_ID_TO_SYMBOL } from "@site/src/utils/const";
/*import {
  coalesceChainName
 } from "@certusone/wormhole-sdk";
*/
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
        setJson(data);
      } catch (err) {
        console.log(err);
      }
    }
    getLiquidityMarkets();
    return () => controller.abort();
  }, []);

  return json;
}

interface LiquidityMarketProps {
  source: string;
}

function LiquidityMarket(props: LiquidityMarketProps) {}

interface LiquidityMarketTableProps {
  source: string;
  targets: Array<{
    target: string;
    contract: string;
    markets: Array<{
      name: string;
      href: string;
    }>;
  }>;
}

function AssetTable(props: { target: any }) {
  return <>{JSON.stringify(props.target)}</>;
}

function LiquidityMarketTable({ source, sourceId }) {
  console.log("source", sourceId);

  //const sourceName = coalesceChainName(sourceId);
  return (
    <>
      ## Target chain: {CHAIN_ID_TO_SYMBOL[sourceId]}
      {/*<Tabs>
         {source.map((target, idx) => {
          const targetName = coalesceChainName(target);
          return (
          <TabItem value={`${sourceName} -> ${targetName}`} label={`${sourceName} -> ${targetName}`} default={idx === 0}>
            sdfsdf
          </TabItem>)
        })} 
      </Tabs>*/}
    </>
  );
}

interface Market {
  name: string;
  href: string;
}

interface Asset {
  name: string;
  contract: string;
  markets: Array<Market>;
}

interface Target {
  target: string;
  assets: Array<Asset>;
}

interface Source {
  source: string;
  targets: Array<Target>;
}

interface Entry {
  source: string;
  target: string;
  asset: string;
  contract: string;
  markets: Array<Market>;
}

interface MarketTableProps {
  source: string;
  tabs: Array<Entry>;
}

const sample2 = [
  {
    source: "Solana",
    target: "Ethereum",
    asset: "USDC",
    contract: "0x1234",
    markets: Array<Market>,
  },
];

const sample = [
  {
    source: "Solana",
    targets: [
      {
        target: "Ethereum",
        assets: [
          {
            name: "USDC",
            contract: "0x1234",
            markets: [
              {
                name: "USDC/USDT",
                href: "https://app.sushi.com/add/0x6b175474e89094c44da98b954eedeac495271d0f/0xdac17f958d2ee523a2206206994597c13d831ec7",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function LiquidityMarkets() {
  const { tokenMarkets, markets, tokens } = useLiquidityMarkets();

  return (
    <>
      {tokenMarkets && markets && tokens && (
        <>
          {Object.keys(tokenMarkets).map((key: any) => (
            <LiquidityMarketTable source={tokenMarkets[key]} sourceId={key} />
          ))}
        </>
      )}
    </>
  );
}

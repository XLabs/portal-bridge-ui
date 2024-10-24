import {
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";
// import { terra } from "@certusone/wormhole-sdk";
import { Rule, PredicateArgs } from "../hooks/useWarningRulesEngine";

const ETHEREUM_PANDLE_ADDRESS = "0X808507121B80C02388FAD14726482E061B8DA827";

const isPandleFromEthereum = (
  sourceChain: number,
  selectedTokenAddress: string | undefined
) =>
  sourceChain === CHAIN_ID_ETH &&
  selectedTokenAddress === ETHEREUM_PANDLE_ADDRESS;

const isPandleFromBsc = (
  sourceChain: number,
  selectedTokenAddress: string | undefined
) =>
  sourceChain === CHAIN_ID_BSC &&
  selectedTokenAddress === ETHEREUM_PANDLE_ADDRESS;

const PANDLE_MESSAGE =
  "Pandle transfers are limited to Ethereum to BSC and BSC to Ethereum.";

const transferRules: Rule[] = [
  {
    id: "pandle",
    predicate: ({ source, token }: PredicateArgs) =>
      isPandleFromEthereum(source, token?.toUpperCase()) ||
      isPandleFromBsc(source, token?.toUpperCase()),
    text: PANDLE_MESSAGE,
  },
];

export default transferRules;

import {
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_TERRA,
  CHAIN_ID_AURORA,
} from "@certusone/wormhole-sdk";
import { terra } from "@certusone/wormhole-sdk";
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
const AuroraMessage =
  "As a precautionary measure, Wormhole Network and Portal have paused Aurora support temporarily.";
const TERRA_CLASSIC_MESSAGE =
  "Transfers of native tokens to Terra Classic have been temporarily paused.";

const transferRules: Rule[] = [
  {
    id: "pandle",
    predicate: ({ source, token }: PredicateArgs) =>
      isPandleFromEthereum(source, token?.toUpperCase()) ||
      isPandleFromBsc(source, token?.toUpperCase()),
    text: PANDLE_MESSAGE,
  },
  {
    id: "aurora",
    predicate: ({ source, target }: PredicateArgs) =>
      source === CHAIN_ID_AURORA || target === CHAIN_ID_AURORA,
    text: AuroraMessage,
    disableTransfer: true,
  },
  {
    id: "terra-classic-native",
    predicate: ({ target, token }: PredicateArgs) =>
      target === CHAIN_ID_TERRA && terra.isNativeDenom(token),
    text: TERRA_CLASSIC_MESSAGE,
    disableTransfer: true,
  },
];

export default transferRules;

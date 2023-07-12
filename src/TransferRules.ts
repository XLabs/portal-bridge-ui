import {
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_TERRA,
  CHAIN_ID_AURORA,
  ChainId,
  getForeignAssetTerra,
  hexToUint8Array,
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import { PredicateArgs, Rule } from "./hooks/useTransferControl";
import { terra } from "@certusone/wormhole-sdk";
import { LCDClient } from "@terra-money/terra.js";
import { getTerraConfig, getTokenBridgeAddressForChain } from "./utils/consts";

const EthereumPandleAddress = "0X808507121B80C02388FAD14726482E061B8DA827";
const BscPandleAddres = "0XB3ED0A426155B79B898849803E3B36552F7ED507";

const lcd = new LCDClient(getTerraConfig(CHAIN_ID_TERRA));
const getTerraClassic = (originChain: ChainId, originAssetHex: string) =>
  getForeignAssetTerra(
    getTokenBridgeAddressForChain(CHAIN_ID_TERRA),
    lcd,
    originChain,
    hexToUint8Array(tryNativeToHexString(originAssetHex, originChain))
  );

(async () => {
  const info = await getTerraClassic(
    CHAIN_ID_ETH,
    "0xDeba6Ecc1865B217b1CaAbd16D7261d2a21b6046"
  );
  console.log(info);
})();

const isPandleFromEthereum = (
  sourceChain: number,
  selectedTokenAddress: string | undefined
) =>
  sourceChain === CHAIN_ID_ETH &&
  selectedTokenAddress === EthereumPandleAddress;

const isPandleFromBsc = (
  sourceChain: number,
  selectedTokenAddress: string | undefined
) => sourceChain === CHAIN_ID_BSC && selectedTokenAddress === BscPandleAddres;

const PandleMessage =
  "Pandle transfers are limited to Ethereum to BSC and BSC to Ethereum.";
const AuroraMessage =
  "As a precautionary measure, Wormhole Network and Portal have paused Aurora support temporarily.";
const TerraClassicMessage =
  "Transfers of native tokens to/from Terra Classic have been temporarily paused.";

const TransferRules: Rule[] = [
  {
    id: "pandle",
    predicate: ({ source, token }: PredicateArgs) =>
      isPandleFromEthereum(source, token?.toUpperCase()) ||
      isPandleFromBsc(source, token?.toUpperCase()),
    text: PandleMessage,
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
    predicate: ({ source, target, token }: PredicateArgs) =>
      (source === CHAIN_ID_TERRA || target === CHAIN_ID_TERRA) && terra.isNativeDenom(token),
    text: TerraClassicMessage,
    disableTransfer: true,
  },
];

export default TransferRules;

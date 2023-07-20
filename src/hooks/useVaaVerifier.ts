import {
  ChainId,
  ParsedVaa,
  hexToUint8Array,
  parseNFTPayload,
  parseTransferPayload,
  parseVaa,
  tryHexToNativeString,
} from "@certusone/wormhole-sdk";
import { useMemo } from "react";
import {
  getNFTBridgeAddressForChain,
  getTokenBridgeAddressForChain,
} from "../utils/consts";

enum VAAType {
  UNKNOWN = 0,
  TRANSFER = 1,
  ATTEST = 2,
  TRANSFER_WITH_PAYLOAD = 3,
}

interface ParserPayload<T> {
  (buffer: Buffer): T;
}

function parsePayload<T>(
  payload: Buffer,
  parser: ParserPayload<T>
): T | undefined {
  try {
    if (payload) {
      return parser(payload);
    }
  } catch (err) {
    console.debug(`Failed to parse payload with ${parser}`, err);
  }
}

function getPayloadType(payload: Buffer): VAAType {
  try {
    const type = payload.readInt8(0);
    if (type > 0 || type <= 3) {
      return type;
    }
  } catch (err) {
    console.debug(`Failed to parse type from payload`, err);
  }
  return VAAType.UNKNOWN;
}

function parseVaaFromHexString(hexVaa: string): ParsedVaa {
  try {
    return parseVaa(hexToUint8Array(hexVaa));
  } catch (err) {
    console.debug(err);
  }
  return {} as ParsedVaa;
}

function itWasEmittedFrom(
  emitterAddress: Buffer,
  emitterChain: number,
  getAddressFn: (chainId: ChainId) => string
): boolean {
  try {
    const chainId = emitterChain as ChainId;
    const vaaEmitterAddress = tryHexToNativeString(
      emitterAddress?.toString("hex"),
      chainId
    );
    return (
      getAddressFn(chainId)?.toUpperCase() === vaaEmitterAddress?.toUpperCase()
    );
  } catch (err) {
    console.debug(err);
  }
  return false;
}

function isItASupportedType(
  type: VAAType,
  ...supportedTypes: VAAType[]
): boolean {
  return supportedTypes.includes(type);
}

export function useVaaVerifier(hexVaa: string) {
  const vaa = useMemo(() => parseVaaFromHexString(hexVaa), [hexVaa]);
  const vaaEmitterChain = useMemo(() => vaa?.emitterChain as ChainId, [vaa]);
  const vaaEmitterAddress = useMemo(() => vaa?.emitterAddress, [vaa]);
  const nft = useMemo(() => parsePayload(vaa?.payload, parseNFTPayload), [vaa]);
  const transfer = useMemo(
    () => parsePayload(vaa?.payload, parseTransferPayload),
    [vaa]
  );
  const payloadType = useMemo(() => getPayloadType(vaa?.payload), [vaa]);
  const isTokenBridgeTransfer = useMemo(
    () =>
      itWasEmittedFrom(
        vaaEmitterAddress,
        vaaEmitterChain,
        getTokenBridgeAddressForChain
      ) &&
      isItASupportedType(
        payloadType,
        VAAType.TRANSFER,
        VAAType.TRANSFER_WITH_PAYLOAD
      ),
    [vaaEmitterAddress, vaaEmitterChain, payloadType]
  );
  const isNFTTransfer = useMemo(
    () =>
      itWasEmittedFrom(
        vaaEmitterAddress,
        vaaEmitterChain,
        getNFTBridgeAddressForChain
      ) && isItASupportedType(payloadType, VAAType.TRANSFER),
    [vaaEmitterAddress, vaaEmitterChain, payloadType]
  );
  return {
    transfer,
    nft,
    payloadType,
    isTokenBridgeTransfer,
    isNFTTransfer,
  };
}

import { CHAIN_ID_ETH } from "@certusone/wormhole-sdk";
import { useSelector } from "react-redux"
import { TBTC_ASSET_ADDRESS } from "../utils/consts";
import { RootState } from "../store";
import { useMemo } from "react";

export default function useIsTBtc() {
    const { originChain, originAsset } = useSelector((state: RootState) => state.transfer);
    const isTBtc = useMemo(
        () => originChain === CHAIN_ID_ETH && TBTC_ASSET_ADDRESS.toLowerCase() === originAsset?.toLowerCase(),
        [originChain, originAsset]
    );
    return isTBtc;
}
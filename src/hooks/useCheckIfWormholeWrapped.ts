import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  CHAIN_ID_SEI,
  cosmos,
  getOriginalAssetAptos,
  getOriginalAssetAlgorand,
  getOriginalAssetCosmWasm,
  getOriginalAssetEth,
  getOriginalAssetSol,
  isEVMChain,
  isTerraChain,
  uint8ArrayToHex,
  WormholeWrappedInfo,
  CHAIN_ID_INJECTIVE,
  getOriginalAssetInjective,
  CHAIN_ID_SUI,
  getOriginalAssetSui,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";
import {
  getOriginalAssetEth as getOriginalAssetEthNFT,
  getOriginalAssetSol as getOriginalAssetSolNFT,
  getOriginalAssetAptos as getOriginalAssetAptosNFT,
} from "@certusone/wormhole-sdk/lib/esm/nft_bridge";
import { Connection } from "@solana/web3.js";
import { LCDClient } from "@terra-money/terra.js";
import { Algodv2 } from "algosdk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { useNearContext } from "../contexts/NearWalletContext";
import { setSourceWormholeWrappedInfo as setNFTSourceWormholeWrappedInfo } from "../store/nftSlice";
import {
  selectNFTIsRecovery,
  selectNFTSourceAsset,
  selectNFTSourceChain,
  selectNFTSourceParsedTokenAccount,
  selectTransferIsRecovery,
  selectTransferSourceAsset,
  selectTransferSourceChain,
} from "../store/selectors";
import { setSourceWormholeWrappedInfo as setTransferSourceWormholeWrappedInfo } from "../store/transferSlice";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getNFTBridgeAddressForChain,
  getTerraConfig,
  getTokenBridgeAddressForChain,
  NATIVE_NEAR_PLACEHOLDER,
  NEAR_TOKEN_BRIDGE_ACCOUNT,
  SOLANA_HOST,
  SOL_NFT_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
  XPLA_LCD_CLIENT_CONFIG,
  THRESHOLD_TBTC_CONTRACTS,
  TBTC_ASSET_ADDRESS,
  SEI_TRANSLATOR,
} from "../utils/consts";
import { getOriginalAssetNear, makeNearAccount } from "../utils/near";
import { LCDClient as XplaLCDClient } from "@xpla/xpla.js";
import { getAptosClient } from "../utils/aptos";
import { getInjectiveWasmClient } from "../utils/injective";
import { getSuiProvider } from "../utils/sui";
import { getOriginalAssetSei, getSeiWasmClient } from "../utils/sei";
import { base58 } from "ethers/lib/utils";

export interface StateSafeWormholeWrappedInfo {
  isWrapped: boolean;
  chainId: ChainId;
  assetAddress: string;
  tokenId?: string;
}

const makeStateSafe = (
  info: WormholeWrappedInfo
): StateSafeWormholeWrappedInfo => ({
  ...info,
  assetAddress: uint8ArrayToHex(info.assetAddress),
});

// Check if the tokens in the configured source chain/address are wrapped
// tokens. Wrapped tokens are tokens that are non-native, I.E, are locked up on
// a different chain than this one.
function useCheckIfWormholeWrapped(nft?: boolean) {
  const dispatch = useDispatch();
  const sourceChain = useSelector(
    nft ? selectNFTSourceChain : selectTransferSourceChain
  );
  const sourceAsset = useSelector(
    nft ? selectNFTSourceAsset : selectTransferSourceAsset
  );
  const nftSourceParsedTokenAccount = useSelector(
    selectNFTSourceParsedTokenAccount
  );
  const tokenId = nftSourceParsedTokenAccount?.tokenId || ""; // this should exist by this step for NFT transfers
  const aptosTokenId = nftSourceParsedTokenAccount?.aptosTokenId; // this should exist by this step for Aptos NFT transfers
  const setSourceWormholeWrappedInfo = nft
    ? setNFTSourceWormholeWrappedInfo
    : setTransferSourceWormholeWrappedInfo;
  const { provider } = useEthereumProvider(sourceChain as any);
  const { accountId: nearAccountId } = useNearContext();
  const isRecovery = useSelector(
    nft ? selectNFTIsRecovery : selectTransferIsRecovery
  );
  useEffect(() => {
    if (isRecovery) {
      return;
    }
    // TODO: loading state, error state
    let cancelled = false;
    (async () => {
      if (isEVMChain(sourceChain) && provider && sourceAsset) {
        const wrappedInfo = makeStateSafe(
          await (nft
            ? getOriginalAssetEthNFT(
                getNFTBridgeAddressForChain(sourceChain),
                provider,
                sourceAsset,
                tokenId,
                sourceChain
              )
            : getOriginalAssetEth(
                getTokenBridgeAddressForChain(sourceChain),
                provider,
                sourceAsset,
                sourceChain
              ))
        );

        // check for tBTC on canonical chains, make their origin be eth-wrapped-tbtc
        if (
          !cancelled &&
          sourceChain !== CHAIN_ID_ETH &&
          THRESHOLD_TBTC_CONTRACTS[sourceChain]?.toLowerCase() ===
            sourceAsset?.toLowerCase()
        ) {
          console.log("selected tBTC on canonical chain");
          dispatch(
            setSourceWormholeWrappedInfo({
              isWrapped: true,
              chainId: CHAIN_ID_ETH,
              assetAddress: TBTC_ASSET_ADDRESS,
            })
          );
          return;
        }

        if (!cancelled) {
          dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
        }
      }
      if (sourceChain === CHAIN_ID_SOLANA && sourceAsset) {
        try {
          // Check if is tBtc canonical on Solana
          // TODO improve the check and centralice the login on just one place
          if (THRESHOLD_TBTC_CONTRACTS[sourceChain] === sourceAsset) {
            console.log("selected tBTC on canonical chain");
            dispatch(
              setSourceWormholeWrappedInfo({
                isWrapped: true,
                chainId: CHAIN_ID_ETH,
                assetAddress: TBTC_ASSET_ADDRESS,
              })
            );
            return;
          } else {
            const connection = new Connection(SOLANA_HOST, "confirmed");
            const wrappedInfo = makeStateSafe(
              await (nft
                ? getOriginalAssetSolNFT(
                    connection,
                    SOL_NFT_BRIDGE_ADDRESS,
                    sourceAsset
                  )
                : getOriginalAssetSol(
                    connection,
                    SOL_TOKEN_BRIDGE_ADDRESS,
                    sourceAsset
                  ))
            );
            if (!cancelled) {
              dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
            }
          }
        } catch (e) {}
      }
      if (isTerraChain(sourceChain) && sourceAsset) {
        try {
          const lcd = new LCDClient(getTerraConfig(sourceChain));
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetCosmWasm(lcd, sourceAsset, sourceChain)
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (sourceChain === CHAIN_ID_XPLA && sourceAsset) {
        try {
          const lcd = new XplaLCDClient(XPLA_LCD_CLIENT_CONFIG);
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetCosmWasm(lcd, sourceAsset, sourceChain)
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (sourceChain === CHAIN_ID_SEI && sourceAsset) {
        try {
          const client = await getSeiWasmClient();
          const queryAsset = sourceAsset.startsWith(
            `factory/${SEI_TRANSLATOR}/`
          )
            ? cosmos.humanAddress(
                "sei",
                base58.decode(sourceAsset.split("/")[2])
              )
            : sourceAsset;
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetSei(queryAsset, client)
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (sourceChain === CHAIN_ID_APTOS && !nft && sourceAsset) {
        try {
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetAptos(
              getAptosClient(),
              getTokenBridgeAddressForChain(CHAIN_ID_APTOS),
              sourceAsset
            )
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (sourceChain === CHAIN_ID_APTOS && nft && aptosTokenId) {
        try {
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetAptosNFT(
              getAptosClient(),
              getNFTBridgeAddressForChain(CHAIN_ID_APTOS),
              aptosTokenId
            )
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (sourceChain === CHAIN_ID_ALGORAND && sourceAsset) {
        try {
          const algodClient = new Algodv2(
            ALGORAND_HOST.algodToken,
            ALGORAND_HOST.algodServer,
            ALGORAND_HOST.algodPort
          );
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetAlgorand(
              algodClient as any,
              ALGORAND_TOKEN_BRIDGE_ID,
              BigInt(sourceAsset)
            )
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (
        sourceChain === CHAIN_ID_NEAR &&
        nearAccountId &&
        sourceAsset !== undefined
      ) {
        try {
          const account = await makeNearAccount(nearAccountId);
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetNear(
              account,
              NEAR_TOKEN_BRIDGE_ACCOUNT,
              sourceAsset === NATIVE_NEAR_PLACEHOLDER ? "" : sourceAsset
            )
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (sourceChain === CHAIN_ID_INJECTIVE && sourceAsset) {
        try {
          const client = getInjectiveWasmClient();
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetInjective(sourceAsset, client as any)
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {}
      }
      if (sourceChain === CHAIN_ID_SUI && sourceAsset) {
        try {
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetSui(
              getSuiProvider(),
              getTokenBridgeAddressForChain(CHAIN_ID_SUI),
              sourceAsset
            )
          );
          if (!cancelled) {
            dispatch(setSourceWormholeWrappedInfo(wrappedInfo));
          }
        } catch (e) {
          console.error(e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    isRecovery,
    sourceChain,
    sourceAsset,
    provider,
    nft,
    setSourceWormholeWrappedInfo,
    tokenId,
    nearAccountId,
    aptosTokenId,
  ]);
}

export default useCheckIfWormholeWrapped;

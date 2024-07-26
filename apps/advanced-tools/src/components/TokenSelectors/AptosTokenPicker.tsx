import { CHAIN_ID_APTOS, isValidAptosType } from "@certusone/wormhole-sdk";
import { formatUnits } from "@ethersproject/units";
import { useCallback, useRef } from "react";
import { AptosCoinResourceReturn } from "../../hooks/useAptosMetadata";
import { createParsedTokenAccount } from "../../hooks/useGetSourceParsedTokenAccounts";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import { DataWrapper } from "../../store/helpers";
import { NFTParsedTokenAccount } from "../../store/nftSlice";
import { ParsedTokenAccount } from "../../store/transferSlice";
import { getAptosClient } from "../../utils/aptos";
import TokenPicker, { BasicAccountRender } from "./TokenPicker";

type AptosTokenPickerProps = {
  value: ParsedTokenAccount | null;
  onChange: (newValue: ParsedTokenAccount | null) => void;
  tokenAccounts: DataWrapper<ParsedTokenAccount[]> | undefined;
  disabled: boolean;
  resetAccounts: (() => void) | undefined;
  nft?: boolean;
};

const returnsFalse = () => false;

export default function AptosTokenPicker(props: AptosTokenPickerProps) {
  const { value, onChange, tokenAccounts, disabled, nft = false } = props;
  const { walletAddress } = useIsWalletReady(CHAIN_ID_APTOS);
  const nativeRefresh = useRef<() => void>(() => {});

  const resetAccountWrapper = useCallback(() => {
    //we can currently skip calling this as we don't read from sourceParsedTokenAccounts
    //resetAccounts && resetAccounts();
    nativeRefresh.current();
  }, []);
  const isLoading = tokenAccounts?.isFetching; //nativeIsLoading; // || (tokenMap?.isFetching || false);

  const onChangeWrapper = useCallback(
    async (account: NFTParsedTokenAccount | null) => {
      if (account === null) {
        onChange(null);
        return Promise.resolve();
      }
      onChange(account);
      return Promise.resolve();
    },
    [onChange]
  );

  //TODO this only supports non-native assets. Native assets come from the hook.
  //TODO correlate against token list to get metadata
  const lookupAptosAddress = useCallback(
    (lookupAsset: string) => {
      if (!walletAddress) {
        return Promise.reject("Wallet not connected");
      }
      const client = getAptosClient();
      return (async () => {
        try {
          const coinType = `0x1::coin::CoinInfo<${lookupAsset}>`;
          const coinStore = `0x1::coin::CoinStore<${lookupAsset}>`;
          const value = (
            (await client.getAccountResource(walletAddress, coinStore))
              .data as any
          ).coin.value;
          const assetInfo = (
            await client.getAccountResource(
              lookupAsset.split("::")[0],
              coinType
            )
          ).data as AptosCoinResourceReturn;
          if (value && assetInfo) {
            return createParsedTokenAccount(
              walletAddress,
              lookupAsset,
              value.toString(),
              assetInfo.decimals,
              Number(formatUnits(value, assetInfo.decimals)),
              formatUnits(value, assetInfo.decimals),
              assetInfo.symbol,
              assetInfo.name
            );
          } else {
            throw new Error("Failed to retrieve Aptos account.");
          }
        } catch (e) {
          console.log(e);
          return Promise.reject();
        }
      })();
    },
    [walletAddress]
  );

  const isSearchableAddress = useCallback((address: string) => {
    return isValidAptosType(address);
  }, []);

  const RenderComp = useCallback(
    ({ account }: { account: NFTParsedTokenAccount }) => {
      return BasicAccountRender(account, returnsFalse, nft);
    },
    [nft]
  );

  return (
    <TokenPicker
      value={value}
      options={tokenAccounts?.data || []}
      RenderOption={RenderComp}
      onChange={onChangeWrapper}
      isValidAddress={isSearchableAddress}
      getAddress={nft ? undefined : lookupAptosAddress}
      disabled={disabled}
      resetAccounts={resetAccountWrapper}
      error={""}
      showLoader={isLoading}
      nft={nft}
      chainId={CHAIN_ID_APTOS}
    />
  );
}

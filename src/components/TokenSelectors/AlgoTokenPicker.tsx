import { ChainId, CHAIN_ID_ALGORAND } from "@certusone/wormhole-sdk";
import { formatUnits } from "@ethersproject/units";
import { Algodv2 } from "algosdk";
import React, { useCallback } from "react";
import { fetchSingleMetadata } from "../../hooks/useAlgoMetadata";
import { createParsedTokenAccount } from "../../hooks/useGetSourceParsedTokenAccounts";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import { DataWrapper } from "../../store/helpers";
import { NFTParsedTokenAccount } from "../../store/nftSlice";
import { ParsedTokenAccount } from "../../store/transferSlice";
import { ALGORAND_HOST } from "../../utils/consts";
import TokenPicker, { BasicAccountRender } from "./TokenPicker";

type AlgoTokenPickerProps = {
  value: ParsedTokenAccount | null;
  onChange: (newValue: ParsedTokenAccount | null) => void;
  tokenAccounts: DataWrapper<ParsedTokenAccount[]> | undefined;
  disabled: boolean;
  resetAccounts: (() => void) | undefined;
};

const returnsFalse = () => false;

export default function AlgoTokenPicker(props: AlgoTokenPickerProps) {
  const { value, onChange, disabled, tokenAccounts, resetAccounts } = props;
  const { walletAddress } = useIsWalletReady(CHAIN_ID_ALGORAND);

  const resetAccountWrapper = useCallback(() => {
    resetAccounts && resetAccounts();
  }, [resetAccounts]);
  const isLoading = tokenAccounts?.isFetching || false;

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

  const lookupAlgoAddress = useCallback(
    async (lookupAsset: string) => {
      if (!walletAddress) throw new Error("Wallet not connected");
      const algodClient = new Algodv2(
        ALGORAND_HOST.algodToken,
        ALGORAND_HOST.algodServer,
        ALGORAND_HOST.algodPort
      );
      const metadata = await fetchSingleMetadata(lookupAsset, algodClient);
      const accountInfo = await algodClient
        .accountInformation(walletAddress)
        .do();

      const asset = accountInfo.assets.find(
        (asset: any) => asset["asset-id"]?.toString() === lookupAsset
      );

      if (!asset) throw new Error("Asset not found");

      return createParsedTokenAccount(
        walletAddress,
        asset["asset-id"]?.toString(),
        asset.amount,
        metadata.decimals,
        parseFloat(formatUnits(asset.amount, metadata.decimals)),
        formatUnits(asset.amount, metadata.decimals).toString(),
        metadata.symbol,
        metadata.tokenName,
        undefined,
        false
      );
    },
    [walletAddress]
  );

  const isSearchableAddress = useCallback(
    (address: string, chainId: ChainId) => {
      if (address.length === 0) {
        return false;
      }
      try {
        parseInt(address);
        return true;
      } catch (e) {
        return false;
      }
    },
    []
  );

  const RenderComp = useCallback(
    ({ account }: { account: NFTParsedTokenAccount }) => {
      return BasicAccountRender(account, returnsFalse, false);
    },
    []
  );

  return (
    <TokenPicker
      value={value}
      options={tokenAccounts?.data || []}
      RenderOption={RenderComp}
      onChange={onChangeWrapper}
      isValidAddress={isSearchableAddress}
      getAddress={lookupAlgoAddress}
      disabled={disabled}
      resetAccounts={resetAccountWrapper}
      error={""}
      showLoader={isLoading}
      nft={false}
      chainId={CHAIN_ID_ALGORAND}
    />
  );
}

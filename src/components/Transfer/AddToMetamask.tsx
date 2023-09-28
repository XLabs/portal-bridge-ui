import { isEVMChain } from "@certusone/wormhole-sdk";
import { Button, makeStyles } from "@material-ui/core";
import detectEthereumProvider from "@metamask/detect-provider";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useEthereumProvider } from "../../contexts/EthereumProviderContext";
import {
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetAsset,
  selectTransferTargetChain,
  selectTransferIsTBTC,
} from "../../store/selectors";
import { THRESHOLD_TBTC_CONTRACTS, getEvmChainId } from "../../utils/consts";
import {
  ethTokenToParsedTokenAccount,
  getEthereumToken,
} from "../../utils/ethereum";

const useStyles = makeStyles((theme) => ({
  addButton: {
    display: "block",
    margin: `${theme.spacing(1)}px auto 0px`,
  },
}));

export default function AddToMetamask() {
  const classes = useStyles();
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const targetChain = useSelector(selectTransferTargetChain);
  const sourceChain = useSelector(selectTransferSourceChain);
  const targetAsset = useSelector(selectTransferTargetAsset);

  const isTBTC = useSelector(selectTransferIsTBTC);
  const isAddingTBTC =
    isTBTC &&
    THRESHOLD_TBTC_CONTRACTS[targetChain] &&
    THRESHOLD_TBTC_CONTRACTS[sourceChain];
  const tbtcAsset = THRESHOLD_TBTC_CONTRACTS[targetChain];

  const { provider, signerAddress, evmChainId, wallet } = useEthereumProvider(
    targetChain as any
  );
  const hasCorrectEvmNetwork = evmChainId === getEvmChainId(targetChain);
  const handleClick = useCallback(() => {
    if (provider && targetAsset && signerAddress && hasCorrectEvmNetwork) {
      (async () => {
        try {
          const token = await getEthereumToken(targetAsset, provider);
          const { symbol, decimals } = await ethTokenToParsedTokenAccount(
            token,
            signerAddress
          );
          const ethereum = (await detectEthereumProvider()) as any;
          // https://docs.metamask.io/wallet/reference/wallet_watchasset/
          ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // In the future, other standards will be supported
              options: {
                address: isAddingTBTC ? tbtcAsset : targetAsset, // The address of the token contract
                symbol: (
                  symbol ||
                  sourceParsedTokenAccount?.symbol ||
                  "wh"
                ).substring(0, 11), // A ticker symbol or shorthand, up to 11 characters as of 2023-09-05
                decimals, // The number of token decimals
                // image: string; // A string url of the token logo
              },
            },
          });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [
    provider,
    targetAsset,
    signerAddress,
    hasCorrectEvmNetwork,
    isAddingTBTC,
    tbtcAsset,
    sourceParsedTokenAccount?.symbol,
  ]);
  return provider &&
    signerAddress &&
    targetAsset &&
    isEVMChain(targetChain) &&
    hasCorrectEvmNetwork ? (
    <Button
      onClick={handleClick}
      size="small"
      variant="outlined"
      className={classes.addButton}
    >
      {`Add to ${wallet?.getName() || "wallet"}`}
    </Button>
  ) : null;
}

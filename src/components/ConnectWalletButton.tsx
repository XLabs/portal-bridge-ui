import { ChainId } from "@certusone/wormhole-sdk";
import { useCallback, useEffect, useState } from "react";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import {
  useChangeWallet,
  useUnsetWalletFromChain,
  useWallet,
  useWalletsForChainWithStatus,
} from "@xlabs-libs/wallet-aggregator-react";
import ConnectWalletDialog from "./ConnectWalletDialog";
import ToggleConnectedButton from "./ToggleConnectedButton";
import { Typography } from "@material-ui/core";
import { CLUSTER } from "../utils/consts";
import { getIsSanctioned } from "../utils/sanctions";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ConnectWalletButton = ({ chainId }: { chainId: ChainId }) => {
  const wallet = useWallet(chainId);
  const changeWallet = useChangeWallet();
  const unsetWalletFromChain = useUnsetWalletFromChain();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const { wallets: availableWallets, isDetectingWallets } =
    useWalletsForChainWithStatus(chainId);
  const sourceChain = useSelector(
    (state: RootState) => state.transfer.sourceChain
  );
  const [walletsNotAvailable, setWalletsNotAvailable] = useState(false);
  const pk = wallet?.getAddress();

  useEffect(() => {
    setWalletsNotAvailable(availableWallets.length === 0);
  }, [sourceChain, availableWallets]);

  const connect = useCallback(
    async (w: Wallet) => {
      try {
        await w.connect();

        const wAddress = w.getAddress();
        const isSanctioned = await getIsSanctioned(chainId, CLUSTER, wAddress);

        if (isSanctioned) {
          console.error("sanctioned wallet detected", wAddress);
          setError(
            new Error("You cannot operate with this address on Portal Bridge.")
          );
        } else {
          changeWallet(w);
          setError(undefined);
        }
      } catch (err: any) {
        console.error(err);
        setError(err);
      }
    },
    [chainId, changeWallet]
  );

  const disconnect = useCallback(async () => {
    try {
      if (!wallet) return;
      await wallet.disconnect();
      unsetWalletFromChain(chainId);
      setError(undefined);
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  }, [unsetWalletFromChain, wallet, chainId]);

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, [setIsDialogOpen]);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const handleConnect = useCallback(() => {
    if (availableWallets.length === 0)
      throw new Error(`No wallets found for chain id ${chainId}`);

    return availableWallets.length > 1
      ? openDialog()
      : connect(availableWallets[0]);
  }, [openDialog, availableWallets, connect, chainId]);

  return (
    <>
      {isDetectingWallets && (
        <Typography
          style={{ textAlign: "center" }}
          variant="body2"
          color="textPrimary"
        >
          Detecting wallets ...
        </Typography>
      )}
      {!isDetectingWallets && walletsNotAvailable && (
        <Typography
          style={{ textAlign: "center" }}
          variant="body2"
          color="textPrimary"
        >
          Wallets not detected for the selected chain
        </Typography>
      )}
      <ToggleConnectedButton
        connect={handleConnect}
        disconnect={disconnect}
        connected={!!pk}
        pk={pk || ""}
        disabled={isDetectingWallets || walletsNotAvailable}
      />
      <ConnectWalletDialog
        isOpen={isDialogOpen}
        onSelect={connect}
        onClose={closeDialog}
        wallets={availableWallets}
      />
      {error && (
        <Typography
          style={{ textAlign: "center" }}
          variant="body2"
          color="error"
        >
          {error.message}
        </Typography>
      )}
    </>
  );
};

export default ConnectWalletButton;

import { ChainId } from "@certusone/wormhole-sdk";
import { useCallback, useState } from "react";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";
import {
  useChangeWallet,
  useUnsetWalletFromChain,
  useWallet,
  useWalletsForChain,
} from "@xlabs-libs/wallet-aggregator-react";
import ConnectWalletDialog from "./ConnectWalletDialog";
import ToggleConnectedButton from "./ToggleConnectedButton";
import { Typography } from "@material-ui/core";

interface ISanction {
  address: string;
  isSanctioned: boolean;
}

const ConnectWalletButton = ({ chainId }: { chainId: ChainId }) => {
  const wallet = useWallet(chainId);
  const changeWallet = useChangeWallet();
  const unsetWalletFromChain = useUnsetWalletFromChain();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const availableWallets = useWalletsForChain(chainId);

  const pk = wallet?.getAddress();

  const getIsSanctioned = async (addr?: string) => {
    const key = process.env.REACT_APP_TRM_API_KEY;
    if (addr && key) {
      const resp = await fetch(
        `https://api.trmlabs.com/public/v1/sanctions/screening`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " + Buffer.from(`${key}:${key}`).toString("base64"),
          },
          body: JSON.stringify([
            {
              address: addr,
              // address: "149w62rY42aZBox8fGcmqNsXUzSStKeq8C", // sanctioned address example
            },
          ]),
        }
      );

      const data = (await resp.json()) as ISanction[];
      const { isSanctioned } = data[0];

      return isSanctioned;
    }
    return true;
  };

  const connect = useCallback(
    async (w: Wallet) => {
      try {
        await w.connect();

        const wAddress = w.getAddress();
        const isSanctioned = await getIsSanctioned(wAddress);

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
    [changeWallet]
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
      <ToggleConnectedButton
        connect={handleConnect}
        disconnect={disconnect}
        connected={!!pk}
        pk={pk || ""}
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

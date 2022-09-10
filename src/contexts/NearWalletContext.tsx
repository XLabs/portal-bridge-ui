import {
  AccountState,
  Network,
  setupWalletSelector,
  WalletSelector,
  WalletSelectorState,
} from "@near-wallet-selector/core";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import {
  setupModal,
  WalletSelectorModal,
} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  ReactChildren,
} from "react";
import { CLUSTER, NEAR_TOKEN_BRIDGE_ACCOUNT } from "../utils/consts";
import { map, distinctUntilChanged, Subscription } from "rxjs";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface INearContext {
  connect(): void;
  disconnect(): void;
  accounts: AccountState[];
  accountId: string | null;
}

const NearContext = React.createContext<INearContext>({
  connect: () => {},
  disconnect: () => {},
  accounts: [],
  accountId: null,
});

const NearDevnet: Network = {
  networkId: "sandbox",
  nodeUrl: "http://localhost:3030",
  helperUrl: "",
  explorerUrl: "",
  indexerUrl: "",
};

export const NearContextProvider = ({
  children,
}: {
  children: ReactChildren;
}) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: Subscription;
    (async () => {
      const selector = await setupWalletSelector({
        network:
          CLUSTER === "mainnet"
            ? "mainnet"
            : "testnet"
            ? "testnet"
            : NearDevnet,
        modules: [
          ...(await setupDefaultWallets()),
          setupNearWallet(),
          setupMyNearWallet(),
        ],
        debug: true,
      });
      const modal = setupModal(selector, {
        contractId: NEAR_TOKEN_BRIDGE_ACCOUNT || "",
      });
      const accounts = selector.store.getState().accounts;
      subscription = selector.store.observable
        .pipe(
          map((state: WalletSelectorState) => state.accounts),
          distinctUntilChanged()
        )
        .subscribe((nextAccounts: AccountState[]) => {
          if (!cancelled) {
            setAccounts(nextAccounts);
          }
        });
      if (!cancelled) {
        setSelector(selector);
        setModal(modal);
        setAccounts(accounts);
      }
    })();
    return () => {
      subscription?.unsubscribe();
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const accountId =
      accounts.find((account) => account.active)?.accountId || null;
    setAccountId(accountId);
  }, [accounts]);

  const connect = useCallback(() => {
    modal?.show();
  }, [modal]);

  const disconnect = useCallback(() => {
    modal?.hide();
    selector
      ?.wallet()
      .then((wallet) =>
        wallet.signOut().catch((error) => console.error(error))
      );
  }, [selector, modal]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      accounts,
      accountId,
    }),
    [connect, disconnect, accounts, accountId]
  );

  return <NearContext.Provider value={value}>{children}</NearContext.Provider>;
};

export function useNearContext() {
  return useContext(NearContext);
}

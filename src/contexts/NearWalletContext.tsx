import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";
import { CHAIN_ID_NEAR } from "@xlabs-libs/wallet-aggregator-core";
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import { useMemo } from "react";
import { getNearConnectionConfig, NEAR_TOKEN_BRIDGE_ACCOUNT } from "../utils/consts";

interface INearWalletContext {
  wallet?: NearWallet;
  accountId?: string;
}

export const getNearWallets = async () => {
  return [
    new NearWallet({
      config: getNearConnectionConfig(),
      contractId: NEAR_TOKEN_BRIDGE_ACCOUNT || '',
      modules: [
        ...(await setupDefaultWallets()),
        setupNearWallet(),
        setupMyNearWallet(),
        setupSender(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
      ]
    })
  ];
}

export function useNearContext(): INearWalletContext {
  const wallet = useWallet<NearWallet>(CHAIN_ID_NEAR);

  const accountId = useMemo(() => wallet?.getAddress(), [ wallet ]);

  return useMemo(() => ({
    wallet,
    accountId
  }), [
    wallet,
    accountId
  ])
}

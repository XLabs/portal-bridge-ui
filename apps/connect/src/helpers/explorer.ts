import { ChainName } from "@certusone/wormhole-sdk";
import * as sdkBase from "@wormhole-foundation/sdk-base";
import { Chain } from "@wormhole-foundation/sdk-base";

export const toChainNameIcon = (chain: string): Chain => {
  return (chain[0].toUpperCase() + chain.slice(1)) as Chain;
};

export const getExplorerURL = (chain: ChainName) => {
  const network =
    wormholeConnectConfig.env === "mainnet" ? "Mainnet" : "Testnet";
  // TODO: This url need to redirect to token information
  return (
    sdkBase.explorer.explorerConfigs(network, toChainNameIcon(chain))
      ?.baseUrl || ""
  );
};

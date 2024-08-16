import mixpanel from "mixpanel-browser";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";

import { CHAINS_BY_ID, isPreview, isProduction, mixpanelToken } from "./consts";
import { ChainId } from "@certusone/wormhole-sdk";

interface TelemetryTxCommon {
  fromChainId?: ChainId;
  toChainId?: ChainId;
  fromChain: string;
  toChain: string;
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  fromTokenAddress?: string;
  toTokenAddress?: string;
  route: string;
  txId?: string;
  amount?: number;
  USDAmount?: number;
  error?: any;
}

export type TelemetryTxEvent = Omit<
  TelemetryTxCommon,
  "fromChain" | "toChain" | "route" | "USDAmount"
>;
type TelemetryTxTrackingProps = Omit<
  TelemetryTxCommon,
  "fromChainId" | "toChainId"
>;

class Telemetry {
  private hasInitiated: boolean = false;
  private lastChainConnected?: string = undefined;

  constructor(private shouldLog: boolean = false) {}

  private log = (...args: any[]) => {
    if (this.shouldLog) console.debug("Telemetry", ...args);
  };

  public initialize = () => {
    if (this.hasInitiated) return;

    mixpanel.init(mixpanelToken, {
      ignore_dnt: true,
      ip: true,
      debug: isPreview,
      track_pageview: "full-url",
    });
    this.hasInitiated = true;
    this.log("initialize");
  };

  private track = (...args: Parameters<typeof mixpanel.track>) => {
    this.log(...args);
    mixpanel.track(...args);
  };

  private lazyInitWrap = <T = () => void>(method: T) => {
    return ((...args: any[]) => {
      this.initialize();
      return (method as Function)(...args);
    }) as T;
  };

  private getChainNameFromId = (chainId?: ChainId): string => {
    return CHAINS_BY_ID[chainId!]?.name;
  };

  private canBeSerialized = (item: any) => {
    try {
      JSON.stringify(item);
      return true;
    } catch {
      return false;
    }
  };

  private getUSDByAddress = async (
    chain: string,
    address: string
  ): Promise<number> => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${chain.toLowerCase()}?contract_addresses=${address}&vs_currencies=usd`
    ).then((r) => r.json());

    return response?.[address]?.usd;
  };

  private getUSDByCoingeckoid = async (
    coingeckoId: string
  ): Promise<number> => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
    ).then((r) => r.json());

    return response?.[coingeckoId]?.usd;
  };

  private getUSDAmount = async (
    chain: string,
    address: string,
    amount: number
  ): Promise<number | undefined> => {
    if (![chain, amount, address].every(Boolean)) return;

    try {
      const USDValue =
        address === "native"
          ? await this.getUSDByCoingeckoid(chain.toLowerCase())
          : await this.getUSDByAddress(chain, address);

      const USDAmount = (USDValue as number) * amount;
      return USDAmount || undefined;
    } catch {}
  };

  private getTxPropsFromEvent = async (event: TelemetryTxEvent) => {
    const fromChain = this.getChainNameFromId(event.fromChainId);
    return {
      fromChain,
      toChain: this.getChainNameFromId(event.toChainId),
      fromTokenSymbol: event.fromTokenSymbol,
      toTokenSymbol: event.toTokenSymbol,
      fromTokenAddress: event.fromTokenAddress,
      toTokenAddress: event.toTokenAddress,
      txId: event.txId,
      amount: event.amount,
      USDAmount: await this.getUSDAmount(
        fromChain,
        event.fromTokenSymbol!,
        event.amount!
      ),
      route: "Manual Bridge",
    } as TelemetryTxTrackingProps;
  };

  private onConnect = (wallet: Wallet) => {
    const eventName = "wallet.connect";
    const side = "sending";
    const chain = this.getChainNameFromId(wallet.getChainId?.());
    const walletName = wallet.getName?.();
    const properties = {
      [`wallet-${side}`]: walletName,
      [`chain-${side}`]: chain,
    };

    if (chain === this.lastChainConnected) return;

    this.lastChainConnected = chain;
    this.track(eventName, properties);
  };

  private onTransfer =
    (eventName: `transfer.${string}`) => async (event: TelemetryTxEvent) => {
      this.track(eventName, await this.getTxPropsFromEvent(event));
    };

  private onError = async (event: TelemetryTxEvent) => {
    this.track("transfer.error", {
      ...(await this.getTxPropsFromEvent(event)),
      "error-type": "unknown",
      error: this.canBeSerialized(event.error) ? event.error : undefined,
    });
  };

  /**
   * Only tracking methods are exposed.
   * mixpanel init is lazily called once when first tracking event occurs.
   */
  public on = {
    connect: this.lazyInitWrap(this.onConnect),
    transferInit: this.lazyInitWrap(this.onTransfer("transfer.initiate")),
    transferStart: this.lazyInitWrap(this.onTransfer("transfer.start")),
    transferSuccess: this.lazyInitWrap(
      this.onTransfer("transfer.reedem.success")
    ),
    error: this.lazyInitWrap(this.onError),
  };
}

export const telemetry = new Telemetry(!isProduction);

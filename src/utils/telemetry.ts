import mixpanel from "mixpanel-browser";
import { Wallet } from "@xlabs-libs/wallet-aggregator-core";

import { CHAINS_BY_ID, isPreview, isProduction, mixpanelToken } from "./consts";
import { ChainId } from "@certusone/wormhole-sdk";

interface TelemetryTxCommon {
  fromChainId: ChainId;
  toChainId: ChainId;
  fromChain: string;
  toChain: string;
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  fromTokenAddress?: string;
  toTokenAddress?: string;
  route: string;
  error?: any;
}

export type TelemetryTxEvent = Omit<
  TelemetryTxCommon,
  "fromChain" | "toChain" | "route"
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

  private init = () => {
    if (this.hasInitiated) return;

    mixpanel.init(mixpanelToken, {
      ignore_dnt: true,
      ip: false,
      debug: isPreview,
    });
    this.hasInitiated = true;
    this.log("init");
  };

  private track = (...args: Parameters<typeof mixpanel.track>) => {
    this.log(...args);
    mixpanel.track(...args);
  };

  private lazyInitWrap = <T = () => void>(method: T) => {
    return ((...args: any[]) => {
      this.init();
      return (method as Function)(...args);
    }) as T;
  };

  private getChainNameFromId = (chainId: ChainId): string => {
    return CHAINS_BY_ID[chainId]?.name;
  };

  private canBeSerialized = (item: any) => {
    try {
      JSON.stringify(item);
      return true;
    } catch {
      return false;
    }
  };

  private getTxPropsFromEvent = (event: TelemetryTxEvent) => {
    return {
      fromChain: this.getChainNameFromId(event.fromChainId),
      toChain: this.getChainNameFromId(event.toChainId),
      fromTokenSymbol: event.fromTokenSymbol,
      toTokenSymbol: event.toTokenSymbol,
      fromTokenAddress: event.fromTokenAddress,
      toTokenAddress: event.toTokenAddress,
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
    (eventName: `transfer.${string}`) => (event: TelemetryTxEvent) => {
      this.track(eventName, this.getTxPropsFromEvent(event));
    };

  private onError = (event: TelemetryTxEvent) => {
    this.track("error", {
      ...this.getTxPropsFromEvent(event),
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
    transferSuccess: this.lazyInitWrap(this.onTransfer("transfer.reedem.success")),
    error: this.lazyInitWrap(this.onError),
  };
}

export const telemetry = new Telemetry(!isProduction);

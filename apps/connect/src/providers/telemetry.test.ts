import mixpanel from "mixpanel-browser";
import { eventHandler } from "./telemetry";

jest.mock("mixpanel-browser", () => ({
  init: jest.fn(),
  track: jest.fn(),
}));

describe("telemetry", () => {
  let completeEvent: any;

  beforeEach(() => {
    (mixpanel.init as jest.Mock).mockClear();
    (mixpanel.track as jest.Mock).mockClear();

    completeEvent = {
      type: "other",
      details: {
        route: "wstETHBridge",
        fromChain: "bsc",
        toChain: "arbitrum",
        txId: "txId",
        USDAmount: 123.456,
        toToken: {
          symbol: "osETH",
          tokenId: { address: "address", chain: "chain" },
        },
        fromToken: { symbol: "WOM", tokenId: "native" },
      },
    };
  });

  it("should not track load events", () => {
    eventHandler({ type: "load" });

    expect(mixpanel.track).not.toHaveBeenCalled();
  });

  it("should track wallet.connect events", () => {
    eventHandler({
      type: "wallet.connect",
      details: {
        side: "sending" as any /** enum is not available */,
        chain: "bsc",
        wallet: "wallet",
      },
    });

    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith("wallet.connect", {
      "chain-sending": "bsc",
      "wallet-sending": "wallet",
    });
  });

  it("should track other events", () => {
    eventHandler(completeEvent);

    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith(completeEvent.type, {
      fromChain: "bsc",
      toChain: "arbitrum",
      fromTokenSymbol: "WOM",
      fromTokenAddress: "native",
      toTokenSymbol: "osETH",
      toTokenAddress: "address",
      route: "wstETH Bridge",
      txId: "txId",
      USDAmount: 123.456,
    });
  });

  it("should track other events with errors", () => {
    completeEvent.type = "transfer.redeem.error";
    completeEvent.error = {
      type: undefined,
      original: { code: "code", name: "name", message: "message" },
    };
    eventHandler(completeEvent);

    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith(
      completeEvent.type,
      expect.objectContaining({
        "error-type": "unknown",
        "error-message": "Code: code Name: name Message: message",
      })
    );
  });

  it("should track other events with a default route", () => {
    completeEvent.details.route = "random";
    eventHandler(completeEvent);

    expect(mixpanel.track).toHaveBeenCalledTimes(1);
    expect(mixpanel.track).toHaveBeenCalledWith(
      completeEvent.type,
      expect.objectContaining({ route: "Manual Bridge" })
    );
  });

  it("should not throw when tracking fails", () => {
    console.error = jest.fn();
    mixpanel.track = jest.fn(() => {
      throw new Error("Intentional error");
    });

    expect(() => eventHandler(completeEvent)).not.toThrow();
    expect(mixpanel.track).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});

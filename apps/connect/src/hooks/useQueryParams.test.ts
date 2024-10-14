import { renderHook } from "@testing-library/react";
import { useQueryParams } from "./useQueryParams";

const rewriteHref = (href: string) => {
  Object.defineProperty(window, "location", {
    value: { href },
    writable: true,
  });
};

describe("useQueryParams", () => {
  beforeEach(() => {
    rewriteHref("https://portalbridge.com/");
  });

  it("should get QS when there is no query", () => {
    rewriteHref("https://portalbridge.com/");
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: null,
      sourceChain: null,
      targetChain: null,
      txHash: null,
      preferredRouteName: null,
      sourceToken: null,
      targetToken: null,
    });
  });

  it("should get QS when query contains all expected attrs after a hash #", () => {
    rewriteHref(
      "https://portalbridge.com/#/?sourceChain=bsc&targetChain=arbitrum&requiredNetwork=arbitrum&txHash=txHash&asset=asset&route=bridge"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: "Arbitrum",
      sourceChain: "Bsc",
      targetChain: "Arbitrum",
      txHash: "txHash",
      preferredRouteName: "bridge",
      sourceToken: "asset",
      targetToken: "asset",
    });
  });

  it("should get QS when query contains all expected attrs when there is no hash", () => {
    rewriteHref(
      "https://portalbridge.com/?sourceChain=bsc&targetChain=arbitrum&requiredNetwork=arbitrum&txHash=txHash&asset=asset&route=bridge"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: "Arbitrum",
      sourceChain: "Bsc",
      targetChain: "Arbitrum",
      txHash: "txHash",
      sourceToken: "asset",
      targetToken: "asset",
      preferredRouteName: "bridge",
    });
  });

  it("should get QS when there is a transactionId", () => {
    rewriteHref("https://portalbridge.com/#/?transactionId=transactionId");
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: null,
      sourceChain: null,
      targetChain: null,
      txHash: "transactionId",
      preferredRouteName: null,
      sourceToken: null,
      targetToken: null,
    });
  });

  it("should get QS when query contains numeric ids", () => {
    rewriteHref(
      "https://portalbridge.com/#/?sourceChain=4&targetChain=23&requiredNetwork=23"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: "Arbitrum",
      sourceChain: "Bsc",
      targetChain: "Arbitrum",
      txHash: null,
      preferredRouteName: null,
      sourceToken: null,
      targetToken: null,
    });
  });

  it("should get QS with difference between source and target assets", () => {
    rewriteHref(
      "https://portalbridge.com/#/?sourceChain=arbitrum&targetChain=ethereum&sourceAsset=USDCarbitrum&targetAsset=USDCeth&route=ManualCCTP"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      requiredNetwork: null,
      sourceChain: "Arbitrum",
      targetChain: "Ethereum",
      txHash: null,
      preferredRouteName: "ManualCCTP",
      sourceToken: "USDCarbitrum",
      targetToken: "USDCeth",
    });
  });
});

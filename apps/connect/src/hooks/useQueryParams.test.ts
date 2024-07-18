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
      asset: null,
      requiredNetwork: null,
      sourceChain: null,
      targetChain: null,
      txHash: null,
      route: null,
    });
  });

  it("should get QS when query contains all expected attrs after a hash #", () => {
    rewriteHref(
      "https://portalbridge.com/#/?sourceChain=bsc&targetChain=arbitrum&requiredNetwork=arbitrum&txHash=txHash&asset=asset&route=bridge"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      asset: "asset",
      requiredNetwork: "arbitrum",
      sourceChain: "bsc",
      targetChain: "arbitrum",
      txHash: "txHash",
      route: "bridge",
    });
  });

  it("should get QS when query contains all expected attrs when there is no hash", () => {
    rewriteHref(
      "https://portalbridge.com/?sourceChain=bsc&targetChain=arbitrum&requiredNetwork=arbitrum&txHash=txHash&asset=asset&route=bridge"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      asset: "asset",
      requiredNetwork: "arbitrum",
      sourceChain: "bsc",
      targetChain: "arbitrum",
      txHash: "txHash",
      route: "bridge",
    });
  });

  it("should get QS when there is a transactionId", () => {
    rewriteHref("https://portalbridge.com/#/?transactionId=transactionId");
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      asset: null,
      requiredNetwork: null,
      sourceChain: null,
      targetChain: null,
      txHash: "transactionId",
      route: null,
    });
  });

  it("should get QS when query contains numeric ids", () => {
    rewriteHref(
      "https://portalbridge.com/#/?sourceChain=4&targetChain=23&requiredNetwork=23"
    );
    const { result } = renderHook(() => useQueryParams());
    expect(result.current).toEqual({
      asset: null,
      requiredNetwork: "arbitrum",
      sourceChain: "bsc",
      targetChain: "arbitrum",
      txHash: null,
      route: null,
    });
  });
});

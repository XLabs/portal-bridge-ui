import { renderHook } from "@testing-library/react";
import { useFormatAssetParam } from "./useFormatAssetParam";

describe("useFormatAssetParam", () => {
  it("should get a formatted asset when key has an exact match", () => {
    const { result } = renderHook(() => useFormatAssetParam("BNB"));
    expect(result.current).toEqual("BNB");
  });

  it("should NOT get a formatted asset when key does NOT have an exact match", () => {
    const { result } = renderHook(() => useFormatAssetParam("BNB"));
    expect(result.current).toEqual("BNB");
  });

  it("should get a formatted asset using an address", () => {
    const { result } = renderHook(() =>
      useFormatAssetParam("0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd")
    );
    expect(result.current).toEqual("WBNB");
  });
});

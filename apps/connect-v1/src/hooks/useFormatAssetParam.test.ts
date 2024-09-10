import { renderHook } from "@testing-library/react";
import { useFormatAssetParam } from "./useFormatAssetParam";

describe("useFormatAssetParam", () => {
  it("should get a formatted asset when key has an exact match", () => {
    const { result } = renderHook(() => useFormatAssetParam("ETH"));
    expect(result.current).toEqual("ETH");
  });

  it("should NOT get a formatted asset when key does NOT have an exact match", () => {
    const { result } = renderHook(() => useFormatAssetParam("eth"));
    expect(result.current).toEqual("ETH");
  });

  it("should get a formatted asset using an address", () => {
    const { result } = renderHook(() =>
      useFormatAssetParam("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")
    );
    expect(result.current).toEqual("WETH");
  });
});

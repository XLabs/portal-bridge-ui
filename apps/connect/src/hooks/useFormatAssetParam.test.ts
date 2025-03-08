import { renderHook } from "@testing-library/react";
import { useFormatAssetParam } from "./useFormatAssetParam";

// Mock the wormhole-connect package
jest.mock("@xlabs/wormhole-connect", () => ({
  MAINNET: {
    tokens: [
      {
        symbol: "ETH",
        tokenId: {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756CKA",
        },
      },
      {
        symbol: "WETH",
        tokenId: {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        },
      },
    ],
  },
  TESTNET: {
    tokens: [],
  },
}));

// Mock the ENV import
jest.mock("@env", () => ({
  ENV: {
    wormholeConnectConfig: {
      network: "Mainnet",
      tokensConfig: {},
    },
  },
}));

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
      useFormatAssetParam("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
    );
    expect(result.current).toEqual("WETH");
  });
});

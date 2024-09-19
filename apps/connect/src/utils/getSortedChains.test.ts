import { Chain } from "@wormhole-foundation/sdk";
import { getSortedChains } from "./getSortedChains";
import topSymbolsByVolume from "./top-symbols-by-volume.json";

describe("getSortedChains", () => {
  let unsorted: Chain[];
  beforeEach(() => {
    unsorted = [
      "Wormchain",
      "Osmosis",
      "Ethereum",
      "Sui",
      "Aptos",
      "Kujira",
      "Evmos",
      "Bsc",
      "Polygon",
      "Avalanche",
      "Fantom",
      "Celo",
      "Moonbeam",
      "Base",
      "Arbitrum",
      "Optimism",
      "Scroll",
      "Xlayer" as any,
      "Mantle",
      "Solana",
      "Injective",
      "Klaytn",
    ];
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, json: async () => topSymbolsByVolume });
  });

  it("should get sorted chains", async () => {
    const result = await getSortedChains(unsorted);
    expect(result).not.toBe(unsorted);
    expect(result).toEqual([
      "Ethereum",
      "Solana",
      "Sui",
      "Arbitrum",
      "Moonbeam",
      "Bsc",
      "Avalanche",
      "Base",
      "Optimism",
      "Polygon",
      "Aptos",
      "Wormchain",
      "Klaytn",
      "Celo",
      "Fantom",
      "Scroll",
      "Injective",
      "Mantle",
      "Osmosis",
      "Kujira",
      "Evmos",
      "Xlayer",
    ]);
  });

  it("should get volume per chain when api fails", async () => {
    global.fetch = jest.fn().mockRejectedValue({});
    expect(await getSortedChains(unsorted)).toEqual(unsorted);
  });
});

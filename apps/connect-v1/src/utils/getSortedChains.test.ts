import { ChainName } from "@certusone/wormhole-sdk";
import { getSortedChains } from "./getSortedChains";
import topSymbolsByVolume from "./top-symbols-by-volume.json";

describe("getSortedChains", () => {
  let unsorted: ChainName[];
  beforeEach(() => {
    unsorted = [
      "wormchain",
      "osmosis",
      "ethereum",
      "sui",
      "aptos",
      "kujira",
      "evmos",
      "bsc",
      "polygon",
      "avalanche",
      "fantom",
      "celo",
      "moonbeam",
      "base",
      "arbitrum",
      "optimism",
      "scroll",
      "xlayer" as any,
      "mantle",
      "solana",
      "injective",
      "klaytn",
    ];
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, json: async () => topSymbolsByVolume });
  });

  it("should get sorted chains", async () => {
    const result = await getSortedChains(unsorted);
    expect(result).not.toBe(unsorted);
    expect(result).toEqual([
      "ethereum",
      "solana",
      "sui",
      "arbitrum",
      "moonbeam",
      "bsc",
      "avalanche",
      "base",
      "optimism",
      "polygon",
      "aptos",
      "wormchain",
      "klaytn",
      "celo",
      "fantom",
      "scroll",
      "injective",
      "mantle",
      "osmosis",
      "kujira",
      "evmos",
      "xlayer",
    ]);
  });

  it("should get volume per chain when api fails", async () => {
    global.fetch = jest.fn().mockRejectedValue({});
    expect(await getSortedChains(unsorted)).toEqual(unsorted);
  });
});

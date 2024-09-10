import { isValidAddress } from "./isValidAddress";

jest.mock("aptos", () => {
  class AptosClient {
    getAccount = jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockRejectedValue("error");
  }
  return { AptosClient };
});

describe("isValidAddress", () => {
  it("should check solana addresses", async () => {
    expect(
      await isValidAddress(
        "FuX2KgSnaPDyQMfCi6pdGYYrWQTkTtfC5obykSTDU4pS",
        "solana"
      )
    ).toEqual(true);
    expect(await isValidAddress("invalid", "solana")).toEqual(false);
  });

  it("should check aptos addresses", async () => {
    expect(
      await isValidAddress(
        "FuX2KgSnaPDyQMfCi6pdGYYrWQTkTtfC5obykSTDU4pS",
        "solana"
      )
    ).toEqual(true);
    expect(await isValidAddress("valid", "aptos")).toEqual(true);
    expect(await isValidAddress("invalid", "aptos")).toEqual(false);
    expect(await isValidAddress("error", "aptos")).toEqual(false);
  });

  it("should check sui addresses", async () => {
    expect(
      await isValidAddress(
        "0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331",
        "sui"
      )
    ).toEqual(true);
    expect(
      await isValidAddress(
        "0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f3",
        "sui"
      )
    ).toEqual(false);
    expect(await isValidAddress("invalid", "sui")).toEqual(false);
  });

  it("should check cosmos addresses", async () => {
    expect(await isValidAddress("0x02a21223de05f3", "evmos")).toEqual(false);
    expect(
      await isValidAddress(
        "0x00726B9BfE72607E1A94492eA50814e073df2BC3",
        "evmos"
      )
    ).toEqual(true);
    expect(await isValidAddress("invalid", "injective")).toEqual(false);
    expect(
      await isValidAddress(
        "inj10n6q5cxrjperasknfsh77ge3fkpsamfzw4jhdq",
        "injective"
      )
    ).toEqual(true);
  });

  it("should check evm addresses", async () => {
    expect(await isValidAddress("0x02a21223de05f3", "ethereum")).toEqual(false);
    expect(
      await isValidAddress(
        "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326",
        "ethereum"
      )
    ).toEqual(true);
    expect(await isValidAddress(undefined as any, "ethereum")).toEqual(false);
  });

  it("should check unknown chains addresses", async () => {
    expect(
      await isValidAddress(
        "FuX2KgSnaPDyQMfCi6pdGYYrWQTkTtfC5obykSTDU4pS",
        "unknown" as any
      )
    ).toEqual(false);
  });
});

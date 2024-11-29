import { getDuneInfo } from "./getDuneInfo";

describe("getDuneInfo", () => {
  it("should return an array of TokenInfo", async () => {
    const queryId = 4126080;
    const result = await getDuneInfo(queryId, true);
  });
});
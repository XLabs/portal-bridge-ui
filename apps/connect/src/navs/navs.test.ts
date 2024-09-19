// import { clearUrl, pushResumeUrl } from "./navs";

// const EMPTY_TOKEN = {
//   symbol: "empty",
//   tokenId: {
//     address: "empty",
//     chain: "empty",
//   },
// };

describe("navs", () => {
  beforeEach(() => {
    global.window.history.pushState = jest.fn();
  });

  afterEach(() => {
    (global.window.history.pushState as jest.Mock).mockClear();
  });
  // TODO: Include txId in connect v2 and uncomment the tests
  it("should update the URL when a transfer starts with a permlink", () => {});
  /*  it("should update the URL when a transfer starts with a permlink", () => {
    pushResumeUrl({
      type: "transfer.start",
      details: {
        fromChain: "bsc",
        txId: "txId",
        route: "bridge" as any,
        fromToken: EMPTY_TOKEN,
        toToken: EMPTY_TOKEN,
        toChain: 1,
      },
    });
    expect(global.window.history.pushState).toHaveBeenCalledWith(
      { event: "transfer.start" },
      "Start Transfer",
      "?sourceChain=bsc&transactionId=txId"
    );
  });

  it("should clear the URL when an automatic transfer success", () => {
    clearUrl({
      type: "transfer.success",
      details: {
        fromChain: "bsc",
        txId: "txId",
        route: "bridge" as any,
        fromToken: EMPTY_TOKEN,
        toToken: EMPTY_TOKEN,
        toChain: 1,
      },
    });
    expect(global.window.history.pushState).toHaveBeenCalledWith(
      { event: "transfer.success" },
      "Transfer Success",
      "/"
    );
  });

  it("should clear the URL when an redeemed transfer success", () => {
    clearUrl({
      type: "transfer.redeem.success",
      details: {
        fromChain: "bsc",
        txId: "txId",
        route: "bridge" as any,
        fromToken: EMPTY_TOKEN,
        toToken: EMPTY_TOKEN,
        toChain: 1,
      },
    });
    expect(global.window.history.pushState).toHaveBeenCalledWith(
      { event: "transfer.redeem.success" },
      "Transfer Success",
      "/"
    );
  });*/
});

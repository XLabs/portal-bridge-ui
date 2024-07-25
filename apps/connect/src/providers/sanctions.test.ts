import {
  ACCOUNT_ID,
  RISK_ADDRESS_INDICATOR_TYPE,
  RISK_LEVEL_SANCTION,
  SanctionResponse,
  TRM_URL,
  validateTransferHandler,
} from "./sanctions";

describe("sanctions", () => {
  let transferDetails: Parameters<typeof validateTransferHandler>[0];
  let validResponse: SanctionResponse;
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn() });
    transferDetails = {
      fromChain: "fromChain",
      fromWalletAddress: "fromWalletAddress",
      toChain: "toChain",
      toWalletAddress: "toWalletAddress",
    } as any;
    validResponse = {
      addressRiskIndicators: [
        {
          categoryRiskScoreLevel: RISK_LEVEL_SANCTION - 1,
          riskType: RISK_ADDRESS_INDICATOR_TYPE,
        },
      ],
      entities: [{ riskScoreLevel: RISK_LEVEL_SANCTION - 1 }],
    };
  });

  it("should be valid when no address is sanctioned", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([validResponse]),
    });
    expect(await validateTransferHandler(transferDetails)).toEqual({
      isValid: true,
    });
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      TRM_URL,
      expect.objectContaining({
        body: JSON.stringify([
          {
            address: transferDetails.fromWalletAddress,
            chain: transferDetails.fromChain,
            accountExternalId: ACCOUNT_ID,
          },
        ]),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      TRM_URL,
      expect.objectContaining({
        body: JSON.stringify([
          {
            address: transferDetails.toWalletAddress,
            chain: transferDetails.toChain,
            accountExternalId: ACCOUNT_ID,
          },
        ]),
      })
    );
  });

  it("should be valid when api fails", async () => {
    console.error = jest.fn();
    global.fetch = jest.fn().mockRejectedValue({});
    expect(await validateTransferHandler(transferDetails)).toEqual({
      isValid: true,
    });
  });

  it("should be valid when api returns unexpected data", async () => {
    console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ random: true }),
    });

    expect(await validateTransferHandler(transferDetails)).toEqual({
      isValid: true,
    });
  });

  it("should NOT be valid when one address is NOT valid because of the address risk level", async () => {
    const json = jest
      .fn()
      .mockResolvedValueOnce([validResponse])
      .mockResolvedValueOnce([
        {
          ...validResponse,
          addressRiskIndicators: [
            ...validResponse.addressRiskIndicators,
            {
              categoryRiskScoreLevel: RISK_LEVEL_SANCTION,
              riskType: RISK_ADDRESS_INDICATOR_TYPE,
            },
          ],
        },
      ]);
    global.fetch = jest.fn().mockResolvedValue({ json });

    expect(await validateTransferHandler(transferDetails)).toEqual({
      isValid: false,
    });
  });

  it("should NOT be valid when one address is NOT valid because of the entity risk level", async () => {
    const json = jest
      .fn()
      .mockResolvedValueOnce([validResponse])
      .mockResolvedValueOnce([
        {
          ...validResponse,
          entities: [
            ...validResponse.entities,
            { riskScoreLevel: RISK_LEVEL_SANCTION },
          ],
        },
      ]);
    global.fetch = jest.fn().mockResolvedValue({ json });

    expect(await validateTransferHandler(transferDetails)).toEqual({
      isValid: false,
    });
  });
});

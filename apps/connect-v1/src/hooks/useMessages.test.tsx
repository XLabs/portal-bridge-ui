import { renderHook, waitFor } from "@testing-library/react";
import { useMessages } from "./useMessages";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useMessages", () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ status: 200, json: async () => [] });
  });

  it("should get relevant parsed messages", async () => {
    const irrelevant = {
      id: "first",
      background: "yellow",
      content: { color: "black", text: "first message" },
      since: Date.now() - 5000,
      until: Date.now() - 4000,
    };
    const relevant = {
      id: "second",
      background: "green",
      content: { color: "white", text: "second message" },
      since: Date.now() - 1000,
      until: Date.now() + 1000,
    };
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => [irrelevant, relevant],
    });
    const { result } = renderHook(() => useMessages(), { wrapper: Wrapper });

    expect(result.current).toEqual(undefined);
    await waitFor(() => {
      expect(result.current).toEqual([
        {
          background: "green",
          button: undefined,
          content: { color: "white", size: undefined, text: "second message" },
          id: "second",
          since: expect.any(Date),
          until: expect.any(Date),
        },
      ]);
    });
  });

  it("should fallback to an empty array when fetching fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 500 });
    const { result } = renderHook(() => useMessages(), { wrapper: Wrapper });

    expect(result.current).toEqual(undefined);
    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });
});

import { renderHook } from "@testing-library/react";
import { Message, useBannerMessageConfig } from "./useBannerMessageConfig";

describe("useBannerMessageConfig", () => {
  let messages: Message[];

  beforeEach(() => {
    messages = [
      { start: new Date(Date.now() + 3000) },
      {
        start: new Date(Date.now() - 2000),
        ends: new Date(Date.now() + 2000),
      },
      { ends: new Date(Date.now() + 3000) },
      { start: new Date(Date.now() - 3000) },
      {
        start: new Date(Date.now() + 2000),
        ends: new Date(Date.now() + 4000),
      },
      { ends: new Date(Date.now() + 4000) },
      { ends: new Date(Date.now() - 4000) },
      { start: new Date(Date.now() + 4000) },
    ].map((m, i) => ({
      ...m,
      background: `bg_${i}`,
      content: <p>index {i}</p>,
    }));
  });

  it("should get as a first priority a message that has no start date and ends in the future", () => {
    const { result } = renderHook(() => useBannerMessageConfig(messages));
    expect(result.current).toEqual(messages[2]);
  });

  it("should get as a second priority a message that has not started and ends in the future", () => {
    const { result } = renderHook(() =>
      useBannerMessageConfig([
        messages[0],
        messages[1],
        /** messages[2] this one would be the priority if set */
        messages[3],
        messages[4],
        messages[5],
        messages[6],
        messages[7],
      ])
    );
    expect(result.current).toEqual(messages[5]);
  });

  it("should return null when no message matches the criteria", () => {
    const { result } = renderHook(() =>
      useBannerMessageConfig([messages[0], messages[6]])
    );
    expect(result.current).toEqual(null);
  });
});

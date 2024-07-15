import { isObject } from "./isObject";

describe("isObject", () => {
  it("should return true on valid objects", () => {
    expect(isObject({})).toBe(true);
  });

  it("should return false on invalid objects", () => {
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject("random")).toBe(false);
  });
});

import { mergeTruthy } from "./mergeTruthy";

describe("mergeTruthy", () => {
  it("should merge using values from A and B only when B is truthy", () => {
    const a = { a: 1, b: 2, c: 5 };
    const b = { a: undefined, b: 3, c: 0 };
    expect(mergeTruthy(a, b as unknown)).toEqual({ a: 1, b: 3, c: 0 });
  });

  it("should merge deeply", () => {
    const a = { a: 1, b: { c: 2, d: 3 } };
    const b = { a: 4, b: { c: undefined, d: 6 } };
    expect(mergeTruthy(a, b as unknown)).toEqual({ a: 4, b: { c: 2, d: 6 } });
  });

  it("should NOT merge deeply when value is an array", () => {
    const a = { a: 1, b: [1, 2, 3] };
    const b = { a: undefined, b: [4] };
    expect(mergeTruthy(a, b as unknown)).toEqual({ a: 1, b: [4] });
  });

  it("should create new references for objects", () => {
    const a = { a: 1, b: { c: 2, d: 3 } };
    const b = { a: 4, b: { c: undefined, d: 6 } };
    const c = mergeTruthy(a, b as unknown);
    expect(c).toEqual({ a: 4, b: { c: 2, d: 6 } });
    expect(c.b).not.toBe(a.b);
    expect(c.b).not.toBe(b.b);
  });

  it("should merge using a custom is truthy function", () => {
    const a = { a: 1, b: 2 };
    const b = { a: 3, b: 4 };
    const fn = (arg: unknown) => arg !== 4;
    expect(mergeTruthy(a, b, fn)).toEqual({ a: 3, b: 2 });
  });
});

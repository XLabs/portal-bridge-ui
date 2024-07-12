import { isObject } from "./isObject";

/** deep merges args with a condition per node returning a new instance */
export const mergeTruthy = <T>(
  a: Partial<T>,
  b: Partial<T>,
  isTruthy = (arg: any) => ![null, undefined].includes(arg)
): T => {
  const shouldLoop = isObject(a) && isObject(b);
  if (!shouldLoop) return (isTruthy(b) ? b : a) as T;
  const keyList = Array.from(new Set([...Object.keys(a!), ...Object.keys(b!)]));

  return keyList.reduce((total, key) => {
    total[key] = mergeTruthy(a[key], b[key], isTruthy);
    return total;
  }, {}) as T;
};

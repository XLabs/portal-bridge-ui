/* eslint @typescript-eslint/no-explicit-any: 0 */
import { isObject } from "./isObject";

/** deep merges args with a condition per node returning a new instance */
export const mergeDeep = <T>(
  a: Partial<T>,
  b: Partial<T>,
  isTruthy = (arg: any) => ![null, undefined].includes(arg)
): T => {
  const shouldLoop = isObject(a) && isObject(b);
  if (!shouldLoop) return (isTruthy(b) ? b : a) as T;
  const keyList = Array.from(new Set([...Object.keys(a!), ...Object.keys(b!)]));

  return keyList.reduce(
    (total, key) => ({
      ...total,
      [key]: mergeDeep((a as any)[key], (b as any)[key], isTruthy),
    }),
    {} as T
  ) as T;
};

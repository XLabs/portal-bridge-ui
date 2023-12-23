import { useMediaQuery } from "@uidotdev/usehooks";

const breakpoints = {
  base: "(min-width: 0px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export const useBreakpointQuery = (bp: keyof typeof breakpoints) => {
  return useMediaQuery(breakpoints[bp]);
};

export const useBreakpoint = () => {
  const queries = {
    sm: useMediaQuery(breakpoints.sm),
    md: useMediaQuery(breakpoints.md),
    lg: useMediaQuery(breakpoints.lg),
    xl: useMediaQuery(breakpoints.xl),
    "2xl": useMediaQuery(breakpoints["2xl"]),
  };

  return (
    Object.entries(queries)
      .find(([, val]) => val)
      ?.shift() || "base"
  );
};

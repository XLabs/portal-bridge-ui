import styled from "@mui/material/styles/styled";

export type GlowProps = {
  position: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
  size: {
    width?: string;
    height?: string;
  };
  background: string;
};

const Glow = styled("div")<GlowProps>(
  ({
    position: { top, left, bottom, right } = {},
    size: { width, height } = {},
    background,
  }) => ({
    position: "absolute",
    borderRadius: width,
    background,
    backdropFilter: "blur(12px)",
    width,
    height,
    flexShrink: 0,
    zIndex: -1,
    top,
    bottom,
    left,
    right,
  })
);

export default Glow;

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
  children?: JSX.Element[] | JSX.Element;
};

export const Glow = ({
  position: { top, left, bottom, right } = {},
  size: { width, height } = {},
  background,
  children,
}: GlowProps) => {
  return (
    <div
      className="scrollbar-hide"
      style={{
        overflowY: "hidden",
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
      }}
    >
      {children}
    </div>
  );
};
export default Glow;

export type EllipsisProps = {
  width: number;
  height: number;
  marginTop: number;
  marginLeft: number;
  children?: JSX.Element[] | JSX.Element;
};

export const Ellipsis = ({
  width,
  height,
  marginTop,
  marginLeft,
  children,
}: EllipsisProps) => {
  return (
    <div
      className="absolute scrollbar-hide overflow-hidden"
      style={{
        width,
        height,
        marginTop: marginTop,
        marginLeft: marginLeft,
      }}
    >
      <svg
        className="absolute"
        width={`${width}`}
        height={`${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="linearGradientRings"
            x="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(255,255,255,0.25)" />
            <stop offset="80%" stopColor="rgb(255,255,255,0)" />
          </linearGradient>
        </defs>
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width / 2}
          ry={height / 2}
          fill="rgb(0,0,0,0)"
          stroke="url(#linearGradientRings)"
        />
      </svg>
      {children}
    </div>
  );
};

export default Ellipsis;

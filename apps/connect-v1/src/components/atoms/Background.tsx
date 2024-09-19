import { PropsWithChildren } from "react";
import styled from "@mui/material/styles/styled";

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
}));

const ContainerFooter = styled("div")(() => ({
  display: "column",
  flexDirection: "row",
  alignItems: "flex-end",
}));

const Elipsis = styled("div")<{
  width: number;
  height: number;
  marginTop: number;
  marginLeft: number;
}>(({ width, height, marginTop, marginLeft }) => ({
  width,
  height,
  borderColor: "rgb(255, 255, 255, 0.5)",
  borderWidth: "0.5px",
  borderStyle: "solid",
  borderRadius: "50%",
  marginTop: marginTop,
  marginLeft: marginLeft,
}));

const Glow = styled("div")<{
  position: { top?: string; left?: string; bottom?: string; right?: string };
  size: { width?: string; height?: string };
  background: string;
}>(
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

export const Background = ({ children }: PropsWithChildren) => {
  return (
    <Container>
      {children}
      <ContainerFooter>
        <Glow
          position={{
            top: "-661px",
            left: "-503px",
          }}
          size={{
            width: "1175px",
            height: "1169px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, #3B234E 0%, rgba(59, 35, 78, 0.00) 100%)"
        />
        <Glow
          position={{
            top: "13.47%",
            left: "17.55%",
          }}
          size={{
            width: "909px",
            height: "905px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(30, 50, 90, 0.50) 0%, rgba(90, 30, 70, 0.00) 100%)"
        />
        <Glow
          position={{
            bottom: "-241px",
            right: "-376px",
          }}
          size={{
            width: "879px",
            height: "875px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(48, 42, 96, 0.70) 0%, rgba(48, 42, 96, 0.00) 100%)"
        >
          <Elipsis width={657} height={657} marginTop={310} marginLeft={203}>
            <Elipsis width={524} height={524} marginTop={16} marginLeft={41}>
              <Elipsis width={392} height={392} marginTop={45} marginLeft={38}>
                <Elipsis
                  width={280}
                  height={280}
                  marginTop={33}
                  marginLeft={32}
                />
              </Elipsis>
            </Elipsis>
          </Elipsis>
        </Glow>
      </ContainerFooter>
    </Container>
  );
};

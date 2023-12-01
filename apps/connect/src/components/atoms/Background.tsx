import styled from "@mui/material/styles/styled";
import Glow from "./Glow";
import Elipsis from "./Elipsis";
import BuiltBy from "./BuiltBy";
import Version from "./Version";

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

export default function Background({ children }: { children: JSX.Element[] }) {
  return (
    <Container>
      {children}
      <ContainerFooter>
        <BuiltBy />
        <Version />
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
}

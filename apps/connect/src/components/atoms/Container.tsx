import { styled } from "@mui/system";
import { memo, PropsWithChildren } from "react";
import { Background } from "./Background";

const InnerWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "100vh",
  width: "100%",
  maxWidth: 1440,
  margin: "auto",
  padding: `${theme.spacing(3)} `,
}));

export const Wrapper = memo(({ children }: PropsWithChildren) => {
  return (
    <Background>
      <InnerWrapper>{children}</InnerWrapper>
    </Background>
  );
});

export const Main = styled("main")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

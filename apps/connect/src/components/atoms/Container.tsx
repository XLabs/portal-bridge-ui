import { styled } from "@mui/system";
import bg from "../../assets/imgs/bg.png";
import { memo, PropsWithChildren } from "react";

const OuterWrapper = styled("div")(() => ({
  backgroundImage: `url(${bg})`,
  backgroundRepeat: "no-repeat",
  backgroundPositionY: "100%",
  backgroundPositionX: "100%",
  backgroundAttachment: "fixed",
}));

const InnerWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 1440,
  margin: "auto",
  minHeight: "100vh",
  padding: `${theme.spacing(3)} `,
}));

export const Wrapper = memo(({ children }: PropsWithChildren) => {
  return (
    <OuterWrapper>
      <InnerWrapper>{children}</InnerWrapper>
    </OuterWrapper>
  );
});

export const Main = styled("main")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

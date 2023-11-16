import styled from "@mui/material/styles/styled";

export type BarProps = {
  background: string;
  children: JSX.Element[] | null;
};

const Container = styled("div")<Pick<BarProps, "background">>(
  ({ theme, background }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "56px",
    [theme.breakpoints.down("md")]: {
      height: "auto",
      flexDirection: "column",
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    textAlign: "center",
    fontWeight: 500,
    fontSize: "16px",
    letterSpacing: "0.02em",
    background,
  })
);

export default function Bar({ background, children }: BarProps) {
  return <Container background={background}>{children}</Container>;
}

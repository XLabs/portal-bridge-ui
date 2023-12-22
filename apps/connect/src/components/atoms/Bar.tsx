import styled from "@mui/material/styles/styled";

export type BarProps = {
  background: string;
  color?: string;
  size?: string;
  children: string[] | JSX.Element | JSX.Element[] | null;
};

const Container = styled("div")<BarProps>(
  ({ theme, background, color, size }) => ({
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
    color: color || theme.palette.text.primary,
    fontSize: size || "16px",
    letterSpacing: "0.02em",
    background,
    marginBottom: theme.spacing(0.5),
  })
);

export default function Bar({ background, color, size, children }: BarProps) {
  return (
    <Container background={background} color={color} size={size}>
      {children}
    </Container>
  );
}

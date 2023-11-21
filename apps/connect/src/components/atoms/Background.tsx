import styled from "@mui/material/styles/styled";

/*
const GradientRight = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "72px",
  right: "-1000px",
  width: "1757px",
  height: "1506px",
  background:
    "radial-gradient(closest-side at 50% 50%, #FFCE00 0%, #FFCE0000 100%)",
  opacity: "0.2",
  transform: "matrix(0.87, 0.48, -0.48, 0.87, 0, 0)",
  zIndex: -1,
  pointerEvent: "none",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const GradientRightBottom = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "-900px",
  right: "-1000px",
  width: "1757px",
  height: "1506px",
  background:
    "radial-gradient(closest-side at 50% 50%, #FFCE00 0%, #FFCE0000 100%)",
  opacity: "0.24",
  transform: "matrix(0.87, 0.48, -0.48, 0.87, 0, 0);",
  zIndex: -1,
  pointerEvent: "none",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const GradientLeft = styled("div")(() => ({
  top: "-530px",
  left: "-350px",
  width: "1379px",
  height: "1378px",
  position: "absolute",
  background:
    "radial-gradient(closest-side at 50% 50%, #F44B1B 0%, #F44B1B00 100%)",
  opacity: "0.2",
  zIndex: -1,
  pointerEvent: "none",
}));

const GradientLeftBottom = styled("div")(({ theme }) => ({
  bottom: "-330px",
  left: "-350px",
  width: "1379px",
  height: "1378px",
  position: "absolute",
  background:
    "radial-gradient(closest-side at 50% 50%, #F44B1B 0%, #F44B1B00 100%)",
  opacity: "0.2",
  zIndex: -1,
  pointerEvent: "none",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
*/

const Container = styled("div")(() => ({
  color: "#0A0629",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
}));

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      {children}
    </Container>
  );
}

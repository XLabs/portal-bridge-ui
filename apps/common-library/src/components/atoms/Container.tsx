import { styled } from "@mui/system";

export const Wrapper = styled("div")(({ theme }) => ({
    margin: "auto",
    width: "100%",
    maxWidth: 1440,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: `${theme.spacing(3)} `,
  }));
  
export const Main = styled("main")(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  }));
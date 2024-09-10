import { styled } from "@mui/material";
import { NAVBAR_WIDTH } from "./NavBar";

export const Container = styled("div")(({ theme }) => ({
  paddingRight: `${NAVBAR_WIDTH}px`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
  },
}));

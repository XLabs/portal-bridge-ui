import styled from "@mui/material/styles/styled";
import MuiLink from "@mui/material/Link";
import { COLOR } from "../../theme/portal";

export const Link = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: '"Poppins", regular',
  color: COLOR.whiteWithTransparency,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
  transition: "color 0.3s",
  ":hover": {
    color: COLOR.white,
  },
}));

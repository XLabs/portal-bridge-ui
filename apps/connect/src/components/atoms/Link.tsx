import styled from "@mui/material/styles/styled";
import MuiLink from "@mui/material/Link";

import { COLOR, FONT_SIZE } from "../../theme/portal";

export const Link = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: FONT_SIZE.S,
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

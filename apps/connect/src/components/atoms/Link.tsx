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
    paddingTop: 8,
    paddingBottom: 8,
    lineHeight: "45px",
  },
  transition: "color 0.3s",
  ":hover": {
    color: COLOR.white,
  },
}));

export const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
}));

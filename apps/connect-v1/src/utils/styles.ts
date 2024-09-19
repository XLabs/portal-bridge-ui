import { styled, Link as MuiLink, LinkProps } from "@mui/material";
import { LinkProps as RouterLinkProps } from "react-router-dom";

export const Link = styled(MuiLink)<LinkProps & RouterLinkProps>(() => ({
  color: "white",
  textDecoration: "underline",
  fontWeight: 500,
}));

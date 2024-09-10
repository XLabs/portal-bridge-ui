import { styled, Link as MuiLink, LinkProps } from "@mui/material";
import { LinkProps as RouterLinkProps } from "react-router-dom";

type CombinedLinkProps = LinkProps & RouterLinkProps;

export const Link = styled(MuiLink)<CombinedLinkProps>(() => ({
  color: "white",
  textDecoration: "underline",
  fontWeight: 500,
}));

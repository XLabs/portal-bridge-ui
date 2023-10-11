import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import styled from "@mui/material/styles/styled";
import { useLocation, NavLink as NavLinkRouter, NavLinkProps as NavLinkRouterProps } from "react-router-dom";

const ContentBar = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "56px",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "16px",
  letterSpacing: "0.02em",
  background:
    "linear-gradient(20deg, rgb(244, 75, 27) 0%, rgb(238, 180, 48) 100%);",
}));

const Link = styled(MuiLink)<MuiLinkProps & NavLinkRouterProps>(() => ({
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 20,
  padding: "6px 12px",
  backgroundColor: "white",
  color: "rgb(244, 123, 72);",
  marginLeft: "8px",
  fontSize: "12px",
  letterSpacing: "0.08em",
  fontWeight: 600,
  minHeight: "32px",
  minWidth: "fit-content",
  fontFamily: "Poppins",
  wordWrap: "break-word",
}));

export default function NewsBar() {
  const { pathname } = useLocation();
  return pathname === "/usdc" ? null : (
    <ContentBar>
      Experience frictionless USDC transfers between Ethereum, Avalanche,
      Arbitrum, and Optimism with Circle's CCTP.
      <Link component={NavLinkRouter} to="/usdc" target="_blank" rel="noopener noreferrer" color="inherit">
        TRY IT NOW
      </Link>
    </ContentBar>
  );
}

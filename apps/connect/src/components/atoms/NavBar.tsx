import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import MuiLink, { LinkProps } from "@mui/material/Link";

import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import styled from "@mui/material/styles/styled";
import {
  NavLink as NavRouterLink,
  NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import portal from "../../assets/imgs/logo-white.svg";
import { HelpOutline } from "@mui/icons-material";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  background: "transparent",
  marginTop: theme.spacing(2),
  "& > .MuiToolbar-root": {
    margin: "auto",
    width: "100%",
    maxWidth: 1440,
  },
  boxShadow: "none",
}));

const NavLink = styled(MuiLink)<LinkProps & RouterNavLinkProps>(
  ({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: 600,
    fontFamily: "Suisse BP Intl, sans-serif",
    color: "white",
    marginLeft: theme.spacing(4),
    textUnderlineOffset: "6px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2.5),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1),
    },
    ":hover": {
        textDecoration: "underline"
    },
    ".active": {
        textDecoration: "underline"
    }
  })
);

const Logo = styled("img")(({ theme }) => ({
  height: 68,
  "&:hover": {
    filter: "contrast(1)",
  },
  verticalAlign: "middle",
  marginRight: theme.spacing(1),
  display: "inline-block",
}));

const Spacer = styled("div")(() => ({
  flex: 1,
  width: "100vw",
}));

export default function NavBar() {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <MuiLink component={NavRouterLink} to="/">
          <Logo src={portal} alt="Portal" />
        </MuiLink>
        <Spacer />
        <Hidden implementation="css" xsDown>
          <div style={{ display: "flex", alignItems: "center" }}>
            <NavLink
              component={NavRouterLink}
              style={({ isActive }) => ({ textDecoration: isActive ? "underline" : "none" })}
              to="/"
              color="inherit"
            >
              Token Bridge
            </NavLink>
            <NavLink
              component={NavRouterLink}
              style={({ isActive }) => ({ textDecoration: isActive ? "underline" : "none" })}
              to="docs"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              FAQ
            </NavLink>
            <NavLink
              to="https://www.wormhole.com/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              Wormhole
            </NavLink>
          </div>
        </Hidden>
        <Hidden implementation="css" smUp>
          <Tooltip title="View the FAQ">
            <IconButton
              component={NavRouterLink}
              to="docs"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              <HelpOutline />
            </IconButton>
          </Tooltip>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

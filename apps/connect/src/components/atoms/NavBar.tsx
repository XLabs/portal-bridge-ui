import { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import MuiLink from "@mui/material/Link";
import styled from "@mui/material/styles/styled";
import MenuIcon from "@mui/icons-material/Menu";

import { ENV } from "@env";
import { Logo } from "./Logo";
import { COLOR } from "../../theme/portal";
import { Link } from "./Link";

export const NAVBAR_WIDTH = 110;

const AppBar = styled(MuiAppBar)(() => ({
  background: "transparent",
  boxShadow: "none",
  margin: 0,
}));

const Nav = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const LogoContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
}));

const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: theme.spacing(2),
  },
}));

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <AppBar position="static" color="inherit">
      <Nav>
        <LogoContainer>
          <MuiLink href={import.meta.env.BASE_URL}>
            <Logo />
          </MuiLink>
          <Hidden implementation="css" smUp={true}>
            <MenuIcon onClick={() => setOpenMenu(!openMenu)} />
          </Hidden>
        </LogoContainer>

        <Hidden implementation="css" smDown={!openMenu} smUp={false}>
          <LinkContainer>
            {[
              ...ENV.navBar,
              // {
              //   label: "Wormholescan",
              //   isBlank: true,
              //   active: false,
              //   href: `https://wormholescan.io${ENV.wormholeConnectConfig.env === "Testnet" ? "/#/?network=TESTNET" : ""}`,
              // },
              {
                label: "Advanced Tools",
                isBlank: true,
                href: `${ENV.PUBLIC_URL}/advanced-tools/`,
              },
            ].map(({ label, active, href, isBlank }, idx) => (
              <Link
                key={`${label}_${idx}`}
                href={href}
                sx={
                  !active ? undefined : { color: COLOR.white, fontWeight: 500 }
                }
                target={isBlank ? "_blank" : "_self"}
              >
                {label}
              </Link>
            ))}
          </LinkContainer>
        </Hidden>
      </Nav>
    </AppBar>
  );
};

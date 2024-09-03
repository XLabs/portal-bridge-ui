import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import MuiLink from "@mui/material/Link";
import styled from "@mui/material/styles/styled";

import MenuIcon from "@mui/icons-material/Menu";

import { useState } from "react";
import { ENV } from "@env";
import { Logo } from "./Logo";
import { COLOR } from "../../theme/portal";
import { Link } from "./Link";

const AppBar = styled(MuiAppBar)(() => ({
  background: "transparent",
  boxShadow: "none",
  margin: 0,
}));

const TopBar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const LogoContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: theme.spacing(2),
  },
}));

const links = [
  ...ENV.navBar,
  {
    label: "Wormholescan",
    isBlank: true,
    active: false,
    href: `https://wormholescan.io${ENV.wormholeConnectConfig.env === "testnet" ? "/#/?network=TESTNET" : ""}`,
  },
];

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <AppBar position="static" color="inherit">
      <TopBar>
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
            {links.map(({ label, active, href, isBlank }, idx) => (
              <Link
                key={`${label}_${idx}`}
                href={href}
                sx={{
                  color: active ? COLOR.white : COLOR.whiteWithTransparency,
                }}
                target={isBlank ? "_blank" : "_self"}
              >
                {label}
              </Link>
            ))}
          </LinkContainer>
        </Hidden>
      </TopBar>
    </AppBar>
  );
};

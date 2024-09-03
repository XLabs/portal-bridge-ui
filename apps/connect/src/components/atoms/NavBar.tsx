import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import MuiLink from "@mui/material/Link";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { useState } from "react";
import { ENV } from "@env";
import { Logo } from "./Logo";
import { COLOR } from "../../theme/portal";
import { Link, LinkContainer } from "./Link";

const AppBar = styled(MuiAppBar)(() => ({
  background: "transparent",
  boxShadow: "none",
  margin: 0,
}));

const ListItem = styled(MuiListItem)(() => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

const Spacer = styled("div")(() => ({ flex: 1, width: "100vw" }));
const TopBar = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const wormholescanButton = (
  <Box>
    <Link
      href={`https://wormholescan.io${ENV.wormholeConnectConfig.env === "testnet" ? "/#/?network=TESTNET" : ""}`}
      target="_blank"
      color="inherit"
    >
      Wormholescan
    </Link>
  </Box>
);

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <AppBar position="static" color="inherit">
      <TopBar>
        <MuiLink href={import.meta.env.BASE_URL}>
          <Logo />
        </MuiLink>
        <Spacer />
        <Hidden implementation="css" smDown={true}>
          <LinkContainer>
            {ENV.navBar.map(({ label, active, href, isBlank }, idx) => (
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
            {wormholescanButton}
          </LinkContainer>
        </Hidden>
        <Hidden implementation="css" smUp={true}>
          <MenuIcon
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          />
        </Hidden>
      </TopBar>
      {openMenu && (
        <Hidden implementation="css" smUp={true}>
          <List>
            {ENV.navBar.map(({ label, href }, idx) => (
              <ListItem key={`${label}_${idx}`}>
                <ListItemButton component="a" href={href}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>
              <ListItem>{wormholescanButton}</ListItem>
            </ListItem>
          </List>
        </Hidden>
      )}
    </AppBar>
  );
};

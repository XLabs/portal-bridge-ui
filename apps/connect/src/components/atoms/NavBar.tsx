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
import { Collapse, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

const SubMenu = styled(MenuItem)(() => ({
  paddingLeft: 1,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  display: "flex",
  fontSize: 14,
  gap: 4,
  maxHeight: 20,
  color: COLOR.whiteWithTransparency,
  fontWeight: 400,
  transition: "color 0.3s",
  ":hover": {
    color: COLOR.white,
  },
}));

const Section = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
}));

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [items, setItems] = useState([...ENV.navBar]);
  const openSubMenuHandler = (index: number) => {
    const newItems = [...items];
    const item = newItems[index];
    if (item && item.subMenu) {
      item.subMenu.open = !item.subMenu?.open;
      newItems[index] = item;
      setItems(newItems);
    }
  };
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
              ...items,
              // {
              //   label: "Wormholescan",
              //   isBlank: true,
              //   active: false,
              //   href: `https://wormholescan.io${ENV.wormholeConnectConfig.env === "Testnet" ? "/#/?network=TESTNET" : ""}`,
              // },
            ].map(({ label, active, href, isBlank, subMenu }, idx) =>
              !subMenu ? (
                <Link
                  key={`${label}_${idx}`}
                  href={href}
                  sx={
                    !active
                      ? undefined
                      : { color: COLOR.white, fontWeight: 500 }
                  }
                  target={isBlank ? "_blank" : "_self"}
                >
                  {label}
                </Link>
              ) : (
                <Section>
                  <SubMenu
                    onClick={() => openSubMenuHandler(idx)}
                    sx={!subMenu.open ? undefined : { color: COLOR.white }}
                  >
                    <CloseIcon
                      sx={{
                        width: 16,
                        transition: "transform 0.15s",
                        ...(!subMenu.open
                          ? { transform: "rotate(45deg)" }
                          : { transform: "rotate(0deg)" }),
                      }}
                    />
                    <div>{label}</div>
                  </SubMenu>
                  <Collapse in={subMenu.open} timeout="auto" unmountOnExit>
                    {subMenu.content.map(({ label, href }, idx) => (
                      <Link
                        key={`${label}_${idx}`}
                        href={href}
                        sx={{
                          pl: 3,
                          ...(!active
                            ? undefined
                            : { color: COLOR.white, fontWeight: 500 }),
                        }}
                        target={"_blank"}
                      >
                        {label}
                      </Link>
                    ))}
                  </Collapse>
                </Section>
              )
            )}
          </LinkContainer>
        </Hidden>
      </Nav>
    </AppBar>
  );
};

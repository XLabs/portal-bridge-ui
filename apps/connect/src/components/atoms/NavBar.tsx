import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import MuiLink from "@mui/material/Link";
import MuiChip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import portal from "../../assets/imgs/logo-white.svg";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { useState } from "react";

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

const ListItem = styled(MuiListItem)(() => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

const Link = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: '"Poppins", regular',
  color: "#FFFFFFE6",
  marginLeft: theme.spacing(7),
  textUnderlineOffset: "6px",
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(2.5),
    fontSize: "0.9rem",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    width: "100%",
    lineHeight: "45px",
  },
  [theme.breakpoints.down("xs")]: {
    marginLeft: theme.spacing(1),
  },
  ":hover": {
    textDecoration: "underline",
  },
}));

const Chip = styled(MuiChip)(() => ({
  position: "relative",
  left: "-10px",
  bottom: "24px",
  backgroundColor: "#3B3785",
  color: "#E2E1FF",
  fontSize: "10px",
  fontWeight: 600,
  lineHeight: "24px",
  wordWrap: "break-word",
}));

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

const womrholescanButton = (
  <Box>
    <Link href="https://wormholescan.io" target="_blank" color="inherit">
      Wormholescan
    </Link>
    <Chip label="NEW" size="small" />
  </Box>
);

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <MuiLink href={`${import.meta.env.BASE_URL}/`}>
          <Logo src={portal} alt="Portal" />
        </MuiLink>
        <Spacer />
        <Hidden implementation="css" smDown>
          <div style={{ display: "flex", alignItems: "center" }}>
            {navBar.map(({ label, active, href }, idx) => (
              <Link
                key={`${label}_${idx}`}
                href={href}
                color="inherit"
                sx={{ textDecoration: active ? "underline" : "none" }}
              >
                {label}
              </Link>
            ))}
            {womrholescanButton}
          </div>
        </Hidden>
        <Hidden implementation="css" smUp>
          <MenuIcon
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          />
        </Hidden>
      </Toolbar>
      {openMenu && (
        <Hidden implementation="css" smUp>
          <List>
            {navBar.map(({ label, href }, idx) => (
              <ListItem key={`${label}_${idx}`}>
                <ListItemButton component="a" href={href}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>{womrholescanButton}</ListItem>
          </List>
        </Hidden>
      )}
    </AppBar>
  );
}

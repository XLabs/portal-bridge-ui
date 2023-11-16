import MuiAppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import MuiLink from "@mui/material/Link";
import MuiChip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import portal from "../../assets/imgs/logo-white.svg";

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

const Link = styled(MuiLink)(({ theme }) => ({
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

export default function NavBar() {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <MuiLink href="">
          <Logo src={portal} alt="Portal" />
        </MuiLink>
        <Spacer />
        <Hidden implementation="css" xsDown>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href=""
              color="inherit"
            >
              Home
            </Link>
            <Link
              href="usdc-bridge"
              color="inherit"
            >
              USDC
            </Link>
            <Box>
              <Link
                href="https://wormholescan.io"
                target="_blank"
                color="inherit"
              >
                Wormholescan
              </Link>
              <Chip label="NEW" size="small" />
            </Box>
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

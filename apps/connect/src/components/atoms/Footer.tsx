import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";

type FooterProps = {
  left?: string;
  right?: string;
};

const Footer = styled(Typography)<FooterProps>(({ theme, left, right }) => ({
  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
    alignItems: "flex-end",
  },
  [theme.breakpoints.up("md")]: {
    position: "absolute",
    left,
    right,
    bottom: "28px",
  },
  color: "#C9CAE8",
  fontFamily: "Poppins",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "18.59px",
}));

export default Footer;

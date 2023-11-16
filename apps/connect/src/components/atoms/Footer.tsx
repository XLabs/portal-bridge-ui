import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";

const FooterContainer = styled("footer")(({ theme }) => ({
  position: "relative",
  color: "#ffffff",
  maxWidth: 1100,
  margin: "0px auto",
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(12),
  },
}));

const FooterFlex = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginLeft: theme.spacing(3.5),
  marginRight: theme.spacing(3.5),
  borderTop: "1px solid #585587",
  paddingTop: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "unset",
  },
}));

export default function Footer() {
  return (
    <FooterContainer>
      <FooterFlex>
        <Typography>
          v{import.meta.env.VITE_APP_VERSION} - {import.meta.env.VITE_APP_CLUSTER}
        </Typography>
      </FooterFlex>
    </FooterContainer>
  );
}

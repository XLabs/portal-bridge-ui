import { Button, styled } from "@mui/material";
import { useState } from "react";
import { PrivacyPolicyPath } from "../../utils/constants";
import cookie from "../../assets/imgs/cookie.svg";
import { Link } from "../../utils/styles";
import { Link as RouterLink } from "react-router-dom";
import { FONT_SIZE } from "../../theme/portal";

const BannerContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  bottom: 60,
  left: 30,
  right: 30,
  zIndex: 10,
  [theme.breakpoints.down("sm")]: {
    bottom: 75,
  },
}));

const Content = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  padding: 10,
  backgroundColor: "#FFFFFF14",
  gap: 20,
  borderRadius: 12,
  margin: 26,
  mixBlendMode: "normal",
  backdropFilter: "blur(60px)",
  [theme.breakpoints.down("sm")]: {
    margin: 5,
    borderRadius: 0,
  },
}));

const CloseButton = styled(Button)(() => ({
  color: "#070528",
  backgroundColor: "white",
  borderRadius: 6,
  fontSize: FONT_SIZE.M,
  maxHeight: 28,
  minWidth: 67,
  textTransform: "capitalize",
  "&:hover": {
    color: "white",
  },
}));
export const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const isNewOrExpired = () => {
    const cache = localStorage.getItem("showPrivacyPolicy");
    const expirationDate =
      new Date(Number(cache)).getTime() + 7 * 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    if (!cache || expirationDate < today) {
      return true;
    }
    return false;
  };
  const handleClose = () => {
    setShowBanner(false);
    if (isNewOrExpired()) {
      const today = new Date();
      localStorage.setItem("showPrivacyPolicy", today.getTime().toString());
    }
  };

  if (!isNewOrExpired() || !showBanner) {
    return null;
  }
  return (
    <BannerContainer>
      <Content>
        <img src={cookie} alt="cookie" />
        <div>
          This website is designed to enhance your experience. By continuing to
          use this site, you consent to our{" "}
          <Link component={RouterLink} to={PrivacyPolicyPath}>
            Privacy Policy
          </Link>
        </div>
        <CloseButton variant="contained" onClick={() => handleClose()}>
          Close
        </CloseButton>
      </Content>
    </BannerContainer>
  );
};

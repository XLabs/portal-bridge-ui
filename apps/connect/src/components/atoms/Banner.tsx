import { Button, styled } from '@mui/material';
import { useState } from 'react';
import { PrivacyPolicyPath } from '../../utils/constants';
import cookie from "../../assets/imgs/cookie.svg";
import { Link } from '../../utils/styles';

const BannerContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  bottom: 60,
  left: 30,
  right: 30,
  zIndex: 100,
  [theme.breakpoints.down("sm")]: {
    bottom: 75,
  }
}));

const Content = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  padding: 10,
  backgroundColor: "#070528",
  gap: 18,
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
  fontSize: 16,
  maxHeight: 28,
  minWidth: 67,
  textTransform: "capitalize",
  "&:hover": {
    color: "white",
  },
}));
const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) {
    // TODO this data could be stored in a cookie or localstorage?
    return null;
  }
  return (
    <BannerContainer>
      <Content>
        <img src={cookie} alt="cookie" />
        <div>
        This website is designed to enhance your experience. By continuing to use this site, you consent to our {" "}
        <Link href={PrivacyPolicyPath}>Privacy Policy</Link>
        </div>
        <CloseButton variant="contained" onClick={() => setShowBanner(false)}>Close</CloseButton>
      </Content>
    </BannerContainer>
  );
};

export default Banner;
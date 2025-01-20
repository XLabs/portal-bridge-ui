import { styled } from "@mui/material";

import { ENV } from "@env";
import { Link } from "./Link";
import { BuiltBy } from "./BuiltBy";
import { SocialMedia } from "./SocialMedia";

const Container = styled("footer")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
}));

const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    maxWidth: 52,
  },
}));

export const Footer = () => {
  return (
    <Container>
      <BuiltBy />

      <LinkContainer>
        {[
          {
            label: "Privacy Policy",
            href: `${ENV.PUBLIC_URL}/#/privacy-policy/`,
          },
        ].map(({ label, href }) => (
          <Link key={label} href={href} target="_blank">
            {label}
          </Link>
        ))}
      </LinkContainer>

      <SocialMedia />
    </Container>
  );
};

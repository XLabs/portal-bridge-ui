import { styled } from "@mui/material";

import { ENV } from "@env";
import { Link } from "./Link";
import { BuiltBy } from "./BuiltBy";

const Container = styled("footer")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
}));

const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1),
}));

export const Footer = () => {
  return (
    <Container>
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
      <BuiltBy />
    </Container>
  );
};

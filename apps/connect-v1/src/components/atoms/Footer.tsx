import { styled } from "@mui/material";

import { ENV } from "@env";
import { Link } from "./Link";

const LinkContainer = styled("footer")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1),
}));

export const Footer = () => {
  return (
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
  );
};

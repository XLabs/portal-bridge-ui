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
          label: "Advanced Tools",
          href: `${ENV.PUBLIC_URL}/advanced-tools/`,
        },
        {
          label: "Privacy Policy",
          href: `${ENV.PUBLIC_URL}/#/privacy-policy/`,
        },
        {
          label: "Copyright © Wormhole 2024",
          href: undefined,
        },
      ].map(({ label, href }) => (
        <Link key={label} href={href} target="_blank">
          {label}
        </Link>
      ))}
    </LinkContainer>
  );
};

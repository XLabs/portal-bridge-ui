import { styled } from "@mui/material";

import { Link } from "./Link";

const LinkContainer = styled("footer")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1),
}));

interface FooterProps {
  publicUrl: string;
}

export const Footer = ({ publicUrl }: FooterProps) => {
  return (
    <LinkContainer>
      {[
        {
          label: "Advanced Tools",
          href: `${publicUrl}/advanced-tools/`,
        },
        {
          label: "Privacy Policy",
          href: `${publicUrl}/#/privacy-policy/`,
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

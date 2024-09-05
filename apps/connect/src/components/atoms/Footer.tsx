import { styled } from "@mui/material";

import { ENV } from "@env";
import { Link } from "./Link";

const LinkContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
}));

export const Footer = () => {
  return (
    <footer>
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
        ].map(({ label, href }) => (
          <Link key={label} href={href} target="_blank">
            {label}
          </Link>
        ))}
      </LinkContainer>
    </footer>
  );
};

import { ENV } from "@env";
import { Link, LinkContainer } from "./Link";

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

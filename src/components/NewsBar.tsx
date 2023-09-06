import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Theme, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { useMemo } from "react";

interface StyleProps {
  exchangeWindowExpired: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "56px",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "16px",
    letterSpacing: "0.02em",
    background: ({ exchangeWindowExpired }) =>
      exchangeWindowExpired
        ? "linear-gradient(1deg, #9577F4 0%, #AD55DA 28.96%, #CA2EBD 100%);"
        : "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
  },
  bannerLink: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 20,
    padding: "6px 12px",
    backgroundColor: "white",
    color: ({ exchangeWindowExpired }) =>
      exchangeWindowExpired ? "#17153F" : "#F47B48",
    marginLeft: "8px",
    fontSize: "12px",
    letterSpacing: "0.08em",
    fontWeight: 600,
    minHeight: "32px",
    minWidth: "fit-content",
    fontFamily: "Poppins",
    wordWrap: "break-word",
  },
}));

interface LinkProps {
  href: string;
  className: string;
}

function Link({ href, className }: LinkProps) {
  return (
    <MuiLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      color="inherit"
      className={className}
    >
      TRY IT NOW
    </MuiLink>
  );
}

export default function NewsBar() {
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));
  const fontSize1 = isBigScreen ? 16 : 12;
  const fontSize2 = isBigScreen ? 16 : 10;

  const messages = {
    cctp: {
      href: `${process.env.PUBLIC_URL}/usdc-bridge`,
      // To show Optimism option on SEPT 4th 2023
      content:
        new Date() < new Date(2023, 8, 4)
          ? "Experience frictionless USDC transfers between Ethereum, Avalanche, and Arbitrum with Circle's CCTP. "
          : "Experience frictionless USDC transfers between Ethereum, Avalanche, Arbitrum, and Optimism with Circle's CCTP.",
    },
    cosmos: {
      href: `${process.env.PUBLIC_URL}/cosmos`,
      content: (
        <>
          <Typography
            variant="body1"
            style={{
              color: "white",
              fontSize: fontSize1,
              fontFamily: "Poppins",
              fontWeight: 500,
              letterSpacing: 0.28,
              wordWrap: "break-word",
            }}
          >
            Wormhole Gateway is now live on mainnet! &nbsp;
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: "white",
              fontSize: fontSize2,
              fontFamily: "Poppins",
              fontWeight: 700,
              letterSpacing: 0.28,
              wordWrap: "break-word",
            }}
          >
            Bridge your assets to Osmosis today.
          </Typography>
        </>
      ),
    },
  };

  const exchangeWindowExpired = useMemo(
    () => new Date() < new Date(2023, 8, 8),
    []
  );
  const classes = useStyles({ exchangeWindowExpired });
  // Shows Cosmos message until Sept 4th 2023
  const { content, href } = useMemo(
    () => (exchangeWindowExpired ? messages.cosmos : messages.cctp),
    [exchangeWindowExpired, messages.cctp, messages.cosmos]
  );
  return (
    <div className={classes.bar}>
      {content}
      <Link href={href} className={classes.bannerLink} />
    </div>
  );
}

import MuiLink from "@material-ui/core/Link";
import { Typography, makeStyles } from "@material-ui/core";
import { useMemo } from "react";
import { Theme } from "@near-wallet-selector/modal-ui";

const useStyles = makeStyles<Theme, { changeWindowPassDue: boolean }>(() => ({
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
    background: ({ changeWindowPassDue }) =>
    changeWindowPassDue
        ? "linear-gradient(1deg, #9577F4 0%, #AD55DA 28.96%, #CA2EBD 100%);"
        : "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
  },
  bannerLink: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 20,
    padding: "6px 12px",
    backgroundColor: "white",
    color: ({ changeWindowPassDue }) => (changeWindowPassDue ? "#17153F" : "#F47B48"),
    marginLeft: "8px",
    fontSize: "12px",
    letterSpacing: "0.08em",
    fontWeight: 600,
    minHeight: "32px",
    minWidth: "fit-content",
    fontFamily: 'Poppins',
    wordWrap: 'break-word'
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

const messages = {
  cctp: {
    href: "https://portalbridge.com/usdc-bridge",
    // To show Optimism option on SEPT 4th 2023
    content:
      new Date() < new Date(2023, 8, 4)
        ? "Experience frictionless USDC transfers between Ethereum, Avalanche, and Arbitrum with Circle's CCTP. "
        : "Experience frictionless USDC transfers between Ethereum, Avalanche, Arbitrum, and Optimism with Circle's CCTP.",
  },
  cosmos: {
    href: "https://portalbridge.com/cosmos",
    content: (
      <>
        <Typography
          variant="body1"
          style={{
            color: "white",
            fontSize: 16,
            fontFamily: "Poppins",
            fontWeight: 500,
            lineHeight: 20.02,
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
            fontSize: 16,
            fontFamily: "Poppins",
            fontWeight: 700,
            lineHeight: 20.02,
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

export default function NewsBar() {
  const changeWindowPassDue = useMemo(() => new Date() < new Date(2023, 8, 4), []);
  const classes = useStyles({ changeWindowPassDue });
  const { content, href } = useMemo(
    () => (changeWindowPassDue ? messages.cosmos : messages.cctp),
    [changeWindowPassDue]
  );
  return (
    <div className={classes.bar}>
      {content}
      <Link href={href} className={classes.bannerLink} />
    </div>
  );
};

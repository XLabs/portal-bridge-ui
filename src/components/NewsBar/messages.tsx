import Typography from "@material-ui/core/Typography";

export type Message = {
  background: string;
  button: {
    href: string;
    label?: string;
    background: string;
  };
  content: JSX.Element;
  start: Date;
  ends?: Date;
};

const messages: Record<string, Message> = {
  cctp: {
    background: "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
    button: {
      href: `${process.env.PUBLIC_URL}/usdc-bridge`,
      label: "TRY IT NOW",
      background: "#F47B48",
    },
    content: (
      <>
        "Experience frictionless USDC transfers between Ethereum, Avalanche,
        Arbitrum, and Optimism with Circle's CCTP."
      </>
    ),
    start: new Date(2020, 10, 23), // any date in the past would be fine
  },
  cosmos: {
    background:
      "linear-gradient(1deg, #9577F4 0%, #AD55DA 28.96%, #CA2EBD 100%);",
    button: {
      href: `${process.env.PUBLIC_URL}/cosmos`,
      label: "TRY IT NOW",
      background: "#17153F",
    },
    content: (
      <>
        <Typography
          variant="body1"
          style={{
            color: "white",
            fontSize: 16,
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
            fontSize: 16,
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
    start: new Date(2023, 8, 8),
  },
  wormholescan: {
    background:
      "linear-gradient(86deg, #FF2A57 0%, #FF2A57 28.96%, #0F0C48 100%);",
    button: {
      href: "https://wormholescan.io/",
      label: "VIEW WORMHOLESCAN.IO",
      background: "#17153F",
    },
    content: (
      <>
        <Typography
          variant="body1"
          style={{
            color: "white",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: "700",
            lineHeight: "20.02px",
            letterSpacing: "0.28px",
            wordWrap: "break-word",
          }}
        >
          Introducing Wormholescan: &nbsp;
        </Typography>
        <Typography
          variant="body1"
          style={{
            color: "white",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: 500,
            lineHeight: "20.02px",
            letterSpacing: "0.28px",
            wordWrap: "break-word",
          }}
        >
          A cross-chain block explorer
        </Typography>
      </>
    ),
    start: new Date(2023, 9, 20),
  },
};

export default messages;

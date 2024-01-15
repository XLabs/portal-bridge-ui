import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export type Message = {
  background: string;
  button?: {
    href: string;
    label?: string;
    background: string;
  };
  content: JSX.Element;
  start: Date;
  ends?: Date;
};

const messages: Record<string, Message> = {
  eth: {
    background:
      "linear-gradient(90deg, rgba(6,132,249,1) 0%, rgba(0,120,232,1) 48%, rgba(0,0,0,1) 100%);",
    content: (
      <>
        <Typography
          variant="body1"
          style={{
            color: "white",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: "500",
            lineHeight: "20.02px",
            letterSpacing: "0.28px",
            wordWrap: "break-word",
          }}
        >
          Native ETH transfers now live across Eth, Arb, Base, OP, Polygon, BNB.{" "}
          <Link
            href="https://wormhole.com/wormhole-launches-native-token-transfers-starting-with-native-eth-and-wsteth-across-7-evm-chains/"
            target="_blank"
          >
            Read more here
          </Link>
          <br />
          or get started below. Want to integrate into your own Dapps?{" "}
          <Link
            href="https://docs.wormhole.com/wormhole/quick-start/wh-connect"
            target="_blank"
          >
            Find out more here
          </Link>
          .
        </Typography>
      </>
    ),
    start: new Date("2024-01-17T11:00:00-05:00"), // any date in the past would be fine
  },
  cctp: {
    background: "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
    button: {
      href: `${process.env.PUBLIC_URL}/usdc-bridge`,
      label: "TRY IT NOW",
      background: "#F47B48",
    },
    content: (
      <>
        Experience frictionless USDC transfers between Ethereum, Avalanche,
        Optimism, Base and Arbitrum with Circle's CCTP.
      </>
    ),
    start: new Date(2023, 9, 26),
    ends: new Date(2023, 10, 6),
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
    start: new Date(2023, 9, 20), // any date in the past would be fine
  },
};

export default messages;

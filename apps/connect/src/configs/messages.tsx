import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";

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
      "linear-gradient(90deg, rgba(6, 132, 249, 0.74) 1.32%, rgba(6, 132, 249, 0.00) 108.28%);",
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
          Native ETH transfers now live across Eth, Arb, Base, OP, Polygon, BNB,
          and Avax.{" "}
          <Link
            href="https://wormhole.com/wormhole-launches-native-token-transfers-starting-with-native-eth-and-wsteth-across-7-evm-chains/"
            target="_blank"
            style={{
              color: "#2A99FF",
              textDecoration: "underline",
            }}
          >
            Read more here
          </Link>
          <br />
          or get started below. Want to integrate into your own Dapps?{" "}
          <Link
            href="https://docs.wormhole.com/wormhole/quick-start/wh-connect"
            target="_blank"
            style={{
              color: "#2A99FF",
              textDecoration: "underline",
            }}
          >
            Find out more here
          </Link>
          .
        </Typography>
      </>
    ),
    start: new Date("2024-01-17T10:00:00-05:00"), // any date in the past would be fine
  },
  cctp: {
    background: "linear-gradient(20deg, #f44b1b 0%, #eeb430 100%);",
    button: {
      href: `${import.meta.env.PUBLIC_URL}/usdc-transfer`,
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
  solana: {
    background: "yellow;",
    content: (
      <>
        <Typography
          variant="body1"
          style={{
            color: "#070528",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: "700",
            lineHeight: "20.02px",
            letterSpacing: "0.28px",
            wordWrap: "break-word",
          }}
        >
          There are currently delays in relaying to Solana. Please use manual
          relaying if you need your transfer completed quickly.
        </Typography>
      </>
    ),
    start: new Date(2023, 11, 17), // any date in the past would be fine
    ends: new Date(2023, 11, 18), // any date in the past would be fine
  },
};

export default messages;

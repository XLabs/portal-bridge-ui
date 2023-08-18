import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { ReactChild } from "react";
import { COLORS } from "../muiTheme";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  centeredContainer: {
    //marginBottom: theme.spacing(16),
    textAlign: "center",
    width: "100%",
  },
  linearGradient: {
    background: `linear-gradient(to left, ${COLORS.blue}, ${COLORS.green});`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    MozBackgroundClip: "text",
    MozTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    margin: "auto",
    textAlign: "left",
    display: "flex",
    width: "792px",
    height: "258px",
    padding: theme.spacing(4), // 32px
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "16px",
    borderRadius: "28px",
    background: "rgba(255, 42, 87, 0.10)",
    border: "none",
    lineHeight: "24px",
    "& .MuiAlertTitle-root": {
      color: "#FFE3E9",
      fontWeight: 700,
      marginBottom: theme.spacing(3),
    },
    "& .MuiAlert-icon": {
      fontSize: 24,
      marginRight: 0,
    },
    "& .MuiAlert-message": {
      width: "633px",
      marginRight: "55px",
      flexShrink: 0,
      "& .MuiTypography-paragraph": {
        color: "#FFE3E9",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        "&:not(:last-child)": {
          marginBottom: theme.spacing(3),
        },
      },
      "& span": {
        color: "#FFE3E9",
        fontWeight: 700,
      },
      "& .MuiLink-root": {
        color: "#FFE3E9",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "24px",
        textDecorationLine: "underline",
      },
    },
  },
}));

function Notice() {
  const style = useStyles();
  return (
    <Alert severity="error" className={style.alert}>
      <AlertTitle>
        Wormhole Upgrade In Progress - Temporary Downtime In Effect
      </AlertTitle>
      <Box>
        <Typography paragraph>
          A required upgrade is being executed by the network of Wormhole
          Guardian (validator) nodes to add Gateway to the Wormhole stack.
        </Typography>
        <Typography paragraph>
          <Typography component="span">
            Token bridging is currently paused.{" "}
          </Typography>{" "}
        </Typography>
        <Typography paragraph>
          Follow:{" "}
          <Link href="https://twitter.com/wormholecrypto" target="_blank">
            @wormholecrypto
          </Link>{" "}
          and join the{" "}
          <Link
            href="https://discord.com/invite/wormholecrypto"
            target="_blank"
          >
            Discord
          </Link>{" "}
          for updates.
        </Typography>
      </Box>
    </Alert>
  );
}

export default function HeaderText({
  children,
  white,
  small,
  subtitle,
}: {
  children: ReactChild;
  white?: boolean;
  small?: boolean;
  subtitle?: ReactChild;
}) {
  const classes = useStyles();
  return (
    <div className={classes.centeredContainer}>
      <Typography
        variant={small ? "h2" : "h1"}
        component="h1"
        className={clsx({ [classes.linearGradient]: !white })}
      >
        {children}
      </Typography>
      {subtitle ? (
        <Typography component="div" className={classes.subtitle}>
          {subtitle}
        </Typography>
      ) : null}
      <Notice />
    </div>
  );
}

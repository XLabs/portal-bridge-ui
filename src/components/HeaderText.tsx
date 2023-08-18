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
}));

const useHeadUpStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    margin: "auto",
    textAlign: "left",
    display: "flex",
    width: "792px",
    height: "282px",
    padding: theme.spacing(4), // 32px
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "16px",
    borderRadius: "28px",
    background: "rgba(193, 149, 49, 0.10)",
    border: "none",
    lineHeight: "24px",
    "& .MuiAlertTitle-root": {
      color: "#FBECD0",
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
        color: "#FBECD0",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        "&:not(:last-child)": {
          marginBottom: theme.spacing(3),
        },
      },
      "& span": {
        color: "#EEB32A",
        fontWeight: 700,
      },
      "& .MuiLink-root": {
        color: "#FBECD0",
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


function HeadUpNotice() {
  const style = useHeadUpStyles();
  return (
    <Alert severity="warning" className={style.alert}>
      <AlertTitle>
        Wormhole Upgrade Approaching - Expect Temporary Downtime
      </AlertTitle>
      <Box>
        <Typography paragraph>
          A required upgrade is being coordinated and executed by the network of
          Wormhole Guardian (validator) nodes to add Gateway to the Wormhole
          stack.
        </Typography>
        <Typography paragraph>
          Please take note that token bridging will pause for several hours on{" "}
          <br />
          <Typography component="span">Monday, August 21, 2023</Typography>{" "}
          during the upgrade.
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

const useInProgressStyles = makeStyles((theme) => ({
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

function InProgressNotice() {
  const style = useInProgressStyles();
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

const useBackOnLineStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    margin: "auto",
    textAlign: "left",
    display: "flex",
    width: "792px",
    height: "210px",
    padding: theme.spacing(4), // 32px
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "16px",
    borderRadius: "28px",
    background: "rgba(1, 187, 172, 0.10)",
    border: "none",
    lineHeight: "24px",
    "& .MuiAlertTitle-root": {
      color: "#FFE3E9",
      fontWeight: 700,
      marginBottom: theme.spacing(3),
      "& span": {
        color: "#07D9C8",
      },
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

function BackOnLineNotice() {
  const style = useBackOnLineStyles();
  return (
    <Alert severity="success" className={style.alert}>
      <AlertTitle>
        Wormhole Upgrade Completed -{" "}
        <Typography component="span">Back Online</Typography>
      </AlertTitle>
      <Box>
        <Typography paragraph>
          A required upgrade was completed by the network of Wormhole Guardian
          (validator) nodes to add Gateway to the Wormhole stack.
        </Typography>
        <Typography paragraph>
          <Typography component="span">Token bridging is now live. </Typography>{" "}
        </Typography>
      </Box>
    </Alert>
  );
}

function Notice() {
  const now = Date.now();
  const outageStart = Date.UTC(2023, 7, 21, 6);
  const outageEnd = Date.UTC(2023, 7, 21, 9);
  if (now < outageStart) {
    return <HeadUpNotice />
  } else if (now > outageStart && now < outageEnd) {
    return <InProgressNotice />
  } else if (now > outageEnd) {
    return <BackOnLineNotice />
  } else {
    return null;
  }
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

import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { COLORS } from "../muiTheme";

const useStyles = makeStyles((theme) => ({
  centeredContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(7.5),
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

export default function HeaderText({
  children,
  white,
  small,
  subtitle,
}: {
  children: JSX.Element | string | JSX.Element[];
  white?: boolean;
  small?: boolean;
  subtitle?: JSX.Element | string | JSX.Element[];
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
    </div>
  );
}

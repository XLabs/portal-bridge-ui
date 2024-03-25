import type { Message } from "./messages";
import { makeStyles, type Theme } from "@material-ui/core";

const useStyles = makeStyles<Theme, Pick<Message, "background">>((theme) => ({
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "56px",
    [theme.breakpoints.down("md")]: {
      height: "auto",
      flexDirection: "column",
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    textAlign: "center",
    fontWeight: 500,
    fontSize: "16px",
    letterSpacing: "0.02em",
    background: ({ background }) => background,
  },
}));

type BarProps = {
  background: string;
  children: JSX.Element[] | null;
};

export default function Bar({ background, children }: BarProps) {
  const classes = useStyles({ background });
  return children && <div className={classes.bar}>{children}</div>;
}

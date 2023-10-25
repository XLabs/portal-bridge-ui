import type { Message } from "./messages";
import type { Theme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles<Theme, Pick<Message, "button">>(
  (theme: Theme) => ({
    bannerLink: {
      [theme.breakpoints.down("md")]: {
        marginLeft: "0px",
        marginTop: theme.spacing(1),
      },
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 20,
      padding: "6px 12px",
      backgroundColor: "white",
      color: ({ button }) => button.background,
      marginLeft: "8px",
      fontSize: "12px",
      letterSpacing: "0.08em",
      fontWeight: 600,
      minHeight: "32px",
      minWidth: "fit-content",
      fontFamily: "Poppins",
      wordWrap: "break-word",
    },
  })
);

export default function NewsBarButton({ button }: Pick<Message, "button">) {
  const classes = useStyles({ button });
  return (
    <Link
      href={button.href}
      target="_blank"
      rel="noopener noreferrer"
      color="inherit"
      className={classes.bannerLink}
    >
      {button.label || "TRY IT NOW"}
    </Link>
  );
}

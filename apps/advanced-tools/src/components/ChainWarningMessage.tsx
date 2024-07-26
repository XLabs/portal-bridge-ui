import { Link, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { WarningMessage } from "../hooks/useWarningRulesEngine";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface ChainWarningProps {
  message?: WarningMessage;
  children?: string | JSX.Element | JSX.Element[];
}

export default function ChainWarningMessage({
  children,
  message,
}: ChainWarningProps) {
  const classes = useStyles();
  return (
    <Alert variant="outlined" severity="warning" className={classes.alert}>
      {children || (
        <>
          {message?.text}
          {message?.link && (
            <Typography component="div">
              <Link href={message.link.url} target="_blank" rel="noreferrer">
                {message.link.text}
              </Link>
            </Typography>
          )}
        </>
      )}
    </Alert>
  );
}

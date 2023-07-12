import { Link, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { WarningMessage } from "../hooks/useTransferControl";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface ChainWarningProps {
  message: WarningMessage;
}

export default function ChainWarningMessage({ message }: ChainWarningProps) {
  const classes = useStyles();
  return (
    <Alert variant="outlined" severity="warning" className={classes.alert}>
      {message.text}
      {message.link && (
        <Typography component="div">
          <Link href={message.link.url} target="_blank" rel="noreferrer">
            {message.link.text}
          </Link>
        </Typography>
      )}
    </Alert>
  );
}

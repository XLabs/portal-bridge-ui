import { makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function PandleWarning() {
  const classes = useStyles();

  return (
    <Alert severity="warning" variant="outlined" className={classes.alert}>
      <Typography variant="body1">
        Pandle transfer are limited to Ethereum to BSC and BSC to Ethereum
      </Typography>
    </Alert>
  );
}

export default PandleWarning;

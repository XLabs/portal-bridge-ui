import { Link, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { IsTransferLimitedResult } from "../../hooks/useIsTransferLimited";
import {
  CHAINS_BY_ID,
  GOVERNOR_WHITEPAPER_URL,
  USD_NUMBER_FORMATTER as USD_FORMATTER,
} from "../../utils/consts";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const TransferLimitedWarning = ({
  isTransferLimited,
}: {
  isTransferLimited: IsTransferLimitedResult;
}) => {
  const classes = useStyles();

  if (
    isTransferLimited.isLimited &&
    isTransferLimited.reason &&
    isTransferLimited.limits
  ) {
    const chainName =
      CHAINS_BY_ID[isTransferLimited.limits.chainId]?.name || "unknown";
    let message;
    if (
      isTransferLimited.reason === "EXCEEDS_MAX_NOTIONAL" ||
      isTransferLimited.reason === "EXCEEDS_REMAINING_NOTIONAL"
    ) {
      // TODO: See if its necessary a different message for EXCEEDS_REMAINING_NOTIONAL case
      message = (
        <>
          This transaction will take up to 24 hours to process as Wormhole has
          reached the daily limit for {chainName}. This is a normal and
          temporary security feature by the Wormhole network.{" "}
          <Link href={GOVERNOR_WHITEPAPER_URL} target="_blank" rel="noreferrer">
            Learn more
          </Link>{" "}
          about this temporary security measure.
        </>
      );
    } else if (isTransferLimited.reason === "EXCEEDS_LARGE_TRANSFER_LIMIT") {
      message = (
        <>
          This transaction requires 24 hours to complete. This transaction will
          take 24 hours to process, as it exceeds the Wormhole network's
          temporary transaction limit of $
          {USD_FORMATTER.format(
            isTransferLimited.limits.chainBigTransactionSize
          )}{" "}
          on {chainName} for security reasons. You may also split the
          transaction into smaller transactions less than $
          {USD_FORMATTER.format(
            isTransferLimited.limits.chainBigTransactionSize
          )}{" "}
          each to avoid the 24 hour security delay.{" "}
          <Link href={GOVERNOR_WHITEPAPER_URL} target="_blank" rel="noreferrer">
            Learn more
          </Link>{" "}
          about this is a temporary security measure.
        </>
      );
    }
    return (
      <Alert variant="outlined" severity="warning" className={classes.alert}>
        {message}
      </Alert>
    );
  }
  return null;
};

export default TransferLimitedWarning;

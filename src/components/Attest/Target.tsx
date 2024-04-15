import { isEVMChain } from "@certusone/wormhole-sdk";
import { makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GasEstimateSummary } from "../../hooks/useTransactionFees";
import { incrementStep, setTargetChain } from "../../store/attestSlice";
import {
  selectAttestIsTargetComplete,
  selectAttestShouldLockFields,
  selectAttestSourceChain,
  selectAttestTargetChain,
} from "../../store/selectors";
import { ATTEST_CHAINS, CHAINS_BY_ID } from "../../utils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import ChainSelect from "../ChainSelect";
import KeyAndBalance from "../KeyAndBalance";
import LowBalanceWarning from "../LowBalanceWarning";
import { isGatewayCosmosChain } from "../../utils/cosmos";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Target() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sourceChain = useSelector(selectAttestSourceChain);
  const chains = useMemo(
    () => ATTEST_CHAINS.filter((c) => c.id !== sourceChain),
    [sourceChain]
  );
  const targetChain = useSelector(selectAttestTargetChain);
  const isTargetComplete = useSelector(selectAttestIsTargetComplete);
  const shouldLockFields = useSelector(selectAttestShouldLockFields);
  const handleTargetChange = useCallback(
    (event) => {
      dispatch(setTargetChain(event.target.value));
    },
    [dispatch]
  );
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep());
  }, [dispatch]);
  return (
    <>
      <ChainSelect
        select
        variant="outlined"
        fullWidth
        value={targetChain}
        onChange={handleTargetChange}
        disabled={shouldLockFields}
        chains={chains}
      />
      <KeyAndBalance chainId={targetChain} />
      {/* In the case of cosmos chain target no fees are required */}
      {!isGatewayCosmosChain(targetChain) && (
        <Alert severity="info" variant="outlined" className={classes.alert}>
          <Typography>
            You will have to pay transaction fees on{" "}
            {CHAINS_BY_ID[targetChain].name} to attest this token.{" "}
          </Typography>
          {isEVMChain(targetChain) && (
            <GasEstimateSummary
              methodType="createWrapped"
              chainId={targetChain}
            />
          )}
        </Alert>
      )}
      <LowBalanceWarning chainId={targetChain} />
      <ButtonWithLoader
        disabled={!isTargetComplete}
        onClick={handleNextClick}
        showLoader={false}
      >
        Next
      </ButtonWithLoader>
    </>
  );
}

export default Target;

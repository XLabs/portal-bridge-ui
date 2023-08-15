import {
  CHAIN_ID_BSC,
  CHAIN_ID_CELO,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
} from "@certusone/wormhole-sdk";
import { getAddress } from "@ethersproject/address";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { VerifiedUser } from "@material-ui/icons";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import {
  selectTransferAmount,
  selectTransferIsSourceComplete,
  selectTransferShouldLockFields,
  selectTransferSourceBalanceString,
  selectTransferSourceChain,
  selectTransferSourceError,
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetChain,
} from "../../store/selectors";
import {
  incrementStep,
  setAmount,
  setSourceChain,
  setTargetChain,
} from "../../store/transferSlice";
import {
  BSC_MIGRATION_ASSET_MAP,
  CELO_MIGRATION_ASSET_MAP,
  CHAINS,
  CLUSTER,
  ETH_MIGRATION_ASSET_MAP,
} from "../../utils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import ChainSelect from "../ChainSelect";
import ChainSelectArrow from "../ChainSelectArrow";
import KeyAndBalance from "../KeyAndBalance";
import LowBalanceWarning from "../LowBalanceWarning";
import NumberTextField from "../NumberTextField";
import SolanaTPSWarning from "../SolanaTPSWarning";
import StepDescription from "../StepDescription";
import { TokenSelector } from "../TokenSelectors/SourceTokenSelector";
import SourceAssetWarning from "./SourceAssetWarning";
import ChainWarningMessage from "../ChainWarningMessage";
import useIsTransferLimited from "../../hooks/useIsTransferLimited";
import TransferLimitedWarning from "./TransferLimitedWarning";
import { RootState } from "../../store";
import useTransferControl from "../../hooks/useTransferControl";
import transferRules from "../../config/transferRules";
import useRoundTripTransfer from "../../hooks/useRoundTripTransfer";
import useMinimumAmountGuard from "../../hooks/useMinimumAmountGuard";

const useStyles = makeStyles((theme) => ({
  chainSelectWrapper: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  chainSelectContainer: {
    flexBasis: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  chainSelectArrow: {
    position: "relative",
    top: "12px",
    [theme.breakpoints.down("sm")]: { transform: "rotate(90deg)" },
  },
  transferField: {
    marginTop: theme.spacing(5),
  },
}));

function Source() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const sourceChain = useSelector(selectTransferSourceChain);
  const targetChain = useSelector(selectTransferTargetChain);
  const targetChainOptions = useMemo(
    () => CHAINS.filter((c) => c.id !== sourceChain),
    [sourceChain]
  );
  const parsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const hasParsedTokenAccount = !!parsedTokenAccount;
  const isEthereumMigration =
    sourceChain === CHAIN_ID_ETH &&
    !!parsedTokenAccount &&
    !!ETH_MIGRATION_ASSET_MAP.get(getAddress(parsedTokenAccount.mintKey));
  const isBscMigration =
    sourceChain === CHAIN_ID_BSC &&
    !!parsedTokenAccount &&
    !!BSC_MIGRATION_ASSET_MAP.get(getAddress(parsedTokenAccount.mintKey));
  const isCeloMigration =
    sourceChain === CHAIN_ID_CELO &&
    !!parsedTokenAccount &&
    !!CELO_MIGRATION_ASSET_MAP.get(getAddress(parsedTokenAccount.mintKey));
  const isMigrationAsset =
    isEthereumMigration || isBscMigration || isCeloMigration;
  const uiAmountString = useSelector(selectTransferSourceBalanceString);
  const amount = useSelector(selectTransferAmount);
  const error = useSelector(selectTransferSourceError);
  const isSourceComplete = useSelector(selectTransferIsSourceComplete);
  const shouldLockFields = useSelector(selectTransferShouldLockFields);
  const { isReady, statusMessage, walletAddress } =
    useIsWalletReady(sourceChain);
  const isTransferLimited = useIsTransferLimited();
  const handleMigrationClick = useCallback(() => {
    if (sourceChain === CHAIN_ID_ETH) {
      history.push(`/migrate/Ethereum/${parsedTokenAccount?.mintKey}`);
    } else if (sourceChain === CHAIN_ID_BSC) {
      history.push(`/migrate/BinanceSmartChain/${parsedTokenAccount?.mintKey}`);
    } else if (sourceChain === CHAIN_ID_CELO) {
      history.push(`/migrate/Celo/${parsedTokenAccount?.mintKey}`);
    }
  }, [history, parsedTokenAccount, sourceChain]);
  const handleSourceChange = useCallback(
    (event) => {
      dispatch(setSourceChain(event.target.value));
    },
    [dispatch]
  );
  const handleTargetChange = useCallback(
    (event) => {
      dispatch(setTargetChain(event.target.value));
    },
    [dispatch]
  );
  const handleAmountChange = useCallback(
    (event) => {
      dispatch(setAmount(event.target.value));
    },
    [dispatch]
  );
  const handleMaxClick = useCallback(() => {
    if (uiAmountString) {
      dispatch(setAmount(uiAmountString));
    }
  }, [dispatch, uiAmountString]);
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep());
  }, [dispatch]);

  const selectedTokenAddress = useSelector(
    (state: RootState) => state.transfer.sourceParsedTokenAccount?.mintKey
  );
  const { isTransferDisabled, warnings, ids } = useTransferControl(
    transferRules,
    sourceChain,
    targetChain,
    selectedTokenAddress
  );
  /* Only allow sending from ETH <-> BSC Pandle Token */
  const isPandle = (id: string) => id === "pandle";
  const isRoundTripTransfer = useRoundTripTransfer(
    CHAIN_ID_ETH,
    CHAIN_ID_BSC,
    sourceChain,
    (chainId: number) => handleTargetChange({ target: { value: chainId } }),
    ids,
    isPandle
  );
  /* End pandle token check */
  const { decimals = 0, isNativeAsset = false } = parsedTokenAccount || {};
  const { isBelowMinimum, minimum } = useMinimumAmountGuard({
    amount,
    sourceChain,
    decimals,
    isNativeAsset,
  });
  return (
    <>
      <StepDescription>
        <div style={{ display: "flex", alignItems: "center" }}>
          Select tokens to send through the Portal.
          <div style={{ flexGrow: 1 }} />
          <div>
            <Button
              component={Link}
              to="/token-origin-verifier"
              size="small"
              variant="outlined"
              startIcon={<VerifiedUser />}
            >
              Token Origin Verifier
            </Button>
          </div>
        </div>
      </StepDescription>
      <div
        className={classes.chainSelectWrapper}
        style={{ marginBottom: "25px" }}
      >
        <div className={classes.chainSelectContainer}>
          <Typography variant="caption">Source</Typography>
          <ChainSelect
            select
            variant="outlined"
            fullWidth
            value={sourceChain}
            onChange={handleSourceChange}
            disabled={shouldLockFields}
            chains={CHAINS}
          />
        </div>
        <div className={classes.chainSelectArrow}>
          <ChainSelectArrow
            onClick={() => {
              dispatch(setSourceChain(targetChain));
            }}
            disabled={shouldLockFields}
          />
        </div>
        <div className={classes.chainSelectContainer}>
          <Typography variant="caption">Target</Typography>
          <ChainSelect
            variant="outlined"
            select
            fullWidth
            value={targetChain}
            onChange={handleTargetChange}
            disabled={shouldLockFields || isRoundTripTransfer}
            chains={targetChainOptions}
          />
        </div>
      </div>
      <KeyAndBalance chainId={sourceChain} />
      {(isReady || uiAmountString) && !!walletAddress ? (
        <div className={classes.transferField}>
          <TokenSelector disabled={shouldLockFields} />
        </div>
      ) : null}
      {isMigrationAsset ? (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleMigrationClick}
        >
          Go to Migration Page
        </Button>
      ) : (
        <>
          <LowBalanceWarning chainId={sourceChain} />
          {sourceChain === CHAIN_ID_SOLANA && CLUSTER === "mainnet" && (
            <SolanaTPSWarning />
          )}
          <SourceAssetWarning
            sourceChain={sourceChain}
            sourceAsset={parsedTokenAccount?.mintKey}
          />
          {hasParsedTokenAccount && !!walletAddress ? (
            <NumberTextField
              variant="outlined"
              label="Amount"
              fullWidth
              className={classes.transferField}
              value={amount}
              onChange={handleAmountChange}
              disabled={isTransferDisabled || shouldLockFields}
              error={isBelowMinimum}
              helperText={
                isBelowMinimum
                  ? `Amount sent is too small. The amount must be equal or greater than ${minimum}.`
                  : ""
              }
              onMaxClick={
                uiAmountString && !parsedTokenAccount.isNativeAsset
                  ? handleMaxClick
                  : undefined
              }
            />
          ) : null}
          {warnings.map((message, key) => (
            <ChainWarningMessage key={key} message={message} />
          ))}
          <TransferLimitedWarning isTransferLimited={isTransferLimited} />
          <ButtonWithLoader
            disabled={isTransferDisabled || !isSourceComplete || isBelowMinimum}
            onClick={handleNextClick}
            showLoader={false}
            error={isTransferDisabled ? "" : statusMessage || error}
          >
            Next
          </ButtonWithLoader>
        </>
      )}
    </>
  );
}

export default Source;

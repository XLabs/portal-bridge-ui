import {
  CHAIN_ID_ACALA,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_AURORA,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_KARURA,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_NEON,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  ChainId,
  isEVMChain,
  isTerraChain,
  WSOL_ADDRESS,
} from "@certusone/wormhole-sdk";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetIsTransferCompleted from "../../hooks/useGetIsTransferCompleted";
import { useHandleRedeem } from "../../hooks/useHandleRedeem";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import {
  selectTransferIsRecovery,
  selectTransferTargetAsset,
  selectTransferTargetChain,
  selectTransferUseRelayer,
} from "../../store/selectors";
import { reset } from "../../store/transferSlice";
import {
  ARBWETH_ADDRESS,
  CHAINS_BY_ID,
  CLUSTER,
  getHowToAddTokensToWalletUrl,
  WAVAX_ADDRESS,
  WBNB_ADDRESS,
  WETH_ADDRESS,
  WETH_AURORA_ADDRESS,
  WFTM_ADDRESS,
  WGLMR_ADDRESS,
  WKLAY_ADDRESS,
  WMATIC_ADDRESS,
  WNEON_ADDRESS,
  WROSE_ADDRESS,
} from "../../utils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import KeyAndBalance from "../KeyAndBalance";
import SmartAddress from "../SmartAddress";
import { SolanaCreateAssociatedAddressAlternate } from "../SolanaCreateAssociatedAddress";
import SolanaTPSWarning from "../SolanaTPSWarning";
import StepDescription from "../StepDescription";
import TerraFeeDenomPicker from "../TerraFeeDenomPicker";
import AddToMetamask from "./AddToMetamask";
import RedeemPreview from "./RedeemPreview";
import WaitingForWalletMessage from "./WaitingForWalletMessage";
import ChainWarningMessage from "../ChainWarningMessage";
import { useRedeemControl } from "../../hooks/useRedeemControl";
import transferRules from "../../config/transferRules";
import { RootState } from "../../store";
import { CHAIN_ID_SEI } from "@xlabs-libs/wallet-aggregator-core";

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  centered: {
    margin: theme.spacing(4, 0, 2),
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
}));

type AutomaticRelayRedeemProps = {
  isTransferCompleted: boolean;
  chainId: ChainId;
  handleManualRedeem: () => void;
};

function AutomaticRelayRedeem({
  isTransferCompleted,
  chainId,
  handleManualRedeem,
}: AutomaticRelayRedeemProps) {
  const { showLoader } = useHandleRedeem();
  const targetChain = useSelector(selectTransferTargetChain);
  const { isReady } = useIsWalletReady(targetChain);
  const classes = useStyles();
  return (
    <>
      {!isTransferCompleted ? (
        <div className={classes.centered}>
          <Typography
            component="div"
            variant="subtitle1"
            className={classes.description}
          >
            {CHAINS_BY_ID[chainId].name} is running a relayer for this operation
          </Typography>
          {!isReady && <KeyAndBalance chainId={targetChain} />}

          <ButtonWithLoader
            onClick={handleManualRedeem}
            showLoader={showLoader}
            disabled={showLoader || !isReady}
          >
            Manually redeem instead
          </ButtonWithLoader>
        </div>
      ) : null}

      {isTransferCompleted ? (
        <RedeemPreview
          overrideExplainerString={`Success! Your transfer is complete. ${CHAINS_BY_ID[chainId].name} relayed this operation for you.`}
        />
      ) : null}
    </>
  );
}

function Redeem() {
  const {
    handleClick,
    handleNativeClick,
    handleAcalaRelayerRedeemClick,
    disabled,
    showLoader,
  } = useHandleRedeem();
  const useRelayer = useSelector(selectTransferUseRelayer);
  const [manualRedeem, setManualRedeem] = useState(!useRelayer);
  const handleManuallyRedeemClick = useCallback(() => {
    setManualRedeem(true);
  }, []);
  const handleSwitchToRelayViewClick = useCallback(() => {
    if (useRelayer) {
      setManualRedeem(false);
    }
  }, [useRelayer]);
  const targetChain = useSelector(selectTransferTargetChain);
  const targetIsAcala =
    targetChain === CHAIN_ID_ACALA || targetChain === CHAIN_ID_KARURA;
  const targetAsset = useSelector(selectTransferTargetAsset);
  const isRecovery = useSelector(selectTransferIsRecovery);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isReady, statusMessage } = useIsWalletReady(targetChain);
  //TODO better check, probably involving a hook & the VAA
  const isEthNative =
    targetChain === CHAIN_ID_ETH &&
    targetAsset &&
    targetAsset.toLowerCase() === WETH_ADDRESS.toLowerCase();
  const isBscNative =
    targetChain === CHAIN_ID_BSC &&
    targetAsset &&
    targetAsset.toLowerCase() === WBNB_ADDRESS.toLowerCase();
  const isPolygonNative =
    targetChain === CHAIN_ID_POLYGON &&
    targetAsset &&
    targetAsset.toLowerCase() === WMATIC_ADDRESS.toLowerCase();
  const isAvaxNative =
    targetChain === CHAIN_ID_AVAX &&
    targetAsset &&
    targetAsset.toLowerCase() === WAVAX_ADDRESS.toLowerCase();
  const isOasisNative =
    targetChain === CHAIN_ID_OASIS &&
    targetAsset &&
    targetAsset.toLowerCase() === WROSE_ADDRESS.toLowerCase();
  const isAuroraNative =
    targetChain === CHAIN_ID_AURORA &&
    targetAsset &&
    targetAsset.toLowerCase() === WETH_AURORA_ADDRESS.toLowerCase();
  const isFantomNative =
    targetChain === CHAIN_ID_FANTOM &&
    targetAsset &&
    targetAsset.toLowerCase() === WFTM_ADDRESS.toLowerCase();
  const isKlaytnNative =
    targetChain === CHAIN_ID_KLAYTN &&
    targetAsset &&
    targetAsset.toLowerCase() === WKLAY_ADDRESS.toLowerCase();
  const isNeonNative =
    targetChain === CHAIN_ID_NEON &&
    targetAsset &&
    targetAsset.toLowerCase() === WNEON_ADDRESS.toLowerCase();
  const isMoonbeamNative =
    targetChain === CHAIN_ID_MOONBEAM &&
    targetAsset &&
    targetAsset.toLowerCase() === WGLMR_ADDRESS.toLowerCase();
  const isArbitrumNative =
    targetChain === CHAIN_ID_ARBITRUM &&
    targetAsset &&
    targetAsset.toLowerCase() === ARBWETH_ADDRESS.toLowerCase();
  const isSolNative =
    targetChain === CHAIN_ID_SOLANA &&
    targetAsset &&
    targetAsset === WSOL_ADDRESS;
  const isNativeEligible =
    isEthNative ||
    isBscNative ||
    isPolygonNative ||
    isAvaxNative ||
    isOasisNative ||
    isAuroraNative ||
    isFantomNative ||
    isKlaytnNative ||
    isNeonNative ||
    isMoonbeamNative ||
    isArbitrumNative ||
    isSolNative;
  const [useNativeRedeem, setUseNativeRedeem] = useState(true);
  const toggleNativeRedeem = useCallback(() => {
    setUseNativeRedeem(!useNativeRedeem);
  }, [useNativeRedeem]);
  const handleResetClick = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);
  const howToAddTokensUrl = getHowToAddTokensToWalletUrl(targetChain);
  const originAsset = useSelector(
    (state: RootState) => state.transfer.originAsset
  );
  const originChain = useSelector(
    (state: RootState) => state.transfer.originChain
  );
  const sourceChain = useSelector(
    (state: RootState) => state.transfer.sourceChain
  );
  const { warnings, isRedeemDisabled } = useRedeemControl(
    transferRules,
    sourceChain,
    targetChain,
    originAsset,
    originChain
  );
  const useAutomaticRelay = useMemo(
    () => targetAsset && targetChain === CHAIN_ID_SEI,
    [targetAsset, targetChain]
  );
  const isRelayed = useMemo(
    () => useRelayer || useAutomaticRelay,
    [useRelayer, useAutomaticRelay]
  );
  const { isTransferCompletedLoading, isTransferCompleted } =
    useGetIsTransferCompleted(
      isRelayed ? false : true,
      isRelayed ? 5000 : undefined
    );
  const relayerContent = (
    <>
      {isEVMChain(targetChain) && !isTransferCompleted && !targetIsAcala ? (
        <KeyAndBalance chainId={targetChain} />
      ) : null}

      {!isReady &&
      isEVMChain(targetChain) &&
      !isTransferCompleted &&
      !targetIsAcala ? (
        <Typography className={classes.centered}>
          {"Please connect your wallet to check for transfer completion."}
        </Typography>
      ) : null}

      {(!isEVMChain(targetChain) || isReady) &&
      !isTransferCompleted &&
      !targetIsAcala ? (
        <div className={classes.centered}>
          <CircularProgress style={{ marginBottom: 16 }} />
          <Typography>
            {"Waiting for a relayer to process your transfer."}
          </Typography>
          <Tooltip title="Your fees will be refunded on the target chain">
            <ButtonWithLoader
              onClick={handleManuallyRedeemClick}
              showLoader={showLoader}
              disabled={showLoader}
            >
              Manually redeem instead
            </ButtonWithLoader>
          </Tooltip>
        </div>
      ) : null}

      {/* TODO: handle recovery */}
      {targetIsAcala && !isTransferCompleted ? (
        <div className={classes.centered}>
          <ButtonWithLoader
            disabled={disabled}
            onClick={handleAcalaRelayerRedeemClick}
            showLoader={showLoader}
          >
            <span>
              Redeem ({CHAINS_BY_ID[targetChain].name} pays gas for you
              &#127881;)
            </span>
          </ButtonWithLoader>
          <ButtonWithLoader
            onClick={handleManuallyRedeemClick}
            showLoader={showLoader}
            disabled={showLoader}
          >
            Manually redeem instead
          </ButtonWithLoader>
        </div>
      ) : null}

      {isTransferCompleted ? (
        <RedeemPreview overrideExplainerString="Success! Your transfer is complete." />
      ) : null}
    </>
  );

  const nonRelayContent = (
    <>
      <KeyAndBalance chainId={targetChain} />
      {isTerraChain(targetChain) && (
        <TerraFeeDenomPicker disabled={disabled} chainId={targetChain} />
      )}
      {isNativeEligible && (
        <FormControlLabel
          control={
            <Checkbox
              checked={useNativeRedeem}
              onChange={toggleNativeRedeem}
              color="primary"
            />
          }
          label="Automatically unwrap to native currency"
        />
      )}
      {targetChain === CHAIN_ID_SOLANA && CLUSTER === "mainnet" && (
        <SolanaTPSWarning />
      )}
      {targetChain === CHAIN_ID_SOLANA ? (
        <SolanaCreateAssociatedAddressAlternate />
      ) : null}
      {warnings.map((message, key) => (
        <ChainWarningMessage message={message} key={key} />
      ))}
      <>
        {" "}
        <ButtonWithLoader
          //TODO disable when the associated token account is confirmed to not exist
          disabled={
            isRedeemDisabled ||
            !isReady ||
            disabled ||
            (isRecovery && (isTransferCompletedLoading || isTransferCompleted))
          }
          onClick={
            isNativeEligible && useNativeRedeem
              ? handleNativeClick
              : handleClick
          }
          showLoader={
            !isRedeemDisabled &&
            (showLoader || (isRecovery && isTransferCompletedLoading))
          }
          error={statusMessage}
        >
          Redeem
        </ButtonWithLoader>
        <WaitingForWalletMessage />
      </>

      {useRelayer && !isTransferCompleted ? (
        <div className={classes.centered}>
          <Button
            onClick={handleSwitchToRelayViewClick}
            size="small"
            variant="outlined"
            style={{ marginTop: 16 }}
          >
            Return to relayer view
          </Button>
        </div>
      ) : null}

      {isRecovery && isReady && isTransferCompleted ? (
        <>
          <Alert severity="info" variant="outlined" className={classes.alert}>
            These tokens have already been redeemed.{" "}
            {!isEVMChain(targetChain) && howToAddTokensUrl ? (
              <Link
                href={howToAddTokensUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to see how to add them to your wallet.
              </Link>
            ) : null}
          </Alert>
          {targetAsset ? (
            <>
              <span>Token Address:</span>
              <SmartAddress
                chainId={targetChain}
                address={targetAsset || undefined}
                isAsset
              />
            </>
          ) : null}
          {isEVMChain(targetChain) ? <AddToMetamask /> : null}
          <ButtonWithLoader onClick={handleResetClick}>
            Transfer More Tokens!
          </ButtonWithLoader>
        </>
      ) : null}
    </>
  );

  return (
    <>
      <StepDescription>Receive the tokens on the target chain</StepDescription>
      {useAutomaticRelay ? (
        <AutomaticRelayRedeem
          isTransferCompleted={isTransferCompleted}
          chainId={targetChain}
          handleManualRedeem={
            isNativeEligible && useNativeRedeem
              ? handleNativeClick
              : handleClick
          }
        />
      ) : manualRedeem ? (
        nonRelayContent
      ) : (
        relayerContent
      )}
    </>
  );
}

export default Redeem;

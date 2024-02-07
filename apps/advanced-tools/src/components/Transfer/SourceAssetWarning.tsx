import {
  ChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_POLYGON,
} from "@certusone/wormhole-sdk";
import { makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  ETH_POLYGON_WRAPPED_TOKENS,
  POLYGON_TERRA_WRAPPED_TOKENS,
} from "../../utils/consts";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function PolygonTerraWrappedWarning() {
  const classes = useStyles();
  return (
    <Alert severity="warning" variant="outlined" className={classes.alert}>
      <Typography variant="body1">
        This is a Shuttle-wrapped asset from Polygon! Transferring it will
        result in a double wrapped (Portal-wrapped Shuttle-wrapped) asset, which
        has no liquid markets.
      </Typography>
    </Alert>
  );
}

function EthPolygonWrappedWarning() {
  const classes = useStyles();
  return (
    <Alert severity="warning" variant="outlined" className={classes.alert}>
      <Typography variant="body1">
        This is a Polygon Bridge-wrapped asset from Ethereum! Transferring it
        will result in a double wrapped (Portal-wrapped Polygon-wrapped) asset,
        which has no liquid markets.
      </Typography>
    </Alert>
  );
}

export default function SoureAssetWarning({
  sourceChain,
  sourceAsset,
}: {
  sourceChain?: ChainId;
  sourceAsset?: string;
  originChain?: ChainId;
  targetChain?: ChainId;
  targetAsset?: string;
}) {
  if (!(sourceChain && sourceAsset)) {
    return null;
  }

  const searchableAddress: string = sourceAsset.toLowerCase();

  const showPolygonTerraWrappedWarning =
    sourceChain === CHAIN_ID_POLYGON &&
    POLYGON_TERRA_WRAPPED_TOKENS.some(
      (address) => address.toLowerCase() === searchableAddress
    );

  const showEthPolygonWrappedWarning =
    sourceChain === CHAIN_ID_ETH &&
    ETH_POLYGON_WRAPPED_TOKENS.some(
      (address) => address.toLowerCase() === searchableAddress
    );

  return (
    <>
      {showPolygonTerraWrappedWarning && <PolygonTerraWrappedWarning />}
      {showEthPolygonWrappedWarning && <EthPolygonWrappedWarning />}
    </>
  );
}

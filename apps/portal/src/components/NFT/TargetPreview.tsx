import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectNFTTargetAddressHex,
  selectNFTTargetChain,
} from "../../store/selectors";
import { CHAINS_BY_ID, getWalletAddressNative } from "../../utils/consts";
import SmartAddress from "../SmartAddress";

const useStyles = makeStyles((theme) => ({
  description: {
    textAlign: "center",
  },
}));

export default function TargetPreview() {
  const classes = useStyles();
  const targetChain = useSelector(selectNFTTargetChain);
  const targetAddress = useSelector(selectNFTTargetAddressHex);
  const targetAddressNative = targetAddress
    ? getWalletAddressNative(targetAddress, targetChain)
    : undefined;

  const explainerContent =
    targetChain && targetAddressNative ? (
      <>
        <span>to</span>
        <SmartAddress chainId={targetChain} address={targetAddressNative} />
        <span>on {CHAINS_BY_ID[targetChain].name}</span>
      </>
    ) : (
      ""
    );

  return (
    <Typography
      component="div"
      variant="subtitle2"
      className={classes.description}
    >
      {explainerContent}
    </Typography>
  );
}

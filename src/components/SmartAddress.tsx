import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_CELO,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_KARURA,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
  CHAIN_ID_ACALA,
  isTerraChain,
  CHAIN_ID_TERRA2,
  TerraChainId,
  CHAIN_ID_NEAR,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_XPLA,
  CHAIN_ID_APTOS,
  isValidAptosType,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_INJECTIVE,
  terra,
  CHAIN_ID_OPTIMISM,
  CHAIN_ID_SUI,
  CHAIN_ID_BASE,
  CHAIN_ID_WORLDCHAIN,
  CHAIN_ID_SCROLL,
  CHAIN_ID_MANTLE,
  CHAIN_ID_XLAYER,
  CHAIN_ID_BERACHAIN,
  CHAIN_ID_UNICHAIN,
} from "@certusone/wormhole-sdk";
import { Button, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { FileCopy, OpenInNew } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import { ReactChild } from "react";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { ParsedTokenAccount } from "../store/transferSlice";
import { CLUSTER, getExplorerName } from "../utils/consts";
import { shortenAddress } from "../utils/solana";
import { formatNativeDenom } from "../utils/terra";

const useStyles = makeStyles((theme) => ({
  mainTypog: {
    display: "inline-block",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  noGutter: {
    marginLeft: 0,
    marginRight: 0,
  },
  noUnderline: {
    textDecoration: "none",
  },
  buttons: {
    marginLeft: ".5rem",
    marginRight: ".5rem",
  },
}));

const tooltipStyles = {
  tooltip: {
    minWidth: "max-content",
    textAlign: "center",
    "& > *": {
      margin: ".25rem",
    },
  },
};

// @ts-ignore
const StyledTooltip = withStyles(tooltipStyles)(Tooltip);

export default function SmartAddress({
  chainId,
  parsedTokenAccount,
  address,
  symbol,
  tokenName,
  variant,
  noGutter,
  noUnderline,
  extraContent,
  isAsset,
  propertyVersion,
}: {
  chainId: ChainId;
  parsedTokenAccount?: ParsedTokenAccount;
  address?: string;
  logo?: string;
  tokenName?: string;
  symbol?: string;
  variant?: any;
  noGutter?: boolean;
  noUnderline?: boolean;
  extraContent?: ReactChild;
  isAsset?: boolean;
  propertyVersion?: string;
}) {
  const classes = useStyles();
  const isNativeTerra = isTerraChain(chainId) && terra.isNativeDenom(address);
  const useableAddress = parsedTokenAccount?.mintKey || address || "";
  const useableSymbol = isNativeTerra
    ? formatNativeDenom(address || "", chainId as TerraChainId)
    : parsedTokenAccount?.symbol || symbol || "";
  // const useableLogo = logo || isNativeTerra ? getNativeTerraIcon(useableSymbol) : null
  const isNative = parsedTokenAccount?.isNativeAsset || isNativeTerra || false;
  const addressShort = shortenAddress(useableAddress) || "";

  const useableName = isNative
    ? "Native Currency"
    : parsedTokenAccount?.name
    ? parsedTokenAccount.name
    : tokenName
    ? tokenName
    : "";
  const explorerAddress = isNative
    ? null
    : chainId === CHAIN_ID_ETH
    ? `https://${CLUSTER === "testnet" ? "goerli." : ""}etherscan.io/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_BSC
    ? `https://${CLUSTER === "testnet" ? "testnet." : ""}bscscan.com/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_POLYGON
    ? `https://${CLUSTER === "testnet" ? "mumbai." : ""}polygonscan.com/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_AVAX
    ? `https://${CLUSTER === "testnet" ? "testnet." : ""}snowtrace.io/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_OASIS
    ? `https://${
        CLUSTER === "testnet" ? "testnet." : ""
      }explorer.emerald.oasis.dev/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_FANTOM
    ? `https://${CLUSTER === "testnet" ? "testnet." : ""}ftmscan.com/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_KLAYTN
    ? `https://${CLUSTER === "testnet" ? "baobab." : ""}kaiascope.com/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_CELO
    ? `https://${
        CLUSTER === "testnet" ? "alfajores.celoscan.io" : "explorer.celo.org"
      }/address/${useableAddress}`
    : chainId === CHAIN_ID_KARURA
    ? `https://${
        CLUSTER === "testnet"
          ? "blockscout.karura-dev.aca-dev.network"
          : "blockscout.karura.network"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_ACALA
    ? `https://${
        CLUSTER === "testnet"
          ? "blockscout.acala-dev.aca-dev.network"
          : "blockscout.acala.network"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_SOLANA
    ? `https://solscan.io/address/${useableAddress}${
        CLUSTER === "testnet"
          ? "?cluster=devnet"
          : CLUSTER === "devnet"
          ? "?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899"
          : ""
      }`
    : chainId === CHAIN_ID_TERRA
    ? CLUSTER === "mainnet"
      ? `https://finder.terra.money/columbus-5/address/${useableAddress}`
      : undefined
    : chainId === CHAIN_ID_TERRA2
    ? `https://finder.terra.money/${
        CLUSTER === "devnet"
          ? "localterra"
          : CLUSTER === "testnet"
          ? "pisco-1"
          : "phoenix-1"
      }/address/${useableAddress}`
    : chainId === CHAIN_ID_ALGORAND
    ? `https://${
        CLUSTER === "testnet" ? "testnet." : ""
      }explorer.perawallet.app/${
        isAsset ? "asset" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_NEAR
    ? `https://explorer.${
        CLUSTER === "testnet" ? "testnet." : ""
      }near.org/accounts/${useableAddress}`
    : chainId === CHAIN_ID_MOONBEAM
    ? `https://${CLUSTER === "testnet" ? "moonbase." : ""}moonscan.io/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_BASE
    ? `https://${CLUSTER === "testnet" ? "goerli." : ""}basescan.org/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_XPLA
    ? `https://explorer.xpla.io/${
        CLUSTER === "testnet" ? "testnet" : "mainnet"
      }/address/${useableAddress}`
    : chainId === CHAIN_ID_WORLDCHAIN
    ? `https://${
        CLUSTER === "testnet"
          ? "worldchain-sepolia.explorer.alchemy.com"
          : "worldscan.org"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_BERACHAIN
    ? `https://${
        CLUSTER === "testnet"
          ? "bartio.beratrail.io"
          : "berascan.com"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_UNICHAIN
    ? `https://${
        CLUSTER === "testnet"
          ? "unichain-sepolia.blockscout.com"
          : "unichain.blockscout.com"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_SCROLL
    ? `https://${
        CLUSTER === "testnet" ? "sepolia.scrollscan.dev" : "scrollscan.com"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_MANTLE
    ? `https://${
        CLUSTER === "testnet"
          ? "explorer.testnet.mantle.xyz"
          : "explorer.mantle.xyz"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_XLAYER
    ? `https://${
        CLUSTER === "testnet"
          ? "www.okx.com/web3/explorer/xlayer-test"
          : "www.okx.com/web3/explorer/xlayer"
      }/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_APTOS
    ? propertyVersion !== undefined // NFT
      ? `https://explorer.aptoslabs.com/token/${useableAddress}/${propertyVersion}${
          CLUSTER === "testnet"
            ? "?network=testnet"
            : CLUSTER === "devnet"
            ? "?network=local"
            : ""
        }`
      : `https://explorer.aptoslabs.com/account/${
          isValidAptosType(useableAddress)
            ? useableAddress.split("::")[0]
            : useableAddress
        }${
          CLUSTER === "testnet"
            ? "?network=testnet"
            : CLUSTER === "devnet"
            ? "?network=local"
            : ""
        }`
    : chainId === CHAIN_ID_ARBITRUM
    ? `https://${CLUSTER === "testnet" ? "goerli." : ""}arbiscan.io/${
        isAsset ? "token" : "address"
      }/${useableAddress}`
    : chainId === CHAIN_ID_INJECTIVE
    ? `https://${
        CLUSTER === "testnet" ? "testnet." : ""
      }explorer.injective.network/${
        isAsset
          ? `asset/?tokenType=${isNative ? "native" : "cw20"}&tokenIdentifier=`
          : "account/"
      }${useableAddress}`
    : chainId === CHAIN_ID_OPTIMISM
    ? `https://${
        CLUSTER === "testnet" ? "goerli-optimism." : "optimistic."
      }etherscan.io/${isAsset ? "token" : "address"}/${useableAddress}`
    : chainId === CHAIN_ID_SUI // TODO: might need to change for assets / tokens?
    ? `https://explorer.sui.io/address/${useableAddress}${
        CLUSTER === "testnet"
          ? "?network=testnet"
          : CLUSTER === "devnet"
          ? "?network=local"
          : "?network=https%3A%2F%2Frpc.mainnet.sui.io"
      }`
    : undefined;
  const explorerName = getExplorerName(chainId);

  const copyToClipboard = useCopyToClipboard(useableAddress);

  const explorerButton = !explorerAddress ? null : (
    <Button
      size="small"
      variant="outlined"
      startIcon={<OpenInNew />}
      className={classes.buttons}
      href={explorerAddress}
      target="_blank"
      rel="noopener noreferrer"
    >
      {"View on " + explorerName}
    </Button>
  );
  //TODO add icon here
  const copyButton = isNative ? null : (
    <Button
      size="small"
      variant="outlined"
      startIcon={<FileCopy />}
      onClick={copyToClipboard}
      className={classes.buttons}
    >
      Copy
    </Button>
  );

  const tooltipContent = (
    <>
      {useableName && <Typography>{useableName}</Typography>}
      {useableSymbol && !isNative && (
        <Typography noWrap variant="body2">
          {addressShort}
        </Typography>
      )}
      <div>
        {explorerButton}
        {copyButton}
      </div>
      {extraContent ? extraContent : null}
    </>
  );

  return (
    <StyledTooltip
      title={tooltipContent}
      interactive={true}
      className={classes.mainTypog}
    >
      <Typography
        variant={variant || "body1"}
        className={clsx(classes.mainTypog, {
          [classes.noGutter]: noGutter,
          [classes.noUnderline]: noUnderline,
        })}
        component="div"
      >
        {useableSymbol || addressShort}
      </Typography>
    </StyledTooltip>
  );
}

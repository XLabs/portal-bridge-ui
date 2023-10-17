import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_AURORA,
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
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_XPLA,
  CHAIN_ID_APTOS,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_OPTIMISM,
  CHAIN_ID_SUI,
  CHAIN_ID_BASE,
} from "@certusone/wormhole-sdk";
import { CHAIN_ID_NEAR } from "@certusone/wormhole-sdk/lib/esm";
import { Button, makeStyles, Typography, Chip } from "@material-ui/core";
import { Transaction } from "../store/transferSlice";
import { CLUSTER, getExplorerName, getWormholescanLink } from "../utils/consts";

const useStyles = makeStyles((theme) => ({
  tx: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  txButtons: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(3),
    marginTop: 20,
  },
  wormscanButton: {
    position: "relative",
  },
  newTag: {
    position: "absolute",
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.background.default,
    fontSize: 12,
    fontWeight: 500,
  },
  viewButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function ShowTx({
  chainId,
  tx,
  showWormscanLink = true,
}: {
  chainId: ChainId;
  tx: Transaction;
  showWormscanLink?: boolean;
}) {
  const classes = useStyles();
  const showExplorerLink =
    CLUSTER === "testnet" ||
    CLUSTER === "mainnet" ||
    (CLUSTER === "devnet" &&
      (chainId === CHAIN_ID_SOLANA ||
        isTerraChain(chainId) ||
        chainId === CHAIN_ID_APTOS));
  const explorerAddress =
    chainId === CHAIN_ID_ETH
      ? `https://${
          CLUSTER === "testnet" ? "goerli." : ""
        }etherscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_BSC
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }bscscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_POLYGON
      ? `https://${
          CLUSTER === "testnet" ? "mumbai." : ""
        }polygonscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_AVAX
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }snowtrace.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_OASIS
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }explorer.emerald.oasis.dev/tx/${tx?.id}`
      : chainId === CHAIN_ID_AURORA
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }aurorascan.dev/tx/${tx?.id}`
      : chainId === CHAIN_ID_FANTOM
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }ftmscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_KLAYTN
      ? `https://${
          CLUSTER === "testnet" ? "baobab." : ""
        }scope.klaytn.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_CELO
      ? `https://${
          CLUSTER === "testnet" ? "alfajores.celoscan.io" : "explorer.celo.org"
        }/tx/${tx?.id}`
      : chainId === CHAIN_ID_KARURA
      ? `https://${
          CLUSTER === "testnet"
            ? "blockscout.karura-dev.aca-dev.network"
            : "blockscout.karura.network"
        }/tx/${tx?.id}`
      : chainId === CHAIN_ID_ACALA
      ? `https://${
          CLUSTER === "testnet"
            ? "blockscout.acala-dev.aca-dev.network"
            : "blockscout.acala.network"
        }/tx/${tx?.id}`
      : chainId === CHAIN_ID_SOLANA
      ? `https://solscan.io/tx/${tx?.id}${
          CLUSTER === "testnet"
            ? "?cluster=devnet"
            : CLUSTER === "devnet"
            ? "?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899"
            : ""
        }`
      : chainId === CHAIN_ID_TERRA
      ? CLUSTER === "mainnet"
        ? `https://finder.terra.money/columbus-5/tx/${tx?.id}`
        : undefined
      : chainId === CHAIN_ID_TERRA2
      ? `https://finder.terra.money/${
          CLUSTER === "devnet"
            ? "localterra"
            : CLUSTER === "testnet"
            ? "pisco-1"
            : "phoenix-1"
        }/tx/${tx?.id}`
      : chainId === CHAIN_ID_ALGORAND
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }algoexplorer.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_NEAR
      ? `https://explorer.${
          CLUSTER === "testnet" ? "testnet." : ""
        }near.org/transactions/${tx?.id}`
      : chainId === CHAIN_ID_MOONBEAM
      ? `https://${
          CLUSTER === "testnet" ? "moonbase." : ""
        }moonscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_BASE
      ? `https://${
          CLUSTER === "testnet" ? "goerli." : ""
        }basescan.org/tx/${tx?.id}`
      : chainId === CHAIN_ID_XPLA
      ? `https://explorer.xpla.io/${
          CLUSTER === "testnet" ? "testnet" : "mainnet"
        }/tx/${tx?.id}`
      : chainId === CHAIN_ID_APTOS
      ? `https://explorer.aptoslabs.com/txn/${tx?.id}${
          CLUSTER === "testnet"
            ? "?network=testnet"
            : CLUSTER === "devnet"
            ? "?network=local"
            : ""
        }`
      : chainId === CHAIN_ID_ARBITRUM
      ? `https://${
          CLUSTER === "testnet" ? "goerli." : ""
        }arbiscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_INJECTIVE
      ? `https://${
          CLUSTER === "testnet" ? "testnet." : ""
        }explorer.injective.network/transaction/${tx.id}`
      : chainId === CHAIN_ID_OPTIMISM
      ? `https://${
          CLUSTER === "testnet" ? "goerli-optimism." : "optimistic."
        }etherscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_SUI
      ? `https://explorer.sui.io/txblock/${tx?.id}${
          CLUSTER === "testnet"
            ? "?network=testnet"
            : CLUSTER === "devnet"
            ? "?network=local"
            : "?network=https%3A%2F%2Frpc.mainnet.sui.io"
        }`
      : undefined;
  const explorerName = getExplorerName(chainId);

  return (
    <div className={classes.tx}>
      <div>
        <Typography noWrap component="div" variant="body2">
          {tx.id}
        </Typography>
      </div>
      <div className={classes.txButtons}>
        {showExplorerLink && explorerAddress ? (
          <Button
            href={explorerAddress}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            variant="outlined"
            className={classes.viewButton}
          >
            View on {explorerName}
          </Button>
        ) : null}
        {showExplorerLink && showWormscanLink && tx.id && (
          <div className={classes.wormscanButton}>
            <Button
              href={getWormholescanLink(tx.id)}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              className={classes.viewButton}
            >
              View on Wormholescan
            </Button>
            <Chip className={classes.newTag} label="NEW!" size="small" />
          </div>
        )}
      </div>
    </div>
  );
}

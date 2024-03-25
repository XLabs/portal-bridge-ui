import {
  ChainId,
  CHAIN_ID_ACALA,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_AURORA,
  CHAIN_ID_CELO,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_KARURA,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_MOONBEAM,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_OPTIMISM,
  isEVMChain,
  CHAIN_ID_BASE,
} from "@certusone/wormhole-sdk";
import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { Transaction } from "../store/transferSlice";
import { CHAINS_BY_ID, CLUSTER, SOLANA_HOST } from "../utils/consts";
import SmartBlock from "./SmartBlock";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  message: {
    marginTop: theme.spacing(1),
  },
}));

export default function TransactionProgress({
  chainId,
  tx,
  isSendComplete,
}: {
  chainId: ChainId;
  tx: Transaction | undefined;
  isSendComplete: boolean;
}) {
  const classes = useStyles();
  const { provider } = useEthereumProvider(chainId as any);
  const [currentBlock, setCurrentBlock] = useState(0);
  useEffect(() => {
    if (isSendComplete || !tx) return;
    if (isEVMChain(chainId) && provider) {
      let cancelled = false;
      (async () => {
        while (!cancelled) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          try {
            const newBlock =
              chainId === CHAIN_ID_ETH
                ? (await provider.getBlock("finalized")).number
                : await provider.getBlockNumber();
            if (!cancelled) {
              setCurrentBlock(newBlock);
            }
          } catch (e) {
            console.error(e);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    if (chainId === CHAIN_ID_SOLANA) {
      let cancelled = false;
      const connection = new Connection(SOLANA_HOST, "confirmed");
      const sub = connection.onSlotChange((slotInfo) => {
        if (!cancelled) {
          setCurrentBlock(slotInfo.slot);
        }
      });
      return () => {
        cancelled = true;
        connection.removeSlotChangeListener(sub);
      };
    }
  }, [isSendComplete, chainId, provider, tx]);
  if (chainId === CHAIN_ID_ETH) {
    if (!isSendComplete && tx && tx.block && currentBlock) {
      const isFinalized = currentBlock >= tx.block;
      return (
        <div className={classes.root}>
          <Typography variant="body2" className={classes.message}>
            {!isFinalized
              ? `Waiting for finality on ${CHAINS_BY_ID[chainId].name} which may take up to 15 minutes.`
              : `Waiting for Wormhole Network consensus...`}
          </Typography>
          {!isFinalized ? (
            <>
              <span>Last finalized block number</span>
              <SmartBlock chainId={chainId} blockNumber={currentBlock} />
              <span>This transaction's block number</span>
              <SmartBlock chainId={chainId} blockNumber={tx.block} />
            </>
          ) : null}
        </div>
      );
    }
  } else {
    const blockDiff =
      tx && tx.block && currentBlock ? currentBlock - tx.block : undefined;
    const expectedBlocks = // minimum confirmations enforced by guardians or specified by the contract
      chainId === CHAIN_ID_POLYGON
        ? CLUSTER === "testnet"
          ? 64
          : 512
        : chainId === CHAIN_ID_OASIS ||
          chainId === CHAIN_ID_AURORA ||
          chainId === CHAIN_ID_FANTOM ||
          chainId === CHAIN_ID_KARURA ||
          chainId === CHAIN_ID_ACALA ||
          chainId === CHAIN_ID_KLAYTN ||
          chainId === CHAIN_ID_CELO ||
          chainId === CHAIN_ID_MOONBEAM ||
          chainId === CHAIN_ID_OPTIMISM
        ? 1 // these chains only require 1 conf
        : chainId === CHAIN_ID_SOLANA
        ? 32
        : chainId === CHAIN_ID_ARBITRUM
        ? 64
        : chainId === CHAIN_ID_BASE
        ? 124 // something to show progress
        : isEVMChain(chainId)
        ? 15
        : 1;
    if (
      !isSendComplete &&
      (chainId === CHAIN_ID_SOLANA || isEVMChain(chainId)) &&
      blockDiff !== undefined
    ) {
      return (
        <div className={classes.root}>
          <LinearProgress
            value={
              blockDiff < expectedBlocks
                ? (blockDiff / expectedBlocks) * 75
                : 75
            }
            variant="determinate"
          />
          <Typography variant="body2" className={classes.message}>
            {chainId === CHAIN_ID_ARBITRUM
              ? `Waiting for Ethereum finality on Arbitrum block ${tx?.block}` //TODO: more advanced finality checking for Arbitrum
              : chainId === CHAIN_ID_BASE
              ? `Waiting for Ethereum finality on Base block ${tx?.block}` //TODO: more advanced finality checking for Base
              : chainId === CHAIN_ID_OPTIMISM
              ? `Waiting for Ethereum finality on Optimism block ${tx?.block}`
              : blockDiff < expectedBlocks
              ? `Waiting for ${blockDiff} / ${expectedBlocks} confirmations on ${CHAINS_BY_ID[chainId].name}...`
              : chainId === CHAIN_ID_POLYGON
              ? `Waiting for finality on ${CHAINS_BY_ID[chainId].name} which may take between 30 minutes to 3 hours to complete.`
              : `Waiting for Wormhole Network consensus...`}
          </Typography>
        </div>
      );
    }
  }
  return null;
}

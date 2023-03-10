import { TransactionSignerPair } from "@certusone/wormhole-sdk/lib/esm/algorand";
import { AlgorandWallet } from "@xlabs-libs/wallet-aggregator-algorand";
import { Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import { ALGORAND_WAIT_FOR_CONFIRMATIONS } from "./consts";

export async function signSendAndConfirmAlgorand(
  wallet: AlgorandWallet,
  algodClient: Algodv2,
  txs: TransactionSignerPair[]
) {
  assignGroupID(txs.map((tx) => tx.tx));

  // some wallets like Pera expect the whole group to be present
  // even though not all of them might be signed
  const unsignedTxns = txs.map((pair) => ({
    txn: Buffer.from(pair.tx.toByte()).toString("base64"),
    signers: pair.signer ? [] : undefined,
  }));

  const walletSignedTxns = await wallet.signTransaction(unsignedTxns);

  const signedTxns = [];
  for (let i = 0; i < txs.length; i++) {
    const signature = walletSignedTxns[i];
    if (signature) {
      signedTxns.push(Buffer.from(signature, "base64"));
    } else {
      const pair = txs[i];
      if (!pair.signer)
        throw new Error("Got transaction with no signature nor lsig");
      signedTxns.push(await pair.signer.signTxn(pair.tx));
    }
  }

  await algodClient.sendRawTransaction(signedTxns).do();
  const result = await waitForConfirmation(
    algodClient,
    txs[txs.length - 1].tx.txID(),
    ALGORAND_WAIT_FOR_CONFIRMATIONS
  );
  return result;
}

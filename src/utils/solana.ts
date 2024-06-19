import {
  TransactionSignatureAndResponse,
  modifySignTransaction,
} from "@certusone/wormhole-sdk/lib/cjs/solana";
import { createPostSignedVaaTransactions } from "@certusone/wormhole-sdk/lib/cjs/solana/sendAndConfirmPostVaa";
import { BigNumber } from "@ethersproject/bignumber";
import { MintLayout } from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Transaction,
  PublicKeyInitData,
  ConfirmOptions,
  RpcResponseAndContext,
  SignatureResult,
  Commitment,
  TransactionExpiredBlockheightExceededError,
  VersionedTransactionResponse,
  BlockhashWithExpiryBlockHeight,
} from "@solana/web3.js";
import promiseRetry from "promise-retry";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";
import { addComputeBudget } from "./computeBudget";
export declare type SignTransaction = (
  transaction: Transaction
) => Promise<Transaction>;

export async function signSendAndConfirm(
  wallet: SolanaWallet,
  transaction: Transaction
) {
  if (!wallet.signTransaction) {
    throw new Error("wallet.signTransaction is undefined");
  }
  const { id } = await wallet.signAndSendTransaction({
    transaction,
    options: {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    },
  });
  return id;
}

export interface ExtractedMintInfo {
  mintAuthority?: string;
  supply?: string;
}

export function extractMintInfo(
  account: AccountInfo<Buffer>
): ExtractedMintInfo {
  const data = Buffer.from(account.data);
  const mintInfo = MintLayout.decode(data);

  const uintArray = mintInfo?.mintAuthority;
  const pubkey = new PublicKey(uintArray);
  const supply = BigNumber.from(mintInfo?.supply).toString();
  const output = {
    mintAuthority: pubkey?.toString(),
    supply: supply.toString(),
  };

  return output;
}

export async function getMultipleAccountsRPC(
  connection: Connection,
  pubkeys: PublicKey[]
): Promise<(AccountInfo<Buffer> | null)[]> {
  return getMultipleAccounts(connection, pubkeys, "confirmed");
}

export const getMultipleAccounts = async (
  connection: any,
  pubkeys: PublicKey[],
  commitment: string
) => {
  return (
    await Promise.all(
      chunks(pubkeys, 99).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk, commitment)
      )
    )
  ).flat();
};

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export function shortenAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : address;
}

export async function postVaa(
  connection: Connection,
  signTransaction: SignTransaction,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  vaa: Buffer,
  options?: ConfirmOptions,
  asyncVerifySignatures: boolean = true
): Promise<void> {
  const { unsignedTransactions, signers } =
    await createPostSignedVaaTransactions(
      connection,
      wormholeProgramId,
      payer,
      vaa,
      options?.commitment
    );

  const postVaaTransaction = unsignedTransactions.pop()!;

  for (const unsignedTransaction of unsignedTransactions) {
    unsignedTransaction.feePayer = new PublicKey(payer);
    await addComputeBudget(connection, unsignedTransaction, [], 0.75, 1, true);
  }
  console.log('verifySignatures');
  const verifySignatures = async (transaction: Transaction) =>
    signSendAndConfirmTransaction(
      connection,
      payer,
      modifySignTransaction(signTransaction, ...signers),
      transaction,
      options
    );

  const output = [];
  /*const txs = await sendAndConfirmTransactionsWithRetry(
    connection,
    modifySignTransaction(signTransaction, ...signers),
    payer.toString(),
    unsignedTransactions,
    options?.maxRetries,
    options?.commitment
  );
  output.push(...txs);*/

  if (asyncVerifySignatures) {
    const verified = await Promise.all(
      unsignedTransactions.map(async (transaction) =>
        verifySignatures(transaction)
      )
    );
    output.push(...verified);
  } else {
    for (const transaction of unsignedTransactions) {
      output.push(await verifySignatures(transaction));
    }
  }

  console.log('verifySignatures', output);
  //While the signature_set is used to create the final instruction, it doesn't need to sign it.
  await addComputeBudget(connection, postVaaTransaction, [], 0.75, 1, true);
  console.log('postVaaTransaction');
  output.push(
    await signSendAndConfirmTransaction(
      connection,
      payer,
      signTransaction,
      postVaaTransaction,
      options
    )
  );
  console.log('postVaaTransaction', output);
  //return output;
}

export async function sendAndConfirmTransactionsWithRetry(
  connection: Connection,
  signTransaction: SignTransaction,
  payer: string,
  unsignedTransactions: Transaction[],
  maxRetries = 0,
  commitment: Commitment = 'finalized',
): Promise<TransactionSignatureAndResponse[]> {
  if (unsignedTransactions.length === 0) {
    return Promise.reject('No transactions provided to send.');
  }

  let currentRetries = 0;
  const output= [];
  for (const transaction of unsignedTransactions) {
    while (currentRetries <= maxRetries) {
      try {
        const result = await signSendAndConfirmTransaction(
          connection,
          payer,
          signTransaction,
          transaction,
          {commitment, maxRetries},
        );
        output.push(result);
        break;
      } catch (e) {
        console.error(e);
        ++currentRetries;
      }
    }
    if (currentRetries > maxRetries) {
      return Promise.reject('Reached the maximum number of retries.');
    }
  }

  return Promise.resolve(output);
}
/**
 * The transactions provided to this function should be ready to send.
 * This function will do the following:
 * 1. Add the {@param payer} as the feePayer and latest blockhash to the {@link Transaction}.
 * 2. Sign using {@param signTransaction}.
 * 3. Send raw transaction.
 * 4. Confirm transaction.
 */
export async function signSendAndConfirmTransaction(
  connection: Connection,
  payer: PublicKeyInitData,
  signTransaction: SignTransaction,
  unsignedTransaction: Transaction,
  options?: ConfirmOptions
): Promise<TransactionSignatureAndResponse> {
  const commitment = options?.commitment;
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);
  unsignedTransaction.recentBlockhash = blockhash;
  unsignedTransaction.feePayer = new PublicKey(payer);
  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preFlightCommitment: commitment,
  };
  // Sign transaction, broadcast, and confirm
  const signed = await signTransaction(unsignedTransaction);
  const signedSerialized = signed.serialize();
  const txRetryInterval = 5000;
  let txSendAttempts = 1;
  let confirmTransactionPromise: Promise<
    RpcResponseAndContext<SignatureResult>
  > | null = null;
  let confirmedTx: RpcResponseAndContext<SignatureResult> | null = null;
  // const result = await transactionSenderAndConfirmationWaiter({
  //   connection,
  //   serializedTransaction: signedSerialized,
  //   blockhashWithExpiryBlockHeight: {
  //     blockhash,
  //     lastValidBlockHeight,
  //   },
  // }
  // )
  // return result;
  let signature = await connection.sendRawTransaction(
    signedSerialized,
    sendOptions
  );
  confirmTransactionPromise = connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    commitment
  );
  // Retry sending the transaction if it's not confirmed after a certain interval
  while (!confirmedTx) {
    confirmedTx = await Promise.race([
      confirmTransactionPromise,
      new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, txRetryInterval)
      ),
    ]);
    if (confirmedTx) {
      break;
    }
    console.log(
      `Tx not confirmed after ${
        txRetryInterval * txSendAttempts++
      }ms, resending`
    );
    try {
      await connection.sendRawTransaction(signedSerialized, sendOptions);
    } catch (e) {
      console.error("Failed to resend transaction:", e);
    }
  }
  return {
    signature,
    response: confirmedTx,
  };
}


type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

const SEND_OPTIONS = {
  skipPreflight: true,
};

  export const wait = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
  const txid = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );

  const controller = new AbortController();
  const abortSignal = controller.signal;
  const abortableResender = async () => {
    while (true) {
      await wait(2_000);
      if (abortSignal.aborted) return;
      try {
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS
        );
      } catch (e) {
        console.warn(`Failed to resend transaction: ${e}`);
      }
    }
  };

  try {
    abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

    // this would throw TransactionExpiredBlockheightExceededError
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txid,
          abortSignal,
        },
        "confirmed"
      ),
      new Promise(async (resolve) => {
        // in case ws socket died
        while (!abortSignal.aborted) {
          await wait(2_000);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            resolve(tx);
          }
        }
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      console.log("TransactionExpiredBlockheightExceededError", e);
      // we consume this error and getTransaction would return null
      return null;
    } else {
      // invalid state from web3.js
      throw e;
    }
  } finally {
    controller.abort();
  }

  // in case rpc is not synced yet, we add some retries
  const response = promiseRetry(
    async (retry) => {
      const response = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!response) {
        retry(response);
      }
      return response;
    },
    {
      retries: 5,
      minTimeout: 1e3,
    }
  );

  return response;
}
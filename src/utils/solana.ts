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
} from "@solana/web3.js";
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
): Promise<TransactionSignatureAndResponse[]> {
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

  const output: TransactionSignatureAndResponse[] = [];
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
  return output;
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

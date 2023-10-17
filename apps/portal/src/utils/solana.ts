import { BigNumber } from "@ethersproject/bignumber";
import { MintLayout } from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { SolanaWallet } from "@xlabs-libs/wallet-aggregator-solana";

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
  const supply = BigNumber.from(mintInfo?.supply.reverse()).toString();
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

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  // SlopeWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  // ExodusWalletAdapter,
  // BackpackWalletAdapter,
  NightlyWalletAdapter,
  // BloctoWalletAdapter,
  // BraveWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  PublicKeyInitData,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { CHAIN_ID_SOLANA, Wallet } from "@xlabs-libs/wallet-aggregator-core";
import { useWallet } from "@xlabs-libs/wallet-aggregator-react";
import {
  SolanaAdapter,
  SolanaWallet,
} from "@xlabs-libs/wallet-aggregator-solana";
import { useMemo } from "react";
import { CLUSTER, SOLANA_HOST } from "../utils/consts";
import {
  ChainId,
  ChainName,
  coalesceChainId,
  createNonce,
} from "@certusone/wormhole-sdk";
import {
  createApproveAuthoritySignerInstruction,
  createTransferNativeInstruction,
  createTransferNativeWithPayloadInstruction,
  createTransferWrappedInstruction,
  createTransferWrappedWithPayloadInstruction,
} from "@certusone/wormhole-sdk/lib/esm/solana/tokenBridge";
import {
  ACCOUNT_SIZE,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  getMinimumBalanceForRentExemptAccount,
} from "@solana/spl-token";
import { addComputeBudget } from "../utils/computeBudget";

export const getWrappedWallets = (): Wallet[] => {
  const wallets: SolanaAdapter[] = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // new BackpackWalletAdapter(),
    new NightlyWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    // new SlopeWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter(),
    // new ExodusWalletAdapter(),
    // new BraveWalletAdapter(),
    // new BloctoWalletAdapter(),
  ];

  const network =
    CLUSTER === "mainnet"
      ? WalletAdapterNetwork.Mainnet
      : CLUSTER === "testnet"
      ? WalletAdapterNetwork.Devnet
      : undefined;

  if (network) {
    //wallets.push(new BloctoWalletAdapter({ network }));
  }

  return wallets.map(
    (adapter: SolanaAdapter) =>
      new SolanaWallet(adapter, new Connection(SOLANA_HOST))
  );
};

interface ISolanaContext {
  publicKey?: string;
  wallet?: SolanaWallet;
}

export const useSolanaWallet = (): ISolanaContext => {
  const wallet = useWallet<SolanaWallet>(CHAIN_ID_SOLANA);

  //TIP: Replace Solana wallet address here to debug
  const publicKey = useMemo(() => wallet?.getAddress(), [wallet]);

  return useMemo(
    () => ({
      publicKey,
      wallet,
    }),
    [publicKey, wallet]
  );
};

export async function transferNativeSol(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  amount: bigint,
  targetAddress: Uint8Array | Buffer,
  targetChain: ChainId | ChainName,
  relayerFee: bigint = BigInt(0),
  payload: Uint8Array | Buffer | null = null,
  commitment?: Commitment
) {
  const rentBalance = await getMinimumBalanceForRentExemptAccount(
    connection,
    commitment
  );
  const payerPublicKey = new PublicKey(payerAddress);
  const ancillaryKeypair = Keypair.generate();

  //This will create a temporary account where the wSOL will be created.
  const createAncillaryAccountIx = SystemProgram.createAccount({
    fromPubkey: payerPublicKey,
    newAccountPubkey: ancillaryKeypair.publicKey,
    lamports: rentBalance, //spl token accounts need rent exemption
    space: ACCOUNT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  });

  //Send in the amount of SOL which we want converted to wSOL
  const initialBalanceTransferIx = SystemProgram.transfer({
    fromPubkey: payerPublicKey,
    lamports: amount,
    toPubkey: ancillaryKeypair.publicKey,
  });
  //Initialize the account as a WSOL account, with the original payerAddress as owner
  const initAccountIx = createInitializeAccountInstruction(
    ancillaryKeypair.publicKey,
    NATIVE_MINT,
    payerPublicKey
  );

  //Normal approve & transfer instructions, except that the wSOL is sent from the ancillary account.
  const approvalIx = createApproveAuthoritySignerInstruction(
    tokenBridgeAddress,
    ancillaryKeypair.publicKey,
    payerPublicKey,
    amount
  );

  const message = Keypair.generate();
  const nonce = createNonce().readUInt32LE(0);
  const tokenBridgeTransferIx =
    payload !== null
      ? createTransferNativeWithPayloadInstruction(
          tokenBridgeAddress,
          bridgeAddress,
          payerAddress,
          message.publicKey,
          ancillaryKeypair.publicKey,
          NATIVE_MINT,
          nonce,
          amount,
          Buffer.from(targetAddress),
          coalesceChainId(targetChain),
          payload
        )
      : createTransferNativeInstruction(
          tokenBridgeAddress,
          bridgeAddress,
          payerAddress,
          message.publicKey,
          ancillaryKeypair.publicKey,
          NATIVE_MINT,
          nonce,
          amount,
          relayerFee,
          Buffer.from(targetAddress),
          coalesceChainId(targetChain)
        );

  //Close the ancillary account for cleanup. Payer address receives any remaining funds
  const closeAccountIx = createCloseAccountInstruction(
    ancillaryKeypair.publicKey, //account to close
    payerPublicKey, //Remaining funds destination
    payerPublicKey //authority
  );

  const { blockhash } = await connection.getLatestBlockhash(commitment);
  const transaction = new Transaction();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payerPublicKey;
  transaction.add(
    createAncillaryAccountIx,
    initialBalanceTransferIx,
    initAccountIx,
    approvalIx,
    tokenBridgeTransferIx,
    closeAccountIx
  );
  await addComputeBudget(connection!, transaction);
  transaction.partialSign(message, ancillaryKeypair);
  return transaction;
}

export async function transferFromSolana(
  connection: Connection,
  bridgeAddress: PublicKeyInitData,
  tokenBridgeAddress: PublicKeyInitData,
  payerAddress: PublicKeyInitData,
  fromAddress: PublicKeyInitData,
  mintAddress: PublicKeyInitData,
  amount: bigint,
  targetAddress: Uint8Array | Buffer,
  targetChain: ChainId | ChainName,
  originAddress?: Uint8Array | Buffer,
  originChain?: ChainId | ChainName,
  fromOwnerAddress?: PublicKeyInitData,
  relayerFee: bigint = BigInt(0),
  payload: Uint8Array | Buffer | null = null,
  commitment?: Commitment
) {
  const originChainId: ChainId | undefined = originChain
    ? coalesceChainId(originChain)
    : undefined;
  if (fromOwnerAddress === undefined) {
    fromOwnerAddress = payerAddress;
  }
  const nonce = createNonce().readUInt32LE(0);
  const approvalIx = createApproveAuthoritySignerInstruction(
    tokenBridgeAddress,
    fromAddress,
    fromOwnerAddress,
    amount
  );
  const message = Keypair.generate();
  const isSolanaNative =
    originChainId === undefined || originChainId === CHAIN_ID_SOLANA;
  if (!isSolanaNative && !originAddress) {
    return Promise.reject(
      "originAddress is required when specifying originChain"
    );
  }
  const tokenBridgeTransferIx = isSolanaNative
    ? payload !== null
      ? createTransferNativeWithPayloadInstruction(
          tokenBridgeAddress,
          bridgeAddress,
          payerAddress,
          message.publicKey,
          fromAddress,
          mintAddress,
          nonce,
          amount,
          targetAddress,
          coalesceChainId(targetChain),
          payload
        )
      : createTransferNativeInstruction(
          tokenBridgeAddress,
          bridgeAddress,
          payerAddress,
          message.publicKey,
          fromAddress,
          mintAddress,
          nonce,
          amount,
          relayerFee,
          targetAddress,
          coalesceChainId(targetChain)
        )
    : payload !== null
    ? createTransferWrappedWithPayloadInstruction(
        tokenBridgeAddress,
        bridgeAddress,
        payerAddress,
        message.publicKey,
        fromAddress,
        fromOwnerAddress,
        originChainId!,
        originAddress!,
        nonce,
        amount,
        targetAddress,
        coalesceChainId(targetChain),
        payload
      )
    : createTransferWrappedInstruction(
        tokenBridgeAddress,
        bridgeAddress,
        payerAddress,
        message.publicKey,
        fromAddress,
        fromOwnerAddress,
        originChainId!,
        originAddress!,
        nonce,
        amount,
        relayerFee,
        targetAddress,
        coalesceChainId(targetChain)
      );
  const transaction = new Transaction().add(approvalIx, tokenBridgeTransferIx);
  const { blockhash } = await connection.getLatestBlockhash(commitment);
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(payerAddress);
  await addComputeBudget(connection!, transaction);
  transaction.partialSign(message);
  return transaction;
}

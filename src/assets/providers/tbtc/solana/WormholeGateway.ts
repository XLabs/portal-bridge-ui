import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection, PublicKey, PublicKeyInitData, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import { SOL_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS, THRESHOLD_GATEWAYS, THRESHOLD_TBTC_CONTRACTS } from '../../../../utils/consts';
import { CHAIN_ID_SOLANA, ChainId, ParsedTokenTransferVaa, SignedVaa, parseTokenTransferVaa } from '@certusone/wormhole-sdk';
import { WormholeGatewayIdl } from './WormholeGatewayIdl';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { deriveClaimKey, derivePostedVaaKey } from '@certusone/wormhole-sdk/lib/esm/solana/wormhole';
import { deriveTokenBridgeConfigKey, deriveEndpointKey, deriveMintAuthorityKey, deriveWrappedMetaKey, deriveWrappedMintKey } from '@certusone/wormhole-sdk/lib/esm/solana/tokenBridge';
import { SolanaWallet } from '@xlabs-libs/wallet-aggregator-solana';
import { createNonce } from '@certusone/wormhole-sdk/lib/esm/utils/createNonce';

function newAnchorProvider(connection: Connection, wallet: SolanaWallet) {
    return new AnchorProvider(connection, {
        async signTransaction(tx): Promise<Transaction> {
            return await wallet.signTransaction(tx);
        },
        async signAllTransactions(txs): Promise<Transaction[]> {
            return await wallet.getAdapter().signAllTransactions!(txs);
        },
        publicKey: wallet.getAdapter().publicKey!
    }, {});
}

export function newWormholeGateway(connection: Connection, wallet: SolanaWallet) {
    if (!THRESHOLD_TBTC_CONTRACTS[CHAIN_ID_SOLANA]) {
        throw new Error("No contract address for this chain");
    }
    const programId = new PublicKey(THRESHOLD_TBTC_CONTRACTS[CHAIN_ID_SOLANA]);
    const provider = newAnchorProvider(connection, wallet);
    const program = new Program<typeof WormholeGatewayIdl>(WormholeGatewayIdl, programId, provider);
    const receiveTbtc = async (signedVAA: SignedVaa, payer: PublicKeyInitData): Promise<Transaction> => {
        const parsed = parseTokenTransferVaa(signedVAA);

        const call = program.methods.receiveTbtc(signedVAA);
        //program.account.custodian.fetch()
        return call
            .accounts(getCompleteTransferWrappedAccounts(SOL_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS, new PublicKey(payer), parsed))
            .transaction();
    }
    const sendTbtc = async (amount: bigint, recipientChain: ChainId, recipientAddress: Uint8Array): Promise<Transaction> => {
        const nonce = createNonce().readUInt32LE(0);
        const call = program.methods.sendTbtcGateway(amount, recipientChain, recipientAddress, nonce);
        return call.transaction();
    }
    return {
        sendTbtc,
        receiveTbtc
    }
}

function createReadOnlyTBtcGatewayProgramInterface(programId: PublicKeyInitData) {
    return new Program(WormholeGatewayIdl, new PublicKey(programId), { connection: null } as any);
}

function getCompleteTransferWrappedAccounts(
    tokenBridgeProgramId: PublicKeyInitData,
    wormholeProgramId: PublicKeyInitData,
    payer: PublicKeyInitData,
    vaa: ParsedTokenTransferVaa
) {
    const mint = deriveWrappedMintKey(
        tokenBridgeProgramId,
        vaa.tokenChain,
        vaa.tokenAddress
    )
    return {
        payer: new PublicKey(payer),
        tokenBridgeConfig: deriveTokenBridgeConfigKey(tokenBridgeProgramId),
        postedVaa: derivePostedVaaKey(wormholeProgramId, vaa.hash),
        tokenBridgeClaim: deriveClaimKey(tokenBridgeProgramId, vaa.emitterAddress, vaa.emitterChain, vaa.sequence),
        tokenBridgeRegisteredEmitter: deriveEndpointKey(tokenBridgeProgramId, vaa.emitterChain, vaa.emitterAddress),
 /*     custodian: '',
        wrappedTbtcToken: '',
        wrappedTbtcMint: '',
        tbtcMint: '',
        recipientToken: '',
        recipient: '',
        recipientWrappedToken: '',
        tbtcConfig: '',
        tbtcMinterInfo: '',*/
        tbtcProgram: new PublicKey(THRESHOLD_TBTC_CONTRACTS[CHAIN_ID_SOLANA]),
        tokenBridgeProgram: new PublicKey(tokenBridgeProgramId),
        tokenBridgeWrappedAsset: deriveWrappedMetaKey(tokenBridgeProgramId, mint),
        tokenBridgeMintAuthority: deriveMintAuthorityKey(tokenBridgeProgramId),
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        coreBridgeProgram: new PublicKey(wormholeProgramId)
    };
}

async function createReceiveTbtcInstruction(tokenBridgeAddress: PublicKeyInitData, bridgeAddress: PublicKeyInitData, payerAddress: PublicKeyInitData, parsed: ParsedTokenTransferVaa): Promise<Transaction> {
    const methods = createReadOnlyTBtcGatewayProgramInterface(THRESHOLD_GATEWAYS[CHAIN_ID_SOLANA]).methods.receiveTbtc();
    // @ts-ignore
    return methods._ixFn(...methods._args, {
        accounts: getCompleteTransferWrappedAccounts(
            tokenBridgeAddress, bridgeAddress, payerAddress, parsed
        ) as any,
          signers: undefined,
          remainingAccounts: undefined,
          preInstructions: undefined,
          postInstructions: undefined,
    })
}


async function receiveTbtc(
    connection: Connection,
    bridgeAddress: PublicKeyInitData,
    tokenBridgeAddress: PublicKeyInitData,
    payerAddress: PublicKeyInitData,
    signedVaa: SignedVaa
): Promise<Transaction> {
    const parsed = parseTokenTransferVaa(signedVaa);
    const instruction = await createReceiveTbtcInstruction(tokenBridgeAddress, bridgeAddress, payerAddress, parsed);
    const transaction = new Transaction().add(instruction);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(payerAddress);
    return transaction;
}

async function sendTbtc(): Promise<Transaction> {
    return {} as Transaction;
}

const WormholeGateway = {
    receiveTbtc,
    sendTbtc
}

export default WormholeGateway;

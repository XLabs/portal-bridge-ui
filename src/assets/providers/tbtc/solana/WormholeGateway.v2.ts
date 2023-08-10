import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection, PublicKey, PublicKeyInitData, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOL_BRIDGE_ADDRESS as CORE_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS as TOKEN_BRIDGE_ADDRESS, THRESHOLD_GATEWAYS, THRESHOLD_TBTC_CONTRACTS } from '../../../../utils/consts';
import { CHAIN_ID_SOLANA, ChainId, SignedVaa, parseTokenTransferVaa } from '@certusone/wormhole-sdk';
import { WormholeGatewayIdl } from './WormholeGatewayIdl';
import coreBridge from '@certusone/wormhole-sdk/lib/esm/solana/wormhole';
import tokenBridge from '@certusone/wormhole-sdk/lib/esm/solana/tokenBridge';
import { SolanaWallet } from '@xlabs-libs/wallet-aggregator-solana';
import { createNonce } from '@certusone/wormhole-sdk/lib/esm/utils/createNonce';

const WORMHOLE_GATEWAY_PROGRAM_ID = new PublicKey(THRESHOLD_GATEWAYS[CHAIN_ID_SOLANA]);
const TBTC_PROGRAM_ID = new PublicKey(THRESHOLD_TBTC_CONTRACTS[CHAIN_ID_SOLANA]);
const CORE_BRIDGE_PROGRAM_ID = new PublicKey(CORE_BRIDGE_ADDRESS);
const TOKEN_BRIDGE_PROGRAM_ID = new PublicKey(TOKEN_BRIDGE_ADDRESS);
const WRAPPED_TBTC_ASSET = new PublicKey("5LEUZpBxUQmoxoNGqmYmFEGAPDuhWbAY5CGt519UixLo");
const WRAPPED_TBTC_MINT = new PublicKey("25rXTx9zDZcHyTav5sRqM6YBvTGu9pPH9yv83uAEqbgG");

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

function getCustodianPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("redeemer")],
        new PublicKey(WORMHOLE_GATEWAY_PROGRAM_ID)
    )[0];
}

function getWrappedTbtcTokenPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("wrapped-token")],
        WORMHOLE_GATEWAY_PROGRAM_ID
    )[0];
}

function getMintPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("tbtc-mint")],
        TBTC_PROGRAM_ID
    )[0];
}

function getConfigPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("config")],
        TBTC_PROGRAM_ID
    )[0];
}

function getMinterInfoPDA(minter: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("minter-info"), minter.toBuffer()],
        TBTC_PROGRAM_ID
    )[0];
}

function getAssociatedTokenAddressSync(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false
): PublicKey {
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error();
    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return address;
}

export function newThresholdWormholeGateway(connection: Connection, wallet: SolanaWallet) {
    const provider = newAnchorProvider(connection, wallet);
    const program = new Program<typeof WormholeGatewayIdl>(WormholeGatewayIdl, WORMHOLE_GATEWAY_PROGRAM_ID, provider);
    const receiveTbtc = async (signedVAA: SignedVaa, payer: PublicKeyInitData): Promise<Transaction> => {
        const parsed = parseTokenTransferVaa(signedVAA);
        const custodian = getCustodianPDA();
        const tx = program.methods
            .receiveTbtc(Array.from(parsed.hash))
            .accounts({
                payer: new PublicKey(wallet.getAddress()!),
                custodian,
                postedVaa: coreBridge.derivePostedVaaKey(CORE_BRIDGE_PROGRAM_ID, parsed.hash),
                tokenBridgeClaim: coreBridge.deriveClaimKey(TOKEN_BRIDGE_PROGRAM_ID, parsed.emitterAddress, parsed.emitterChain, parsed.sequence),
                wrappedTbtcToken: getWrappedTbtcTokenPDA(),
                wrappedTbtcMint: WRAPPED_TBTC_MINT, // To check
                tbtcMint: getMintPDA(),
                recipientToken: '', // To be defined
                recipient: '', // To be defined
                recipientWrappedToken: '', // To be defined
                tbtcConfig: getConfigPDA(),
                tbtcMinterInfo: getMinterInfoPDA(custodian),
                tokenBridgeConfig: tokenBridge.deriveTokenBridgeConfigKey(TOKEN_BRIDGE_PROGRAM_ID),
                tokenBridgeRegisteredEmitter: tokenBridge.deriveEndpointKey(TOKEN_BRIDGE_PROGRAM_ID, parsed.emitterChain, parsed.emitterAddress),
                tokenBridgeWrappedAsset: WRAPPED_TBTC_ASSET, // To check
                tokenBridgeMintAuthority: tokenBridge.deriveMintAuthorityKey(TOKEN_BRIDGE_PROGRAM_ID),
                rent: SYSVAR_RENT_PUBKEY,
                tbtcProgram: TBTC_PROGRAM_ID,
                tokenBridgeProgram: TOKEN_BRIDGE_PROGRAM_ID,
                coreBridgeProgram: CORE_BRIDGE_PROGRAM_ID

            })
            .transaction();
        return tx;
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


import {
  cosmos,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_NEAR,
  CHAIN_ID_SOLANA,
  CHAIN_ID_XPLA,
  isEVMChain,
  isTerraChain,
  uint8ArrayToHex,
  CHAIN_ID_INJECTIVE,
} from "@certusone/wormhole-sdk";
import { arrayify, zeroPad } from "@ethersproject/bytes";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTargetAddressHex as setNFTTargetAddressHex } from "../store/nftSlice";
import {
  selectNFTTargetAsset,
  selectNFTTargetChain,
  selectTransferTargetAsset,
  selectTransferTargetChain,
  selectTransferTargetParsedTokenAccount,
} from "../store/selectors";
import { setTargetAddressHex as setTransferTargetAddressHex } from "../store/transferSlice";
import { decodeAddress } from "algosdk";
import { makeNearAccount, signAndSendTransactions } from "../utils/near";
import { NEAR_TOKEN_BRIDGE_ACCOUNT } from "../utils/consts";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import BN from "bn.js";
import { useWallet } from "../contexts/WalletContext";
import { NearWallet } from "@xlabs-libs/wallet-aggregator-near";

function useSyncTargetAddress(shouldFire: boolean, nft?: boolean) {
  const dispatch = useDispatch();
  const targetChain = useSelector(
    nft ? selectNFTTargetChain : selectTransferTargetChain
  );
  const targetAsset = useSelector(
    nft ? selectNFTTargetAsset : selectTransferTargetAsset
  );
  const targetParsedTokenAccount = useSelector(
    selectTransferTargetParsedTokenAccount
  );
  const targetTokenAccountPublicKey = targetParsedTokenAccount?.publicKey;

  const { address: walletAddress, wallet } = useWallet(targetChain);

  const setTargetAddressHex = nft
    ? setNFTTargetAddressHex
    : setTransferTargetAddressHex;
  useEffect(() => {
    if (shouldFire) {
      let cancelled = false;
      if (isEVMChain(targetChain) && walletAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(zeroPad(arrayify(walletAddress), 32))
          )
        );
      }
      // TODO: have the user explicitly select an account on solana
      else if (
        !nft && // only support existing, non-derived token accounts for token transfers (nft flow doesn't check balance)
        targetChain === CHAIN_ID_SOLANA &&
        targetTokenAccountPublicKey
      ) {
        // use the target's TokenAccount if it exists
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(
              zeroPad(new PublicKey(targetTokenAccountPublicKey).toBytes(), 32)
            )
          )
        );
      } else if (
        targetChain === CHAIN_ID_SOLANA &&
        walletAddress &&
        targetAsset
      ) {
        // otherwise, use the associated token account (which we create in the case it doesn't exist)
        (async () => {
          try {
            const associatedTokenAccount =
              await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                new PublicKey(targetAsset), // this might error
                new PublicKey(walletAddress)
              );
            if (!cancelled) {
              dispatch(
                setTargetAddressHex(
                  uint8ArrayToHex(zeroPad(associatedTokenAccount.toBytes(), 32))
                )
              );
            }
          } catch (e) {
            if (!cancelled) {
              dispatch(setTargetAddressHex(undefined));
            }
          }
        })();
      } else if (isTerraChain(targetChain) && walletAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(walletAddress), 32))
          )
        );
      } else if (targetChain === CHAIN_ID_XPLA && walletAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(walletAddress), 32))
          )
        );
      } else if (targetChain === CHAIN_ID_APTOS && walletAddress) {
        dispatch(
          setTargetAddressHex(uint8ArrayToHex(zeroPad(walletAddress, 32)))
        );
      } else if (targetChain === CHAIN_ID_ALGORAND && walletAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(decodeAddress(walletAddress).publicKey)
          )
        );
      } else if (targetChain === CHAIN_ID_INJECTIVE && walletAddress) {
        dispatch(
          setTargetAddressHex(
            uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(walletAddress), 32))
          )
        );
      } else if (targetChain === CHAIN_ID_NEAR && walletAddress && wallet) {
        (async () => {
          try {
            const account = await makeNearAccount(walletAddress);
            // So, near can have account names up to 64 bytes but wormhole can only have 32...
            //   as a result, we have to hash our account names to sha256's..  What we are doing
            //   here is doing a RPC call (does not require any interaction with the wallet and is free)
            //   that both tells us our account hash AND if we are already registered...
            let account_hash = await account.viewFunction(
              NEAR_TOKEN_BRIDGE_ACCOUNT,
              "hash_account",
              {
                account: walletAddress,
              }
            );
            if (!cancelled) {
              let myAddress = account_hash[1];
              console.log("account hash for", walletAddress, account_hash);

              if (!account_hash[0]) {
                console.log("Registering the receiving account");

                let myAddress2 = getTransactionLastResult(
                  await signAndSendTransactions(account, wallet as NearWallet, [
                    {
                      contractId: NEAR_TOKEN_BRIDGE_ACCOUNT,
                      methodName: "register_account",
                      args: { account: walletAddress },
                      gas: new BN("100000000000000"),
                      attachedDeposit: new BN("2000000000000000000000"), // 0.002 NEAR
                    },
                  ])
                );

                console.log("account hash returned: " + myAddress2);
              } else {
                console.log("account already registered");
              }
              if (!cancelled) {
                dispatch(setTargetAddressHex(myAddress));
              }
            }
          } catch (e) {
            console.log(e);
            if (!cancelled) {
              dispatch(setTargetAddressHex(undefined));
            }
          }
        })();
      } else {
        dispatch(setTargetAddressHex(undefined));
      }
      return () => {
        cancelled = true;
      };
    }
  }, [
    dispatch,
    shouldFire,
    targetChain,
    targetAsset,
    targetTokenAccountPublicKey,
    nft,
    setTargetAddressHex,
    walletAddress,
    wallet,
  ]);
}

export default useSyncTargetAddress;

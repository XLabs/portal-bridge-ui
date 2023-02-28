import {
  approveEth,
  ChainId,
  CHAIN_ID_KLAYTN,
  getAllowanceEth,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { EVMWallet } from "@xlabs-libs/wallet-aggregator-evm";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "../contexts/WalletContext";
import { selectTransferIsApproving } from "../store/selectors";
import { setIsApproving } from "../store/transferSlice";
import { getTokenBridgeAddressForChain } from "../utils/consts";

export default function useAllowance(
  chainId: ChainId,
  tokenAddress?: string,
  transferAmount?: BigInt,
  sourceIsNative?: boolean
) {
  const dispatch = useDispatch();
  const [allowance, setAllowance] = useState<BigInt | null>(null);
  const [isAllowanceFetching, setIsAllowanceFetching] = useState(false);
  const isApproveProcessing = useSelector(selectTransferIsApproving);
  const { wallet } = useWallet<EVMWallet>(chainId);
  const sufficientAllowance =
    !isEVMChain(chainId) ||
    sourceIsNative ||
    (allowance && transferAmount && allowance >= transferAmount);

  useEffect(() => {
    let cancelled = false;
    if (isEVMChain(chainId) && tokenAddress && wallet && !isApproveProcessing) {
      setIsAllowanceFetching(true);
      getAllowanceEth(
        getTokenBridgeAddressForChain(chainId),
        tokenAddress,
        wallet.getSigner()!
      ).then(
        (result) => {
          if (!cancelled) {
            setIsAllowanceFetching(false);
            setAllowance(result.toBigInt());
          }
        },
        (error) => {
          if (!cancelled) {
            setIsAllowanceFetching(false);
            //setError("Unable to retrieve allowance"); //TODO set an error
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [chainId, tokenAddress, wallet, isApproveProcessing]);

  const approveAmount: (amount: BigInt) => Promise<any> = useMemo(() => {
    return !isEVMChain(chainId) || !tokenAddress || !wallet
      ? (amount: BigInt) => {
          return Promise.resolve();
        }
      : (amount: BigInt) => {
          dispatch(setIsApproving(true));
          const signer = wallet.getSigner()!;
          // Klaytn requires specifying gasPrice
          const gasPricePromise =
            chainId === CHAIN_ID_KLAYTN
              ? signer.getGasPrice()
              : Promise.resolve(undefined);
          return gasPricePromise.then(
            (gasPrice) =>
              approveEth(
                getTokenBridgeAddressForChain(chainId),
                tokenAddress,
                signer,
                BigNumber.from(amount),
                gasPrice === undefined ? {} : { gasPrice }
              ).then(
                () => {
                  dispatch(setIsApproving(false));
                  return Promise.resolve();
                },
                () => {
                  dispatch(setIsApproving(false));
                  return Promise.reject();
                }
              ),
            () => {
              dispatch(setIsApproving(false));
              return Promise.reject();
            }
          );
        };
  }, [chainId, tokenAddress, wallet, dispatch]);

  return useMemo(
    () => ({
      sufficientAllowance,
      approveAmount,
      isAllowanceFetching,
      isApproveProcessing,
    }),
    [
      sufficientAllowance,
      approveAmount,
      isAllowanceFetching,
      isApproveProcessing,
    ]
  );
}

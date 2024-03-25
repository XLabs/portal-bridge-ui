import {
  approveEth,
  ChainId,
  CHAIN_ID_KLAYTN,
  getAllowanceEth,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import {
  selectTransferIsApproving,
  selectTransferIsTBTC,
  selectTransferSourceChain,
} from "../store/selectors";
import { setIsApproving } from "../store/transferSlice";
import {
  THRESHOLD_GATEWAYS,
  getTokenBridgeAddressForChain,
} from "../utils/consts";

export default function useAllowance(
  chainId: ChainId,
  tokenAddress?: string,
  transferAmount?: BigInt,
  sourceIsNative?: boolean,
  targetChain?: ChainId,
  isReady?: boolean
) {
  const dispatch = useDispatch();
  const [allowance, setAllowance] = useState<BigInt | null>(null);
  const [isAllowanceFetching, setIsAllowanceFetching] = useState(false);
  const contract = useRef(getTokenBridgeAddressForChain(chainId));

  const isTBTC = useSelector(selectTransferIsTBTC);
  const sourceChain = useSelector(selectTransferSourceChain);
  const isApproveProcessing = useSelector(selectTransferIsApproving);
  const { signer } = useEthereumProvider(chainId as any);
  const sufficientAllowance =
    !isEVMChain(chainId) ||
    sourceIsNative ||
    (allowance && transferAmount && allowance >= transferAmount);

  useEffect(() => {
    let cancelled = false;

    // THRESHOLD TBTC FLOW
    if (isTBTC && THRESHOLD_GATEWAYS[sourceChain]) {
      console.log("allowance contract is now for Threshold");
      contract.current = THRESHOLD_GATEWAYS[chainId];
    }

    if (isEVMChain(chainId) && tokenAddress && signer && !isApproveProcessing) {
      setIsAllowanceFetching(true);
      getAllowanceEth(contract.current, tokenAddress, signer).then(
        (result) => {
          if (!cancelled) {
            setIsAllowanceFetching(false);
            setAllowance(result.toBigInt());
          }
        },
        (_error) => {
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
  }, [
    chainId,
    tokenAddress,
    signer,
    isApproveProcessing,
    targetChain,
    isReady,
    isTBTC,
    sourceChain,
  ]);

  const approveAmount: (amount: BigInt) => Promise<any> = useMemo(() => {
    return !isEVMChain(chainId) || !tokenAddress || !signer
      ? (amount: BigInt) => {
          return Promise.resolve();
        }
      : (amount: BigInt) => {
          dispatch(setIsApproving(true));
          // Klaytn requires specifying gasPrice
          const gasPricePromise =
            chainId === CHAIN_ID_KLAYTN
              ? signer.getGasPrice()
              : Promise.resolve(undefined);
          return gasPricePromise.then(
            (gasPrice) =>
              approveEth(
                contract.current,
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
  }, [chainId, tokenAddress, signer, dispatch]);

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

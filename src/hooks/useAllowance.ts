import {
  approveEth,
  ChainId,
  CHAIN_ID_KLAYTN,
  getAllowanceEth,
  isEVMChain,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";
import { selectTransferIsApproving } from "../store/selectors";
import { setIsApproving, setThreshold } from "../store/transferSlice";
import {
  THRESHOLD_GATEWAYS,
  THRESHOLD_TBTC_CONTRACTS,
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

  const isApproveProcessing = useSelector(selectTransferIsApproving);
  const { signer } = useEthereumProvider(chainId);
  const sufficientAllowance =
    !isEVMChain(chainId) ||
    sourceIsNative ||
    (allowance && transferAmount && allowance >= transferAmount);

  useEffect(() => {
    let cancelled = false;

    // THRESHOLD TBTC FLOW
    const isTBTC =
      THRESHOLD_TBTC_CONTRACTS[chainId].toLowerCase() ===
      tokenAddress!.toLowerCase();
    const isCanonicalSource = Object.keys(THRESHOLD_GATEWAYS).includes(
      `${chainId}`
    );

    const isEthTarget = targetChain === CHAIN_ID_ETH;
    const isCanonicalTarget = Object.keys(THRESHOLD_GATEWAYS).includes(
      `${targetChain}`
    );

    if (isTBTC && (isCanonicalTarget || isEthTarget)) {
      dispatch(
        setThreshold({ isTBTC: true, source: chainId, target: targetChain })
      );

      if (
        (isCanonicalSource && isCanonicalTarget) ||
        (isCanonicalSource && isEthTarget)
      ) {
        console.log("contract is now for Threshold");
        contract.current = THRESHOLD_GATEWAYS[chainId];
      }
    } else {
      // ITS NOT THRESHOLD TBTC FLOW
      dispatch(setThreshold({ isTBTC: false }));
    }

    if (isEVMChain(chainId) && tokenAddress && signer && !isApproveProcessing) {
      setIsAllowanceFetching(true);
      console.log("get allowance with contract", contract.current);
      getAllowanceEth(contract.current, tokenAddress, signer).then(
        (result) => {
          if (!cancelled) {
            console.log("RESULT!", result.toBigInt());
            setIsAllowanceFetching(false);
            setAllowance(result.toBigInt());
          }
        },
        (error) => {
          console.log("ERROR!", error);
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
    dispatch,
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

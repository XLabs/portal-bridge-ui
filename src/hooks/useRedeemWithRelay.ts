import { ChainId, ChainName } from "@certusone/wormhole-sdk";
import { Contract, Signer } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { getRelayerContractAddress } from "../wormhole-connect/relayer/contracts";
import useTransferSignedVAA from "./useTransferSignedVAA";

const ABI = [
  {
    inputs: [
      { internalType: "bytes", name: "encodedTransferMessage", type: "bytes" },
    ],
    name: "completeTransferWithRelay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export type RedeemWithRelayParams = {
  signer: Signer | undefined;
  chain: ChainId | ChainName;
};

export default function useRedeemWithRelay({
  signer,
  chain,
}: RedeemWithRelayParams) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [recipit, setRecipit] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const address = getRelayerContractAddress(chain);
  const newContract = useCallback(
    (address: string) => new Contract(address, ABI),
    []
  );
  useEffect(() => {
    if (signer) {
      setContract(newContract(address).connect(signer));
    }
  }, [signer, newContract, address]);
  const vaa = useTransferSignedVAA();
  const completeTransferWithRelay = useCallback(async () => {
    try {
      setInProgress(true);
      const tx = await contract?.completeTransferWithRelay(vaa);
      const recipit = await tx.wait();
      setInProgress(false);
      setRecipit(recipit);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setInProgress(false);
    }
  }, [contract, vaa]);
  return {
    completeTransferWithRelay,
    inProgress,
    recipit,
    error
  };
}

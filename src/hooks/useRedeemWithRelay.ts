import { Contract, Signer, ethers } from "ethers";
import { useMemo, useState } from "react";

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
  {
    inputs: [],
    name: "confirmOwnershipTransferRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "encoded", type: "bytes" }],
    name: "decodeTransferWithRelay",
    outputs: [
      {
        components: [
          { internalType: "uint8", name: "payloadId", type: "uint8" },
          {
            internalType: "uint256",
            name: "targetRelayerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "toNativeTokenAmount",
            type: "uint256",
          },
          { internalType: "bytes32", name: "targetRecipient", type: "bytes32" },
        ],
        internalType: "struct TokenBridgeRelayerStructs.TransferWithRelay",
        name: "transfer",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getPaused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "isAcceptedToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
];

const contract = new Contract(ethers.constants.AddressZero, ABI);

export function useRedeemWithRelay(signer: Signer) {
    const relayerContract = contract.connect(signer);
    const [isPaused, setIsPaused] = useState(false);
    return {
        isPaused: useMemo(() => relayerContract.isPaused(), [relayerContract]),
    }
}
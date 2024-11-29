import { Contract, ethers, keccak256, getAddress, toUtf8Bytes, Provider, ZeroAddress } from "ethers";

const EIP_1967 = [
  {
    inputs: [],
    name: "implementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
];


// EIP-1967 implementation storage slot
const EIP1967_SLOT = BigInt(keccak256(toUtf8Bytes("eip1967.proxy.implementation"))) - BigInt(1);

async function getImplementationAddress(proxyAddress: string, provider: Provider) {
    // Get the implementation address from the proxy contract's storage
    const storageValue = await provider.getStorage(proxyAddress, EIP1967_SLOT);

    // Convert to a valid Ethereum address (last 20 bytes)
    const implementationAddress = getAddress(
        `0x${storageValue.slice(-40)}`
    );
    if (implementationAddress === ZeroAddress) {
        try {
            const contract = new Contract(proxyAddress, EIP_1967, provider);
            return await contract.implementation();
        } catch (err) {
            console.log(proxyAddress, implementationAddress);
            return proxyAddress;
        }
    }
    return implementationAddress;
}

// Example usage
(async () => {
  const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"); // Replace with your RPC provider

  const proxyAddress = "0xaf88d065e77c8cc2239327c5edb3a432268e5831"; // Replace with the proxy address
  const implementationAddress = await getImplementationAddress(proxyAddress, provider);
  console.log("Implementation Address:", implementationAddress);
  const contract = new Contract(proxyAddress, EIP_1967, provider);
  console.log("Implementation Address:", await contract.implementation());
})();

// SmartWill contract (set after deploy to Sepolia)
export const CONTRACT_ADDRESS = '0xf8866CfA500B3ef9765B62D1f2601Afb7091C7c9' as `0x${string}`;

// ABI copied from deployments output for SmartWill
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "encryptedWill", "type": "string" },
      { "internalType": "externalEaddress", "name": "extAddr1", "type": "bytes32" },
      { "internalType": "externalEaddress", "name": "extAddr2", "type": "bytes32" },
      { "internalType": "externalEaddress", "name": "extAddr3", "type": "bytes32" },
      { "internalType": "bytes", "name": "inputProof", "type": "bytes" }
    ],
    "name": "submitWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ],
    "name": "hasWill",
    "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ],
    "name": "getEncryptedWill",
    "outputs": [ { "internalType": "string", "name": "", "type": "string" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ],
    "name": "getEncryptedAddresses",
    "outputs": [
      { "internalType": "eaddress", "name": "a1", "type": "bytes32" },
      { "internalType": "eaddress", "name": "a2", "type": "bytes32" },
      { "internalType": "eaddress", "name": "a3", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ],
    "name": "getWillMeta",
    "outputs": [
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "WillSubmitted",
    "type": "event"
  }
] as const;

// Contract configuration for different networks
export const CONTRACT_CONFIGS = {
  localhost: {
    chainId: 31337,
    smartWillAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    rpcUrl: "http://localhost:8545"
  },
  sepolia: {
    chainId: 11155111,
    smartWillAddress: "0x0000000000000000000000000000000000000000", // To be updated after deployment
    rpcUrl: "https://sepolia.infura.io/v3/your-infura-key"
  }
}

// Auto-detect network based on current environment
export const getCurrentNetwork = () => {
  // In production, this would check the actual network
  // For now, default to localhost for development
  return 'localhost'
}

export const getContractConfig = () => {
  const network = getCurrentNetwork()
  return CONTRACT_CONFIGS[network as keyof typeof CONTRACT_CONFIGS]
}
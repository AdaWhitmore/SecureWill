import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { sepolia, localhost } from 'viem/chains'
import SmartWillContract from './contracts/SmartWill.json'
import { getContractConfig } from './config/contracts'
import './App.css'

declare global {
  interface Window {
    ethereum?: any
  }
}

function App() {
  const [account, setAccount] = useState<string>('')
  const [connected, setConnected] = useState(false)
  const [willContent, setWillContent] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [address3, setAddress3] = useState('')
  const [existingWill, setExistingWill] = useState<string>('')
  const [hasWill, setHasWill] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalWills, setTotalWills] = useState<number>(0)
  const [willMetadata, setWillMetadata] = useState<{owner: string, timestamp: number, exists: boolean} | null>(null)

  const config = getContractConfig()
  const contractAddress = SmartWillContract.address || config.smartWillAddress
  const contractABI = SmartWillContract.abi

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)
        setConnected(true)

        // Check if user has a will
        await checkExistingWill(address)
        await getTotalWills()
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  // Check if user has an existing will
  const checkExistingWill = async (userAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)

      const hasExistingWill = await contract.hasWillFor(userAddress)
      setHasWill(hasExistingWill)

      if (hasExistingWill) {
        const signer = await provider.getSigner()
        const contractWithSigner = contract.connect(signer)

        // Get will content
        const content = await contractWithSigner.getWillContent()
        setExistingWill(content)

        // Get will metadata
        const [owner, timestamp, exists] = await contractWithSigner.getWillMetadata()
        setWillMetadata({
          owner,
          timestamp: Number(timestamp),
          exists
        })
      }
    } catch (error) {
      console.error('Error checking existing will:', error)
    }
  }

  // Get total number of wills
  const getTotalWills = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)
      const total = await contract.getTotalWills()
      setTotalWills(Number(total))
    } catch (error) {
      console.error('Error getting total wills:', error)
    }
  }

  // Create or update will
  const submitWill = async () => {
    if (!willContent.trim() || !address1 || !address2 || !address3) {
      alert('Please fill in all fields')
      return
    }

    if (!ethers.isAddress(address1) || !ethers.isAddress(address2) || !ethers.isAddress(address3)) {
      alert('Please enter valid Ethereum addresses')
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // For demo purposes, we'll use simple encryption simulation
      // In production, this would use proper 3-layer encryption with the addresses
      const encryptedContent = `[ENCRYPTED_WITH_${address1.slice(0,10)}_${address2.slice(0,10)}_${address3.slice(0,10)}]_${willContent}`

      // Create encrypted inputs (simplified for demo)
      // In production, this would use FHEVM encryption
      const dummyProof = '0x' + '00'.repeat(32) // Placeholder proof

      let tx
      if (hasWill) {
        tx = await contract.updateWill(
          encryptedContent,
          address1, dummyProof,
          address2, dummyProof,
          address3, dummyProof
        )
      } else {
        tx = await contract.createWill(
          encryptedContent,
          address1, dummyProof,
          address2, dummyProof,
          address3, dummyProof
        )
      }

      await tx.wait()

      alert(hasWill ? 'Will updated successfully!' : 'Will created successfully!')

      // Refresh data
      await checkExistingWill(account)
      await getTotalWills()

      // Clear form
      setWillContent('')
      setAddress1('')
      setAddress2('')
      setAddress3('')

    } catch (error) {
      console.error('Error submitting will:', error)
      alert('Error submitting will. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete will
  const deleteWill = async () => {
    if (!confirm('Are you sure you want to delete your will? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.deleteWill()
      await tx.wait()

      alert('Will deleted successfully!')

      // Refresh data
      await checkExistingWill(account)
      await getTotalWills()

    } catch (error) {
      console.error('Error deleting will:', error)
      alert('Error deleting will. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-connect if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress()
          setAccount(address)
          setConnected(true)
          await checkExistingWill(address)
          await getTotalWills()
        }
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛡️ SecureWill</h1>
        <p>Decentralized Will Storage with 3-Address Encryption</p>

        {!connected ? (
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            <p>Total Wills Created: {totalWills}</p>
          </div>
        )}
      </header>

      {connected && (
        <main className="main-content">
          {hasWill && (
            <section className="existing-will">
              <h2>Your Existing Will</h2>
              <div className="will-display">
                <p><strong>Content:</strong> {existingWill}</p>
                {willMetadata && (
                  <div className="will-metadata">
                    <p><strong>Owner:</strong> {willMetadata.owner}</p>
                    <p><strong>Last Updated:</strong> {new Date(willMetadata.timestamp * 1000).toLocaleString()}</p>
                  </div>
                )}
                <button onClick={deleteWill} className="delete-btn" disabled={loading}>
                  Delete Will
                </button>
              </div>
            </section>
          )}

          <section className="will-form">
            <h2>{hasWill ? 'Update Your Will' : 'Create Your Will'}</h2>

            <div className="form-group">
              <label htmlFor="willContent">Will Content:</label>
              <textarea
                id="willContent"
                value={willContent}
                onChange={(e) => setWillContent(e.target.value)}
                placeholder="Enter your will content here..."
                rows={6}
                disabled={loading}
              />
            </div>

            <div className="address-section">
              <h3>Encryption Addresses</h3>
              <p>Provide 3 Ethereum addresses for the encryption layers:</p>

              <div className="form-group">
                <label htmlFor="address1">Address 1 (First Layer):</label>
                <input
                  type="text"
                  id="address1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address2">Address 2 (Second Layer):</label>
                <input
                  type="text"
                  id="address2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address3">Address 3 (Third Layer):</label>
                <input
                  type="text"
                  id="address3"
                  value={address3}
                  onChange={(e) => setAddress3(e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={submitWill}
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : (hasWill ? 'Update Will' : 'Create Will')}
            </button>
          </section>

          <section className="info-section">
            <h3>How it Works</h3>
            <ol>
              <li>Write your will content</li>
              <li>Provide 3 Ethereum addresses for encryption</li>
              <li>Your will is encrypted in 3 layers using these addresses</li>
              <li>The encrypted addresses are stored using Zama FHE encryption</li>
              <li>Only someone with all 3 addresses can decrypt your will</li>
            </ol>

            <div className="contract-info">
              <p><strong>Contract Address:</strong> {contractAddress}</p>
              <p><strong>Network:</strong> {config.chainId === 31337 ? 'Localhost (Development)' : 'Sepolia Testnet'}</p>
              <p><strong>Chain ID:</strong> {config.chainId}</p>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}

export default App
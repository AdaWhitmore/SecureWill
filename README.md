# 🔐 SecureWill

**A Privacy-Preserving Digital Will Registry Built on Blockchain and Fully Homomorphic Encryption**

SecureWill is a revolutionary decentralized application (dApp) that enables users to securely store their digital wills on the blockchain using advanced cryptographic techniques. By combining client-side encryption with Zama's Fully Homomorphic Encryption (FHE) technology, SecureWill ensures that sensitive information remains private while being immutable and accessible when needed.

[![License](https://img.shields.io/badge/License-BSD_3--Clause--Clear-orange.svg)](https://spdx.org/licenses/BSD-3-Clause-Clear.html)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue.svg)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)

## 🌟 Key Features

### 🛡️ **Privacy-First Design**
- **Dual-Layer Encryption**: Combines client-side encryption with Zama FHE for maximum security
- **Zero-Knowledge**: No one, including the platform, can access your will content without proper keys
- **Confidential Smart Contracts**: Encrypted data processing on-chain without revealing sensitive information

### 🔒 **Advanced Security Model**
- **Three-Address System**: Requires three separate Ethereum addresses as decryption keys
- **Multi-Factor Protection**: Distributed trust model prevents single points of failure
- **Immutable Storage**: Blockchain-based storage ensures tamper-proof records
- **Access Control**: Granular permissions for encrypted data viewing and decryption

### 🌐 **Decentralized & Trustless**
- **No Central Authority**: Operates entirely on blockchain infrastructure
- **Censorship Resistant**: Cannot be shut down or controlled by any single entity
- **Global Accessibility**: Available worldwide without geographic restrictions
- **Permissionless**: No registration or approval required to use

### 🚀 **Modern User Experience**
- **Intuitive Interface**: Beautiful, responsive web application
- **Wallet Integration**: Seamless connection with popular Ethereum wallets
- **Real-time Updates**: Live synchronization with blockchain state
- **Mobile Responsive**: Optimized for all device types

## 🏗️ Architecture Overview

SecureWill employs a sophisticated multi-layered architecture that combines several cutting-edge technologies:

### Frontend Layer
- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **RainbowKit** for seamless wallet connectivity
- **Wagmi** for Ethereum interaction hooks
- **TanStack Query** for efficient data fetching and caching

### Blockchain Layer
- **Smart Contracts** written in Solidity 0.8.27
- **FHEVM Integration** using Zama's Fully Homomorphic Encryption
- **Hardhat** development framework with comprehensive testing suite
- **Multi-network Support** (Local, Sepolia Testnet)

### Encryption Layer
- **Client-Side Encryption**: Will content encrypted in browser using three addresses
- **Zama FHE**: Addresses encrypted using Fully Homomorphic Encryption
- **Reversible Algorithm**: Custom encryption allowing secure decryption with all three keys

## 🧮 Technical Stack

### Core Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Frontend** | React + TypeScript | 19.1 | User interface and interaction |
| **Build Tool** | Vite | 7.1.6 | Development server and bundling |
| **Blockchain** | Ethereum + Solidity | 0.8.27 | Smart contract platform |
| **FHE** | Zama FHEVM | 0.8.0 | Homomorphic encryption |
| **Development** | Hardhat | 2.26.0 | Smart contract development |
| **Wallet** | RainbowKit + Wagmi | 2.2.8 / 2.17.0 | Web3 connectivity |

### Smart Contract Dependencies
- **@fhevm/solidity**: Zama FHE Solidity library
- **@zama-fhe/oracle-solidity**: FHE oracle integration
- **@zama-fhe/relayer-sdk**: FHE relayer functionality
- **ethers.js**: Ethereum interaction library

### Development Dependencies
- **TypeChain**: TypeScript bindings for smart contracts
- **Chai + Mocha**: Testing framework
- **ESLint + Prettier**: Code quality and formatting
- **Solhint**: Solidity linting

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20 or higher
- **npm** 7.0.0 or higher
- **Git** for version control
- **Ethereum wallet** (MetaMask recommended)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/SecureWill.git
cd SecureWill
```

2. **Install Backend Dependencies**
```bash
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ui
npm install
cd ..
```

4. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Wallet Configuration
MNEMONIC="your twelve word mnemonic phrase here"
PRIVATE_KEY="0x..."  # Optional: Alternative to mnemonic

# Network Configuration
INFURA_API_KEY="your_infura_api_key"
ETHERSCAN_API_KEY="your_etherscan_api_key"

# Development
REPORT_GAS=true
```

### Local Development

1. **Compile Smart Contracts**
```bash
npm run compile
```

2. **Run Tests**
```bash
npm test
```

3. **Start Local Blockchain**
```bash
npm run chain
```

4. **Deploy Contracts (New Terminal)**
```bash
npm run deploy:localhost
```

5. **Start Frontend (New Terminal)**
```bash
cd ui
npm run dev
```

6. **Access Application**
Open [http://localhost:5174](http://localhost:5174) in your browser

## 📖 How It Works

### The Encryption Process

SecureWill uses a unique dual-layer encryption approach:

1. **Key Generation**: User provides three Ethereum addresses (typically trusted lawyers or family members)
2. **Client-Side Encryption**: Will content is encrypted in the browser using these three addresses as keys
3. **FHE Encryption**: The three addresses themselves are encrypted using Zama's FHE technology
4. **Blockchain Storage**: Both encrypted will content and encrypted addresses are stored on-chain

### The Decryption Process

To decrypt and access a will:

1. **Address Retrieval**: Either decrypt the three addresses using Zama FHE or input them manually
2. **Will Decryption**: Use the three addresses to decrypt the will content client-side
3. **Access Control**: Only users with all three correct addresses can decrypt the will

### Security Guarantees

- **Privacy**: Will content never appears in plaintext on-chain or to third parties
- **Integrity**: Blockchain ensures content cannot be tampered with
- **Availability**: Decentralized storage prevents single points of failure
- **Access Control**: Multi-signature-style access requiring three separate keys

## 🔧 Smart Contract API

### Core Functions

#### `submitWill(string calldata encryptedWill, externalEaddress extAddr1, externalEaddress extAddr2, externalEaddress extAddr3, bytes calldata inputProof)`
Submits or updates a will with encrypted content and addresses.

**Parameters:**
- `encryptedWill`: Client-side encrypted will content
- `extAddr1-3`: FHE-encrypted external address handles
- `inputProof`: Zama input proof for encrypted addresses

#### `hasWill(address user) → bool`
Checks if a user has a stored will.

#### `getEncryptedWill(address user) → string`
Retrieves the encrypted will content for a user.

#### `getEncryptedAddresses(address user) → (eaddress, eaddress, eaddress)`
Returns the three FHE-encrypted addresses for a user.

#### `getWillMeta(address user) → (uint256, address)`
Returns metadata including timestamp and owner address.

### Events

#### `WillSubmitted(address indexed user, uint256 timestamp)`
Emitted when a will is successfully submitted or updated.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run specific test file
npx hardhat test test/SmartWill.ts

# Run tests on Sepolia testnet
npm run test:sepolia
```

### Test Coverage

```bash
# Generate coverage report
npm run coverage
```

### Linting and Code Quality

```bash
# Run all linters
npm run lint

# Individual linting
npm run lint:sol    # Solidity
npm run lint:ts     # TypeScript

# Format code
npm run prettier:write
```

## 🌐 Deployment

### Local Development Network

```bash
# Start local node
npm run chain

# Deploy to local network
npm run deploy:localhost
```

### Sepolia Testnet

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify contracts
npm run verify:sepolia
```

### Production Deployment

1. **Environment Variables**: Configure production environment variables
2. **Security Audit**: Ensure contracts are audited before mainnet deployment
3. **Gas Optimization**: Review and optimize gas usage
4. **Frontend Deployment**: Deploy frontend to IPFS or decentralized hosting

## 🛡️ Security Considerations

### Encryption Security
- **Key Management**: Users must securely store their three decryption addresses
- **Address Selection**: Choose trusted parties who can act independently
- **Recovery Planning**: Consider key recovery scenarios and backup strategies

### Smart Contract Security
- **Access Control**: Contracts implement proper permission systems
- **Input Validation**: All inputs are validated and sanitized
- **Reentrancy Protection**: Contracts follow security best practices
- **Oracle Security**: FHE operations are properly validated

### Frontend Security
- **Client-Side Encryption**: Sensitive operations performed in browser
- **Secure Communication**: HTTPS and secure WebSocket connections
- **Wallet Integration**: Secure interaction with Web3 wallets
- **XSS Protection**: Input sanitization and output encoding

## 🔮 Future Roadmap

### Phase 1: Core Enhancement (Q1 2025)
- [ ] **Multi-Chain Support**: Deploy to Polygon, Arbitrum, and other L2s
- [ ] **Advanced Access Control**: Time-based and condition-based will activation
- [ ] **Mobile Application**: Native iOS and Android apps
- [ ] **Improved UX**: Guided setup and better error handling

### Phase 2: Advanced Features (Q2 2025)
- [ ] **Will Templates**: Pre-built legal templates for different jurisdictions
- [ ] **Digital Asset Integration**: NFT and token distribution capabilities
- [ ] **Executor Dashboard**: Interface for will executors and beneficiaries
- [ ] **Audit Trail**: Comprehensive logging of all will-related activities

### Phase 3: Ecosystem Integration (Q3 2025)
- [ ] **Legal Partner Network**: Integration with legal service providers
- [ ] **Insurance Integration**: Integration with life insurance platforms
- [ ] **Government APIs**: Integration with official death registries
- [ ] **Cross-Border Support**: Multi-jurisdiction legal compliance

### Phase 4: Advanced Cryptography (Q4 2025)
- [ ] **Zero-Knowledge Proofs**: Enhanced privacy with ZK-SNARKs
- [ ] **Quantum Resistance**: Post-quantum cryptographic algorithms
- [ ] **Threshold Cryptography**: Advanced multi-party computation
- [ ] **Decentralized Identity**: Integration with DID standards

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or fix
4. **Run Tests**: Ensure all tests pass
5. **Submit PR**: Create a pull request with detailed description

### Contribution Guidelines

#### Code Standards
- **TypeScript**: Use strict typing throughout
- **Solidity**: Follow security best practices
- **Testing**: Write comprehensive tests for new features
- **Documentation**: Update docs for any API changes

#### Pull Request Process
1. **Description**: Provide clear description of changes
2. **Testing**: Include test cases for new functionality
3. **Documentation**: Update relevant documentation
4. **Review**: Address feedback from maintainers

#### Bug Reports
- **Clear Title**: Descriptive title summarizing the issue
- **Reproduction Steps**: Step-by-step guide to reproduce
- **Environment**: Include browser, wallet, network details
- **Expected vs Actual**: What should happen vs what happens

### Community Guidelines
- **Be Respectful**: Maintain professional and respectful communication
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Patient**: Maintainers review contributions as time permits
- **Follow Standards**: Adhere to code style and contribution guidelines

## 📜 License

This project is licensed under the **BSD 3-Clause Clear License**. See the [LICENSE](LICENSE) file for details.

### Key License Terms
- **Commercial Use**: ✅ Permitted
- **Modification**: ✅ Permitted
- **Distribution**: ✅ Permitted
- **Patent Use**: ❌ Not granted
- **Private Use**: ✅ Permitted

## 🆘 Support & Community

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions

### Community Resources
- **GitHub**: [SecureWill Repository](https://github.com/your-username/SecureWill)
- **Documentation**: Comprehensive guides and API references
- **Examples**: Sample implementations and use cases

### Frequently Asked Questions

**Q: How secure is the encryption?**
A: SecureWill uses military-grade encryption with client-side processing and FHE technology, ensuring maximum security.

**Q: What happens if I lose my three addresses?**
A: Unfortunately, lost addresses cannot be recovered. Always backup your addresses securely and consider using trusted parties.

**Q: Can the will be updated?**
A: Yes, you can submit a new will at any time, which will replace the previous version.

**Q: What are the gas costs?**
A: Costs vary by network. On Ethereum mainnet, expect 0.01-0.05 ETH. L2 solutions are significantly cheaper.

**Q: Is this legally binding?**
A: Legal validity varies by jurisdiction. Consult local legal experts for specific requirements.

## 🙏 Acknowledgments

### Core Technologies
- **Zama**: For providing the FHEVM and FHE technology
- **Ethereum Foundation**: For the foundational blockchain technology
- **Hardhat Team**: For the excellent development framework
- **React Team**: For the powerful frontend framework

### Open Source Libraries
- All the amazing open-source projects that make SecureWill possible
- The vibrant Web3 and blockchain development community
- Contributors and testers who help improve the platform

### Special Thanks
- Privacy advocates who inspire our mission
- Legal professionals who provide guidance on will requirements
- Security researchers who help identify vulnerabilities
- The broader blockchain community for continued innovation

---

## 📁 Project Structure

```
SecureWill/
├── contracts/                 # Smart contracts
│   ├── SmartWill.sol         # Main will contract
│   └── FHECounter.sol        # Example FHE contract
├── ui/                       # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── styles/          # CSS styling
│   └── package.json         # Frontend dependencies
├── deploy/                   # Deployment scripts
├── tasks/                    # Hardhat tasks
├── test/                     # Test files
│   ├── SmartWill.ts         # Contract tests
│   └── FHECounter.ts        # Example tests
├── hardhat.config.ts         # Hardhat configuration
├── package.json              # Backend dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## 📊 Problem & Solution

### 🎯 **Problems We Solve**

#### Traditional Will Limitations
- **Privacy Concerns**: Paper wills can be read by unauthorized parties
- **Single Points of Failure**: Physical documents can be lost or destroyed
- **Centralized Control**: Lawyers and institutions control access
- **Geographic Restrictions**: Limited by jurisdictional boundaries
- **High Costs**: Legal fees and administrative overhead
- **Slow Process**: Lengthy probate and verification procedures

#### Digital Will Challenges
- **Security Vulnerabilities**: Centralized servers can be hacked
- **Trust Issues**: Reliance on third-party service providers
- **Censorship Risk**: Platforms can restrict or remove content
- **Data Ownership**: Users don't truly own their digital assets
- **Interoperability**: Locked into specific platforms or formats

### ✨ **Our Solution**

SecureWill addresses these challenges through innovative blockchain and cryptographic technology:

#### **Decentralized Architecture**
- No central authority or single point of failure
- Global accessibility without geographic restrictions
- Censorship-resistant infrastructure
- User-controlled data ownership

#### **Advanced Privacy Protection**
- Client-side encryption ensures content privacy
- FHE technology protects access control mechanisms
- Zero-knowledge architecture prevents unauthorized access
- Multi-layered security approach

#### **Cost-Effective Solution**
- Minimal blockchain transaction fees
- No ongoing subscription or maintenance costs
- Eliminate expensive legal intermediaries
- Transparent and predictable pricing

#### **Enhanced Security Model**
- Cryptographically secured immutable storage
- Multi-signature style access control
- Tamper-proof blockchain records
- Military-grade encryption standards

---

**⚖️ Disclaimer**: SecureWill is a technical platform for storing encrypted digital wills. Users should consult with legal professionals to ensure compliance with local laws and regulations regarding will validity and estate planning. The platform developers are not responsible for legal validity or enforcement of wills created using this system.

**🔒 Security Notice**: This software is provided as-is. While we've implemented strong security measures, users are responsible for properly securing their decryption keys and understanding the implications of blockchain-based storage.

**Made with ❤️ for the Web3 Community**

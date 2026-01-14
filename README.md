# Lazorkit SDK Examples

A comprehensive collection of examples demonstrating how to use the [Lazorkit SDK](https://lazorkit.com) for passkey-based wallet authentication on Solana.

![Lazorkit Examples](https://placehold.co/1200x400/1a1a2e/ff6b6b?text=Lazorkit+SDK+Examples)

## 🔐 What is Lazorkit?

Lazorkit is a passkey wallet infrastructure for Solana that enables:

- **No seed phrases** - Users authenticate with biometrics (Face ID, Touch ID, Windows Hello)
- **Smart wallets** - Program-controlled wallets with advanced features
- **Gasless transactions** - Paymaster service sponsors transaction fees
- **Seamless UX** - Web2-like experience for blockchain applications

## 📚 Examples

This repository contains three progressive examples that build upon each other:

### [Example 1: Smart Wallet & Authentication](./app/examples/01-smart-wallet/README.md)

Learn the fundamentals of Lazorkit wallet integration:

- Setting up `LazorkitProvider`
- Using the `useWallet` hook
- Creating and connecting passkey wallets
- Displaying wallet information

**Key Concepts:** Passkeys, Smart Wallets, Provider Setup

---

### [Example 2: Gasless SOL Transfer](./app/examples/02-gasless-transfer/README.md)

Learn to send SOL without users paying gas fees:

- Building Solana transaction instructions
- Using `signAndSendTransaction` with paymaster
- Handling transaction confirmations
- Error handling best practices

**Key Concepts:** Paymaster, Transaction Instructions, Gasless Flow

---

### [Example 3: NFT Creation & Minting](./app/examples/03-nft-minting/README.md)

Learn to create and mint NFTs using Metaplex:

- Understanding NFT structure on Solana
- Building Metaplex minting instructions
- Handling multi-signer transactions
- Working with metadata and editions

**Key Concepts:** Metaplex, Token Metadata, Master Editions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- A browser that supports passkeys (Chrome, Safari, Firefox, Edge)
- (Optional) Devnet SOL for testing transfers/minting

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lazorkit-examples.git
cd lazorkit-examples

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the examples.

### Getting Devnet SOL

For Examples 2 and 3, you'll need devnet SOL. Get some from:

1. [Solana Faucet](https://faucet.solana.com/)
2. Paste your wallet address (shown in Example 1)
3. Request an airdrop

## 📁 Project Structure

```
lazorkit-examples/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with providers
│   ├── providers.tsx            # Lazorkit provider setup
│   │
│   ├── components/              # Shared React components
│   │   ├── Navigation.tsx       # Example navigation
│   │   ├── WalletStatus.tsx     # Wallet connection UI
│   │   ├── PageLayout.tsx       # Page wrapper component
│   │   └── icons.tsx            # SVG icons
│   │
│   ├── lib/                     # Utilities
│   │   ├── constants.ts         # Shared constants
│   │   └── solana-utils.ts      # Solana helpers
│   │
│   └── examples/
│       ├── 01-smart-wallet/     # Example 1
│       │   ├── page.tsx
│       │   └── README.md
│       │
│       ├── 02-gasless-transfer/ # Example 2
│       │   ├── page.tsx
│       │   └── README.md
│       │
│       └── 03-nft-minting/      # Example 3
│           ├── page.tsx
│           ├── README.md
│           └── utils/
│               └── metaplex.ts  # NFT utilities
│
├── package.json
└── README.md
```

## 🔧 Configuration

### Lazorkit Provider

The Lazorkit provider is configured in `app/providers.tsx`:

```typescript
import { LazorkitProvider } from "@lazorkit/wallet";

const config = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }
};

<LazorkitProvider {...config}>
  {children}
</LazorkitProvider>
```

### Network

All examples use **Solana Devnet**. To use a different network, update `app/lib/constants.ts`.

## 🛠️ Technologies Used

- **[Next.js 14](https://nextjs.org/)** - React framework
- **[Lazorkit SDK](https://lazorkit.com/)** - Passkey wallet infrastructure
- **[Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)** - Solana JavaScript SDK
- **[SPL Token](https://spl.solana.com/)** - Token program utilities
- **[Metaplex](https://metaplex.com/)** - NFT standard for Solana
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS

## 📖 Learning Path

We recommend following the examples in order:

1. **Start with Example 1** to understand wallet basics
2. **Move to Example 2** to learn transaction handling
3. **Complete with Example 3** for advanced NFT operations

Each example's README contains:
- Detailed code walkthroughs
- API references
- Best practices
- Common issues and solutions

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Resources

- [Lazorkit Documentation](https://docs.lazorkit.com)
- [Lazorkit GitHub](https://github.com/lazor-kit)
- [Solana Documentation](https://docs.solana.com)
- [Metaplex Documentation](https://docs.metaplex.com)
- [Solana Faucet](https://faucet.solana.com)

---

Built with ❤️ by [TSMBOA](https://x.com/tsmboa) using [Lazorkit SDK](https://lazorkit.com)

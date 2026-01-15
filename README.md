# Lazorkit SDK Examples

Complete examples demonstrating passkey-based wallet authentication on Solana, for both web and mobile platforms.

## 🚀 Quick Start

### Web (Next.js)

```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

### Mobile (Expo/React Native)

```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go app
```

## 📱 Test Mobile on Your Phone

1. **Download Expo Go** - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. **Run** `cd mobile && npx expo start`
3. **Scan the QR code** with your camera (iOS) or Expo Go app (Android)

## 📁 Project Structure

```
lazorkit-examples/
├── web/                    # Next.js web app
│   ├── app/
│   │   ├── examples/       # 3 web examples
│   │   ├── components/     # Shared components
│   │   └── lib/            # Utilities
│   └── package.json
│
├── mobile/                 # Expo React Native app
│   ├── app/
│   │   ├── (tabs)/         # Tab-based examples
│   │   └── _layout.tsx     # Root layout
│   ├── lib/                # Utilities
│   └── package.json
│
└── README.md               # This file
```

## 🎯 Examples

### Web Examples

| # | Example | Description |
|---|---------|-------------|
| 1 | Smart Wallet | Create & connect passkey-based wallet |
| 2 | Gasless Transfer | Send SOL without paying fees |
| 3 | NFT Minting | Create NFTs with Metaplex |

### Mobile Examples

| # | Example | Description |
|---|---------|-------------|
| 1 | Connect | Passkey wallet authentication |
| 2 | Balance | View SOL balance |
| 3 | Send | Transfer SOL with passkey |

## 🔧 Prerequisites

- **Node.js 18+** for local development
- **Modern browser** with passkey support (Chrome, Safari, Edge, Firefox)
- **Expo Go app** for mobile testing (iOS/Android)
- **Devnet SOL** from [Solana Faucet](https://faucet.solana.com)

## 📚 Technologies

- **Lazorkit SDK** - Passkey authentication for Solana
- **Next.js 16** - Web framework
- **Expo** - React Native framework
- **@solana/web3.js** - Solana JavaScript SDK
- **Metaplex** - NFT standard (web only)

## 🔗 Resources

- [Lazorkit Documentation](https://docs.lazorkit.com)
- [Solana Faucet](https://faucet.solana.com)
- [Solana Explorer](https://explorer.solana.com?cluster=devnet)
- [Metaplex Documentation](https://docs.metaplex.com)

---

Built with ❤️ by [TSMBOA](https://x.com/tsmboa) using [Lazorkit SDK](https://lazorkit.com)

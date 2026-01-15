# Lazorkit Mobile Examples

React Native examples for the Lazorkit SDK using Expo.

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone.

## Examples

| Tab | Description |
|-----|-------------|
| **Home** | Welcome screen with overview |
| **Connect** | Passkey wallet authentication |
| **Balance** | View SOL balance with refresh |
| **Send** | Transfer SOL with gasless transaction |

## Testing

### iOS
1. Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779)
2. Run `npx expo start`
3. Scan QR code with Camera app

### Android
1. Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Run `npx expo start`
3. Scan QR code with Expo Go app

## Project Structure

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── connect.tsx    # Example 1
│   │   ├── balance.tsx    # Example 2
│   │   └── send.tsx       # Example 3
│   └── _layout.tsx        # Root layout
├── lib/
│   ├── constants.ts       # Config & colors
│   ├── solana.ts          # Solana utilities
│   └── LazorkitProvider.tsx
└── package.json
```

## Dependencies

- `@lazorkit/wallet-mobile-adapter` - Passkey wallet SDK
- `@solana/web3.js` - Solana JavaScript SDK
- `expo-router` - File-based navigation
- `expo` - React Native framework

## Network

All examples use **Solana Devnet**. Get free SOL from the [Solana Faucet](https://faucet.solana.com).

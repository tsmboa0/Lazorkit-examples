# Example 1: Smart Wallet & Authentication

> **Foundation Example** - This example establishes the core wallet functionality used by all subsequent examples.

## Overview

This example demonstrates how to create and connect a passkey-based smart wallet using the Lazorkit SDK. Passkeys provide a secure, user-friendly alternative to traditional seed phrases, using biometrics like Face ID or Touch ID for authentication.

## What You'll Learn

- ✅ Setting up the `LazorkitProvider`
- ✅ Using the `useWallet` hook
- ✅ Creating a new wallet with passkeys
- ✅ Connecting to an existing wallet
- ✅ Fetching and displaying wallet balance
- ✅ Handling wallet disconnection

## Key Concepts

### What are Passkeys?

Passkeys are a modern authentication standard that replaces passwords with biometric authentication (Face ID, Touch ID, Windows Hello) or security keys. Key benefits include:

- **No seed phrases** - Users don't need to write down or remember 24 words
- **Phishing resistant** - Credentials are bound to the specific website
- **Hardware-backed** - Private keys are stored in the device's secure enclave
- **Cross-device sync** - Can sync across devices via iCloud, Google, or Microsoft accounts

### What is a Smart Wallet?

A Lazorkit smart wallet is a program-controlled wallet on Solana where:

- The **passkey credential** authorizes transactions (instead of a private key)
- The wallet can support **advanced features** like session keys, spending limits, and account recovery
- Users get a **consistent address** across sessions

## Code Walkthrough

### Step 1: Provider Setup

First, wrap your app with `LazorkitProvider` in your layout or root component:

```tsx
// app/providers.tsx
import { LazorkitProvider } from "@lazorkit/wallet";

export function Providers({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com"
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### Step 2: Using the Wallet Hook

The `useWallet` hook provides all wallet functionality:

```tsx
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const {
    connect,      // Function to authenticate with passkey
    disconnect,   // Function to sign out
    wallet,       // Wallet object with smartWallet address
    isConnected,  // Boolean connection status
  } = useWallet();
  
  // ...
}
```

### Step 3: Connecting the Wallet

Call `connect()` to trigger passkey authentication:

```tsx
const handleConnect = async () => {
  try {
    await connect();
    // Success! wallet.smartWallet now contains the address
    console.log("Connected:", wallet?.smartWallet);
  } catch (error) {
    // User cancelled or browser doesn't support passkeys
    console.error("Connection failed:", error);
  }
};
```

### Step 4: Fetching Balance

Once connected, you can interact with the wallet on Solana:

```tsx
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const fetchBalance = async () => {
  const connection = new Connection("https://api.devnet.solana.com");
  const publicKey = new PublicKey(wallet.smartWallet);
  const balance = await connection.getBalance(publicKey);
  
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
};
```

## API Reference

### `useWallet()` Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `connect` | `() => Promise<void>` | Opens passkey authentication flow |
| `disconnect` | `() => Promise<void>` | Clears current session |
| `wallet` | `{ smartWallet: string } \| null` | Wallet object when connected |
| `isConnected` | `boolean` | Current connection status |
| `signAndSendTransaction` | `(options) => Promise<string>` | Signs and sends transactions |

### `LazorkitProvider` Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rpcUrl` | `string` | Yes | Solana RPC endpoint URL |
| `portalUrl` | `string` | Yes | Lazorkit portal URL |
| `paymasterConfig` | `object` | No | Configuration for gasless transactions |

## Common Issues

### Passkey Not Working

**Possible causes:**
- Browser doesn't support WebAuthn
- Not served over HTTPS (required for passkeys)
- Private/incognito mode may have restrictions

**Solutions:**
- Use a modern browser (Chrome 67+, Safari 14+, Firefox 60+)
- Ensure HTTPS in production
- Test on normal browser window first

### Session Not Persisting

Lazorkit manages sessions automatically, but if you're experiencing issues:
- Check that cookies/local storage are enabled
- Ensure the domain is consistent (no www vs non-www issues)

## Try It Out

1. Click the "Connect with Passkey" button
2. Complete the biometric authentication
3. View your wallet address and balance
4. Try copying the address and viewing it on Explorer
5. Disconnect and reconnect to test the full flow

## Next Steps

Now that you have a connected wallet, proceed to **Example 2: Gasless SOL Transfer** to learn how to send transactions without users paying gas fees!

# Example 2: Gasless SOL Transfer

> **Builds on Example 1** - Uses the wallet connection from the previous example to demonstrate gasless transactions.

## Overview

This example demonstrates how to perform gasless SOL transfers using Lazorkit's paymaster service. Users can send SOL without needing to pay transaction fees, dramatically improving the user experience.

## What You'll Learn

- ✅ Building Solana transaction instructions
- ✅ Using `signAndSendTransaction` from Lazorkit
- ✅ How the paymaster sponsors transaction fees
- ✅ Handling transaction confirmations
- ✅ Input validation best practices

## Prerequisites

- Complete Example 1 (have a connected wallet)
- Some devnet SOL in your wallet (get from [Solana Faucet](https://faucet.solana.com))

## Key Concepts

### What is a Paymaster?

A paymaster is a service that pays transaction fees on behalf of users:

```
Traditional Flow:
User → Pays gas fee → Transaction submitted

Gasless Flow (with Paymaster):
User → Signs transaction → Paymaster pays gas → Transaction submitted
```

Benefits:
- **Better UX** - Users don't need SOL just for fees
- **Web2-like experience** - No gas fee popups
- **Easier onboarding** - New users can transact immediately

### Transaction Instructions

Solana transactions are composed of instructions. For a simple SOL transfer:

```typescript
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Create a transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: new PublicKey(senderAddress),
  toPubkey: new PublicKey(recipientAddress),
  lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL in lamports
});
```

## Code Walkthrough

### Step 1: Build the Transfer Instruction

```typescript
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

const { wallet, signAndSendTransaction } = useWallet();

// Convert SOL to lamports (1 SOL = 1 billion lamports)
const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

// Create the transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: new PublicKey(wallet.smartWallet),
  toPubkey: new PublicKey(recipientAddress),
  lamports: lamports,
});
```

### Step 2: Sign and Send with Paymaster

```typescript
// The magic happens here!
const signature = await signAndSendTransaction({
  // Array of instructions to execute
  instructions: [instruction],
  
  // Transaction options
  transactionOptions: {
    // Setting feeToken: "SOL" enables paymaster sponsorship
    feeToken: "SOL",
  },
});

console.log("Transaction signature:", signature);
```

### Step 3: Handle the Response

```typescript
try {
  const signature = await signAndSendTransaction({
    instructions: [instruction],
    transactionOptions: { feeToken: "SOL" },
  });
  
  // Success! Show the signature and explorer link
  console.log("Success:", signature);
  
} catch (error) {
  // Handle errors gracefully
  if (error.message.includes("cancelled")) {
    console.log("User cancelled the transaction");
  } else if (error.message.includes("insufficient")) {
    console.log("Insufficient balance");
  } else {
    console.error("Transaction failed:", error);
  }
}
```

## API Reference

### `signAndSendTransaction(options)`

Signs a transaction with the user's passkey and sends it to the network.

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `instructions` | `TransactionInstruction[]` | Array of Solana instructions |
| `transactionOptions` | `object` | Transaction configuration |
| `transactionOptions.feeToken` | `"SOL"` | Token for fee payment (enables paymaster) |
| `transactionOptions.computeUnitLimit` | `number` | Optional compute budget |

**Returns:** `Promise<string>` - Transaction signature

**Example:**

```typescript
const signature = await signAndSendTransaction({
  instructions: [transferInstruction, memoInstruction],
  transactionOptions: {
    feeToken: "SOL",
    computeUnitLimit: 200000,
  },
});
```

## Understanding SOL Units

Solana uses lamports as the base unit:

| SOL | Lamports |
|-----|----------|
| 1 | 1,000,000,000 |
| 0.1 | 100,000,000 |
| 0.001 | 1,000,000 |
| 0.000001 | 1,000 |

**Tip:** Always use `LAMPORTS_PER_SOL` constant for conversions:

```typescript
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const lamports = solAmount * LAMPORTS_PER_SOL;  // SOL to lamports
const sol = lamports / LAMPORTS_PER_SOL;         // lamports to SOL
```

## Error Handling

Common errors and how to handle them:

| Error | Cause | Solution |
|-------|-------|----------|
| "Insufficient funds" | Not enough SOL | Check balance before transfer |
| "Invalid public key" | Bad address format | Validate address with `new PublicKey()` |
| "User cancelled" | User rejected passkey | Show friendly message, allow retry |
| "Blockhash expired" | Transaction took too long | Retry the transaction |

## Best Practices

1. **Always validate inputs** before building transactions
2. **Show clear feedback** during the signing process
3. **Handle errors gracefully** with user-friendly messages
4. **Refresh balance** after successful transactions
5. **Provide explorer links** so users can verify transactions

## Try It Out

1. Make sure you have devnet SOL (use the faucet link in the UI)
2. Enter a recipient address (or use the test address button)
3. Enter an amount to send
4. Click "Send SOL (Gasless)"
5. Authenticate with your passkey
6. View the transaction on Solana Explorer

## Common Issues

### "No SOL Balance"

You need devnet SOL to transfer. Get some from:
- [Solana Faucet](https://faucet.solana.com)
- Paste your wallet address and request an airdrop

### Transaction Not Confirming

On devnet, confirmations can sometimes be slow. The UI will show the signature once the transaction is submitted - use the Explorer link to track confirmation status.

## Next Steps

Now that you can make gasless transfers, proceed to **Example 3: NFT Creation & Minting** to learn how to create NFTs using Metaplex with your smart wallet!

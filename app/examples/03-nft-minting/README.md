# Example 3: NFT Creation & Minting

> **Final Example** - Uses skills from Examples 1 & 2 to create and mint NFTs with Metaplex.

## Overview

This example demonstrates how to create and mint NFTs (Non-Fungible Tokens) on Solana using the Metaplex protocol with your Lazorkit smart wallet. NFTs are unique digital assets stored on the blockchain.

## What You'll Learn

- ✅ Understanding NFT structure on Solana
- ✅ Building NFT minting instructions
- ✅ Using Metaplex Token Metadata program
- ✅ Handling multi-signer transactions
- ✅ Working with metadata and images

## Prerequisites

- Complete Examples 1 & 2 (connected wallet)
- At least 0.02-0.05 devnet SOL (for account rent)

## Key Concepts

### NFT Structure on Solana

On Solana, NFTs are composed of multiple accounts:

```
NFT
├── Mint Account          (unique token address)
├── Token Account         (holds the 1 token)
├── Metadata Account      (name, symbol, URI)
└── Master Edition        (proves uniqueness)
```

| Component | Purpose |
|-----------|---------|
| **Mint** | The NFT's unique address. SPL token with 0 decimals, supply of 1 |
| **Token Account** | ATA that holds the NFT token |
| **Metadata** | On-chain data: name, symbol, URI to JSON |
| **Master Edition** | Proves originality, controls print editions |

### Metaplex Token Metadata

Metaplex is the standard NFT protocol on Solana:

- **Program ID**: `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`
- **Creates** metadata and edition accounts
- **Stores** NFT information on-chain
- **Enables** royalties, collections, and more

## Code Walkthrough

### Step 1: Prepare Metadata

```typescript
// NFT metadata input
const metadata = {
  name: "My Lazorkit NFT",
  symbol: "LNFT",
  description: "Created with Lazorkit SDK",
  uri: "https://arweave.net/...", // Points to full metadata JSON
  sellerFeeBasisPoints: 500,      // 5% royalties
};
```

### Step 2: Build Minting Instructions

```typescript
import { createNFTInstructions } from "./utils/metaplex";

// Generate all instructions needed
const { 
  instructions, 
  mintKeypair,  // New keypair for the NFT mint
  mintAddress,  // The NFT's address
} = await createNFTInstructions(
  connection,
  payerPublicKey,
  metadata
);
```

The instructions include:
1. Create mint account
2. Initialize mint (0 decimals)
3. Create token account
4. Mint 1 token
5. Create metadata account
6. Create master edition

### Step 3: Sign and Send Transaction

```typescript
// NFTs require the mint keypair to sign
const signature = await signAndSendTransaction({
  instructions,
  transactionOptions: { feeToken: "SOL" },
  signers: [mintKeypair], // Mint must sign!
});

console.log("NFT Mint Address:", mintAddress.toBase58());
```

## Understanding the Metaplex Instructions

### Create Metadata Account

```typescript
// Derives the metadata PDA
const [metadataAddress] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mintAddress.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);
```

### Create Master Edition

```typescript
// Derives the master edition PDA
const [masterEditionAddress] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mintAddress.toBuffer(),
    Buffer.from("edition"),
  ],
  TOKEN_METADATA_PROGRAM_ID
);
```

## Metadata JSON Standard

The metadata URI should point to a JSON file following this structure:

```json
{
  "name": "My Lazorkit NFT",
  "symbol": "LNFT",
  "description": "An NFT created using Lazorkit SDK",
  "image": "https://example.com/image.png",
  "attributes": [
    { "trait_type": "Created With", "value": "Lazorkit" },
    { "trait_type": "Rarity", "value": "Legendary" }
  ],
  "properties": {
    "files": [
      { "uri": "https://example.com/image.png", "type": "image/png" }
    ],
    "category": "image"
  }
}
```

## Cost Breakdown

Minting an NFT requires SOL for account rent:

| Account | Approx. Rent |
|---------|--------------|
| Mint | 0.00144 SOL |
| Token Account | 0.00203 SOL |
| Metadata | 0.00561 SOL |
| Master Edition | 0.00168 SOL |
| **Total** | **~0.015 SOL** |

*Note: Rent is non-refundable but accounts are permanent.*

## Common Issues

### "Insufficient funds" error

NFT minting requires SOL for account rent. Make sure you have at least 0.02 SOL. Get devnet SOL from the [Solana Faucet](https://faucet.solana.com).

### "Invalid metadata URI"

The URI must be accessible and return valid JSON. For testing, you can use:
- Placeholder services
- IPFS (pinned content)
- Arweave (permanent storage)

### Transaction timeout

NFT minting involves multiple instructions. If the transaction times out, try again - devnet can be slow sometimes.

## Best Practices

1. **Upload metadata first** - Ensure metadata JSON is available before minting
2. **Use permanent storage** - IPFS/Arweave for production NFTs
3. **Validate inputs** - Check name/symbol length before submitting
4. **Handle errors gracefully** - Provide clear feedback to users
5. **Show progress** - Minting takes longer than simple transfers

## Try It Out

1. Ensure you have devnet SOL (at least 0.02)
2. Fill in the NFT details:
   - Name (up to 32 characters)
   - Symbol (up to 10 characters)
   - Description
   - Image URL
3. Preview your NFT
4. Click "Mint NFT"
5. Authenticate with passkey
6. View your NFT on Solana Explorer!

## Congratulations! 🎉

You've completed all three Lazorkit SDK examples:

1. ✅ **Smart Wallet** - Passkey authentication and wallet connection
2. ✅ **Gasless Transfer** - Sending SOL without paying fees
3. ✅ **NFT Minting** - Creating NFTs with Metaplex

You now have the foundations to build amazing Solana applications with Lazorkit!

## Next Steps

- Explore the [Lazorkit Documentation](https://docs.lazorkit.com)
- Check out [Metaplex Documentation](https://docs.metaplex.com)
- Build your own dApp with passkey authentication!

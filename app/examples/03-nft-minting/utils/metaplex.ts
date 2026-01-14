/**
 * =============================================================================
 * METAPLEX UTILITIES FOR NFT MINTING
 * =============================================================================
 * 
 * Helper functions for creating and minting NFTs using Metaplex on Solana.
 * These utilities work with Lazorkit smart wallets.
 * 
 * NFT CREATION OVERVIEW:
 * 1. Create a new mint account (the NFT's unique token address)
 * 2. Create associated token account for the minter
 * 3. Mint exactly 1 token to make it an NFT
 * 4. Create metadata account with name, symbol, URI
 * 5. Create master edition account (proves uniqueness)
 * 
 * This file provides the instructions needed for steps 1-5.
 */

import {
    Connection,
    PublicKey,
    TransactionInstruction,
    SystemProgram,
    Keypair,
    SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
} from "@solana/spl-token";

// =============================================================================
// METAPLEX PROGRAM IDS
// =============================================================================

/**
 * The Token Metadata Program ID (Metaplex)
 * This program creates and manages NFT metadata on-chain.
 */
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// =============================================================================
// NFT METADATA TYPES
// =============================================================================

/**
 * NFT metadata input from the user
 */
export interface NFTMetadataInput {
    /** Name of the NFT */
    name: string;
    /** Symbol (like a ticker, e.g., "COOL") */
    symbol: string;
    /** Description of the NFT */
    description: string;
    /** URI to the metadata JSON (usually on IPFS/Arweave) */
    uri: string;
    /** Royalty percentage (0-100) */
    sellerFeeBasisPoints?: number;
}

/**
 * Result of creating NFT instructions
 */
export interface CreateNFTResult {
    /** All instructions needed to mint the NFT */
    instructions: TransactionInstruction[];
    /** The new mint keypair (needs to sign) */
    mintKeypair: Keypair;
    /** The mint address (NFT's public key) */
    mintAddress: PublicKey;
    /** The token account that will hold the NFT */
    tokenAccount: PublicKey;
    /** The metadata account address */
    metadataAddress: PublicKey;
    /** The master edition account address */
    masterEditionAddress: PublicKey;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Derives the metadata account address for a given mint.
 * 
 * The metadata account stores NFT information like name, symbol, and URI.
 * It's a PDA (Program Derived Address) derived from the mint address.
 */
export function getMetadataAddress(mint: PublicKey): PublicKey {
    const [address] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    return address;
}

/**
 * Derives the master edition account address for a given mint.
 * 
 * The master edition proves this is a 1/1 NFT or the original of a collection.
 * It's also a PDA derived from the mint address.
 */
export function getMasterEditionAddress(mint: PublicKey): PublicKey {
    const [address] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    return address;
}

// =============================================================================
// MAIN NFT CREATION FUNCTION
// =============================================================================

/**
 * Creates all the transaction instructions needed to mint an NFT.
 * 
 * This function generates 6 instructions:
 * 1. Create the mint account
 * 2. Initialize the mint
 * 3. Create associated token account
 * 4. Mint 1 token
 * 5. Create metadata account
 * 6. Create master edition
 * 
 * @param connection - Solana connection
 * @param payer - The wallet paying for the transaction
 * @param metadata - NFT metadata (name, symbol, uri)
 * @returns Instructions to mint the NFT
 */
export async function createNFTInstructions(
    connection: Connection,
    payer: PublicKey,
    metadata: NFTMetadataInput
): Promise<CreateNFTResult> {
    // Generate a new keypair for the mint
    // This will be the NFT's unique address
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;

    console.log("🎨 Creating NFT with mint:", mintAddress.toBase58());

    // Get the associated token account address
    // This is where the NFT will be stored
    const tokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        payer,
        true // allowOwnerOffCurve - needed for smart wallets
    );

    // Get the metadata PDA
    const metadataAddress = getMetadataAddress(mintAddress);

    // Get the master edition PDA
    const masterEditionAddress = getMasterEditionAddress(mintAddress);

    // Get minimum rent for a mint account
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    // Array to collect all instructions
    const instructions: TransactionInstruction[] = [];

    // =========================================
    // INSTRUCTION 1: Create Mint Account
    // =========================================
    // Allocate space for the mint account on-chain
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mintAddress,
            space: MINT_SIZE,
            lamports: mintRent,
            programId: TOKEN_PROGRAM_ID,
        })
    );

    // =========================================
    // INSTRUCTION 2: Initialize Mint
    // =========================================
    // Set up the mint with 0 decimals (NFTs are indivisible)
    // Payer is both mint authority and freeze authority
    instructions.push(
        createInitializeMintInstruction(
            mintAddress,      // The mint account
            0,                // 0 decimals = NFT
            payer,            // Mint authority
            payer,            // Freeze authority
            TOKEN_PROGRAM_ID
        )
    );

    // =========================================
    // INSTRUCTION 3: Create Token Account
    // =========================================
    // Create the associated token account to hold the NFT
    instructions.push(
        createAssociatedTokenAccountInstruction(
            payer,            // Payer
            tokenAccount,     // ATA address
            payer,            // Owner
            mintAddress,      // Mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        )
    );

    // =========================================
    // INSTRUCTION 4: Mint 1 Token
    // =========================================
    // Mint exactly 1 token, making it an NFT
    instructions.push(
        createMintToInstruction(
            mintAddress,      // Mint
            tokenAccount,     // Destination
            payer,            // Authority
            1,                // Amount: 1 for NFT
            [],               // No multisig
            TOKEN_PROGRAM_ID
        )
    );

    // =========================================
    // INSTRUCTION 5: Create Metadata Account
    // =========================================
    // Build the create metadata instruction data
    const createMetadataIx = createMetadataInstruction(
        metadataAddress,
        mintAddress,
        payer,          // Mint authority
        payer,          // Payer
        payer,          // Update authority
        metadata.name,
        metadata.symbol,
        metadata.uri,
        metadata.sellerFeeBasisPoints || 0
    );
    instructions.push(createMetadataIx);

    // =========================================
    // INSTRUCTION 6: Create Master Edition
    // =========================================
    // Create the master edition account
    const createMasterEditionIx = createMasterEditionInstruction(
        masterEditionAddress,
        mintAddress,
        payer,          // Update authority
        payer,          // Mint authority
        metadataAddress,
        payer           // Payer
    );
    instructions.push(createMasterEditionIx);

    return {
        instructions,
        mintKeypair,
        mintAddress,
        tokenAccount,
        metadataAddress,
        masterEditionAddress,
    };
}

// =============================================================================
// METAPLEX INSTRUCTION BUILDERS
// =============================================================================

/**
 * Creates the instruction for creating metadata account (v3)
 * 
 * This manually builds the CreateMetadataAccountV3 instruction
 * from the Metaplex Token Metadata program.
 */
function createMetadataInstruction(
    metadataAccount: PublicKey,
    mint: PublicKey,
    mintAuthority: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    sellerFeeBasisPoints: number
): TransactionInstruction {
    // Build the instruction data
    // See: https://docs.metaplex.com/programs/token-metadata/instructions

    const data = Buffer.concat([
        Buffer.from([33]), // Instruction discriminator for CreateMetadataAccountV3

        // DataV2 struct
        serializeString(name),
        serializeString(symbol),
        serializeString(uri),
        Buffer.from(new Uint16Array([sellerFeeBasisPoints]).buffer), // seller_fee_basis_points
        Buffer.from([0]),  // creators: None
        Buffer.from([0]),  // collection: None
        Buffer.from([0]),  // uses: None

        // is_mutable
        Buffer.from([1]),  // true

        // collection_details: None
        Buffer.from([0]),
    ]);

    const keys = [
        { pubkey: metadataAccount, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: mintAuthority, isSigner: true, isWritable: false },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: updateAuthority, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: TOKEN_METADATA_PROGRAM_ID,
        data,
    });
}

/**
 * Creates the instruction for creating master edition (v3)
 */
function createMasterEditionInstruction(
    edition: PublicKey,
    mint: PublicKey,
    updateAuthority: PublicKey,
    mintAuthority: PublicKey,
    metadata: PublicKey,
    payer: PublicKey
): TransactionInstruction {
    // Build the instruction data
    // Instruction discriminator for CreateMasterEditionV3
    // maxSupply: None (means unlimited prints possible, or use 0 for 1/1)
    const maxSupplyBuffer = Buffer.alloc(8);
    maxSupplyBuffer.writeBigUInt64LE(BigInt(0));

    const data = Buffer.concat([
        Buffer.from([17]), // Instruction discriminator
        Buffer.from([1]),  // Option<u64> Some
        maxSupplyBuffer,   // 0 for unique NFT
    ]);

    const keys = [
        { pubkey: edition, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: updateAuthority, isSigner: true, isWritable: false },
        { pubkey: mintAuthority, isSigner: true, isWritable: false },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: metadata, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: TOKEN_METADATA_PROGRAM_ID,
        data,
    });
}

/**
 * Serializes a string for Metaplex instruction data
 */
function serializeString(str: string): Buffer {
    const strBuffer = Buffer.from(str, "utf-8");
    const lenBuffer = Buffer.alloc(4);
    lenBuffer.writeUInt32LE(strBuffer.length);
    return Buffer.concat([lenBuffer, strBuffer]);
}

// =============================================================================
// SAMPLE METADATA JSON
// =============================================================================

/**
 * Example of what the metadata URI should point to.
 * This JSON is typically hosted on IPFS or Arweave.
 * 
 * For testing, you can use a placeholder or host your own.
 */
export const SAMPLE_METADATA_JSON = {
    name: "My Lazorkit NFT",
    symbol: "LNFT",
    description: "An NFT created using Lazorkit SDK with passkey authentication",
    image: "https://placehold.co/600x600/1a1a2e/ff6b6b?text=Lazorkit+NFT",
    attributes: [
        { trait_type: "Creator", value: "Lazorkit" },
        { trait_type: "Example", value: "NFT Minting" },
    ],
    properties: {
        files: [
            {
                uri: "https://placehold.co/600x600/1a1a2e/ff6b6b?text=Lazorkit+NFT",
                type: "image/png",
            },
        ],
        category: "image",
    },
};

/**
 * A test metadata URI hosted on Arweave for quick testing.
 * In production, you would upload your own metadata.
 */
export const TEST_METADATA_URI =
    "https://arweave.net/example-metadata-uri-replace-with-real";

/**
 * =============================================================================
 * SOLANA UTILITIES
 * =============================================================================
 * 
 * Helper functions for interacting with the Solana blockchain.
 * These utilities are used across all examples.
 * 
 * INCLUDES:
 * - Connection factory
 * - Token account address derivation
 * - Error formatting
 */

import { Connection, PublicKey, Cluster, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { NETWORK, COMMITMENT } from "./constants";

// =============================================================================
// CONNECTION
// =============================================================================

/**
 * Creates a connection to the Solana network.
 * 
 * Uses the configured network (devnet by default) with confirmed commitment.
 * 
 * @param cluster - Optional cluster override (devnet, testnet, mainnet-beta)
 * @returns A Solana Connection instance
 * 
 * @example
 * const connection = getConnection();
 * const balance = await connection.getBalance(publicKey);
 */
export const getConnection = (cluster: Cluster = NETWORK): Connection => {
    return new Connection(clusterApiUrl(cluster), COMMITMENT);
};

// =============================================================================
// TOKEN ACCOUNTS
// =============================================================================

/**
 * Derives the Associated Token Account (ATA) address for a given mint and owner.
 * 
 * ATAs are deterministic addresses where tokens are stored for each wallet.
 * This function calculates the address without creating the account.
 * 
 * @param mint - The token mint public key
 * @param owner - The wallet owner public key
 * @param allowOwnerOffCurve - Allow PDA owners (true for smart wallets)
 * @param programId - Token program ID (default: TOKEN_PROGRAM_ID)
 * @param associatedTokenProgramId - ATA program ID
 * @returns The derived ATA public key
 * 
 * @example
 * const usdcMint = new PublicKey("...");
 * const ata = getAssociatedTokenAddressSync(usdcMint, walletPubkey);
 */
export const getAssociatedTokenAddressSync = (
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = true,  // Set to true for smart wallets (PDAs)
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): PublicKey => {
    // Validate owner is on curve (unless we explicitly allow off-curve)
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) {
        throw new Error("TokenOwnerOffCurveError: Owner must be on the ed25519 curve");
    }

    // Derive the ATA address using seeds: [owner, token_program, mint]
    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
        associatedTokenProgramId
    );

    return address;
};

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Formats transaction errors into user-friendly messages.
 * 
 * Handles various error types and extracts meaningful messages.
 * 
 * @param error - The error object from a failed transaction
 * @returns A formatted error message string
 * 
 * @example
 * try {
 *   await signAndSendTransaction(...);
 * } catch (error) {
 *   const message = formatTransactionError(error);
 *   alert(message);
 * }
 */
export const formatTransactionError = (error: any): string => {
    if (!error) return "Unknown error occurred";

    // Handle string errors
    if (typeof error === "string") return error;

    // Handle Error objects
    if (error.message) {
        const msg = error.message;

        // Map common Solana errors to friendly messages
        if (msg.includes("insufficient funds") || msg.includes("0x1")) {
            return "Insufficient SOL balance for this transaction";
        }
        if (msg.includes("blockhash")) {
            return "Transaction expired. Please try again.";
        }
        if (msg.includes("cancelled") || msg.includes("canceled")) {
            return "Transaction was cancelled by user";
        }
        if (msg.includes("simulation failed")) {
            return "Transaction simulation failed. Check your inputs.";
        }

        return msg;
    }

    // Fallback: stringify the error
    return JSON.stringify(error);
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Waits for a specified number of milliseconds.
 * Useful for adding delays between operations.
 * 
 * @param ms - Milliseconds to wait
 * @returns A promise that resolves after the delay
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Validates that a string is a valid Solana public key.
 * 
 * @param address - The address string to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * if (!isValidPublicKey(recipientAddress)) {
 *   setError("Invalid address format");
 * }
 */
export const isValidPublicKey = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};

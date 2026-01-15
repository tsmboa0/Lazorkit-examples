/**
 * =============================================================================
 * SOLANA UTILITIES FOR MOBILE
 * =============================================================================
 * 
 * Helper functions for interacting with the Solana blockchain.
 * These utilities are used across all mobile examples.
 * 
 * Includes:
 * - Connection factory
 * - Balance fetching
 * - Error formatting
 * =============================================================================
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL, Commitment } from "@solana/web3.js";
import { LAZORKIT_CONFIG } from "./constants";

// =============================================================================
// CONNECTION
// =============================================================================

/**
 * Default commitment level for transactions.
 */
const COMMITMENT: Commitment = "confirmed";

/**
 * Cached connection instance.
 * We reuse the same connection to avoid creating multiple WebSocket connections.
 */
let _connection: Connection | null = null;

/**
 * Gets or creates a connection to the Solana network.
 * 
 * @returns A Solana Connection instance
 * 
 * @example
 * const connection = getConnection();
 * const balance = await connection.getBalance(publicKey);
 */
export const getConnection = (): Connection => {
    if (!_connection) {
        _connection = new Connection(LAZORKIT_CONFIG.rpcUrl, COMMITMENT);
    }
    return _connection;
};

// =============================================================================
// BALANCE UTILITIES
// =============================================================================

/**
 * Fetches the SOL balance for a given wallet address.
 * 
 * @param address - The wallet public key as a string
 * @returns Balance in SOL (not lamports)
 * 
 * @example
 * const balance = await getSolBalance("ABC123...");
 * console.log(`Balance: ${balance} SOL`);
 */
export const getSolBalance = async (address: string): Promise<number> => {
    try {
        const connection = getConnection();
        const publicKey = new PublicKey(address);
        const balanceLamports = await connection.getBalance(publicKey);
        return balanceLamports / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error("Failed to fetch SOL balance:", error);
        return 0;
    }
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

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

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Formats transaction errors into user-friendly messages.
 * 
 * @param error - The error object from a failed transaction
 * @returns A formatted error message string
 */
export const formatTransactionError = (error: any): string => {
    if (!error) return "Unknown error occurred";

    if (typeof error === "string") return error;

    if (error.message) {
        const msg = error.message;

        // Map common Solana errors to friendly messages
        if (msg.includes("insufficient funds") || msg.includes("0x1")) {
            return "Insufficient SOL balance";
        }
        if (msg.includes("blockhash")) {
            return "Transaction expired. Please try again.";
        }
        if (msg.includes("cancelled") || msg.includes("canceled")) {
            return "Transaction was cancelled";
        }
        if (msg.includes("simulation failed")) {
            return "Transaction simulation failed";
        }

        return msg;
    }

    return "Transaction failed";
};

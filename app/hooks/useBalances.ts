/**
 * =============================================================================
 * USE BALANCES HOOK
 * =============================================================================
 * 
 * A custom React hook that fetches and manages token balances for a wallet.
 * Used across examples to display wallet balances.
 * 
 * FEATURES:
 * - Fetches SOL balance
 * - Fetches USDC balance (devnet)
 * - Auto-refreshes every 10 seconds
 * - Manual refresh function
 * - Loading state management
 * 
 * @example
 * const { solBalance, usdcBalance, loading, fetchBalances } = useBalances(walletAddress);
 */

import { useState, useEffect, useCallback } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getConnection } from "../lib/solana-utils";
import { getAccount } from "@solana/spl-token";
import { TOKENS } from "../lib/constants";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Devnet USDC Mint Address */
const USDC_MINT = new PublicKey(TOKENS.USDC.mint);

/** Refresh interval in milliseconds (10 seconds) */
const REFRESH_INTERVAL = 10000;

// =============================================================================
// HOOK
// =============================================================================

/**
 * useBalances Hook
 * 
 * Fetches and manages SOL and USDC balances for a given wallet address.
 * Automatically refreshes balances every 10 seconds while the wallet is connected.
 * 
 * @param smartWalletAddress - The wallet's public key as a string, or null/undefined
 * @returns Object containing balances, loading state, and refresh function
 * 
 * @example
 * function WalletInfo() {
 *   const { wallet } = useWallet();
 *   const { solBalance, usdcBalance, loading, fetchBalances } = useBalances(wallet?.smartWallet);
 * 
 *   return (
 *     <div>
 *       <p>SOL: {solBalance?.toFixed(4) ?? "..."}</p>
 *       <p>USDC: {usdcBalance?.toFixed(2) ?? "..."}</p>
 *       <button onClick={fetchBalances} disabled={loading}>
 *         Refresh
 *       </button>
 *     </div>
 *   );
 * }
 */
export function useBalances(smartWalletAddress: string | null | undefined) {
    // ===========================================
    // STATE
    // ===========================================

    /** SOL balance in SOL (not lamports) */
    const [solBalance, setSolBalance] = useState<number | null>(null);

    /** USDC balance in USDC (not raw amount) */
    const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

    /** Loading state for balance fetching */
    const [loading, setLoading] = useState(false);

    // ===========================================
    // FETCH BALANCES
    // ===========================================

    /**
     * Fetches both SOL and USDC balances from the network.
     * Uses useCallback to maintain stable reference for useEffect dependency.
     */
    const fetchBalances = useCallback(async () => {
        // Guard: No wallet address provided
        if (!smartWalletAddress) {
            setSolBalance(null);
            setUsdcBalance(null);
            return;
        }

        setLoading(true);

        try {
            // Get a connection to Solana
            const connection = getConnection();
            const pubkey = new PublicKey(smartWalletAddress);

            // -----------------------------------
            // FETCH SOL BALANCE
            // -----------------------------------
            // getBalance returns lamports (1 SOL = 1,000,000,000 lamports)
            const balanceLamports = await connection.getBalance(pubkey);
            setSolBalance(balanceLamports / LAMPORTS_PER_SOL);

            // -----------------------------------
            // FETCH USDC BALANCE
            // -----------------------------------
            // First, get the Associated Token Account (ATA) address
            const ata = getAssociatedTokenAddressSync(
                USDC_MINT,
                pubkey,
                true  // Allow off-curve owner (smart wallets are PDAs)
            );

            try {
                // Try to fetch the token account
                const tokenAccount = await getAccount(connection, ata);

                // Convert raw amount to USDC (6 decimals)
                setUsdcBalance(Number(tokenAccount.amount) / Math.pow(10, TOKENS.USDC.decimals));
            } catch (e) {
                // If the account doesn't exist, the balance is 0
                // This is normal for new wallets that haven't received USDC
                setUsdcBalance(0);
            }

        } catch (error) {
            // Log error but don't crash - balances will show as null/loading
            console.error("Failed to fetch balances:", error);
        } finally {
            setLoading(false);
        }
    }, [smartWalletAddress]);

    // ===========================================
    // EFFECTS
    // ===========================================

    /**
     * Effect: Fetch balances on mount and set up auto-refresh
     * 
     * - Fetches immediately when wallet address changes
     * - Sets up interval for periodic refresh
     * - Cleans up interval on unmount
     */
    useEffect(() => {
        // Initial fetch
        fetchBalances();

        // Set up auto-refresh interval
        const intervalId = setInterval(fetchBalances, REFRESH_INTERVAL);

        // Cleanup: Clear interval when component unmounts or wallet changes
        return () => clearInterval(intervalId);
    }, [fetchBalances]);

    // ===========================================
    // RETURN
    // ===========================================

    return {
        /** SOL balance in SOL, null if not yet fetched */
        solBalance,

        /** USDC balance in USDC, null if not yet fetched */
        usdcBalance,

        /** True while fetching balances */
        loading,

        /** Function to manually trigger balance refresh */
        fetchBalances,
    };
}

/**
 * =============================================================================
 * MOBILE CONFIGURATION CONSTANTS
 * =============================================================================
 * 
 * Centralized configuration for the Lazorkit Mobile Examples app.
 * 
 * This file contains:
 * - Lazorkit SDK configuration
 * - Network settings
 * - App URL scheme for deep linking
 * - UI theme colors
 * - Helper functions
 * =============================================================================
 */

import { Cluster } from "@solana/web3.js";

// =============================================================================
// APP URL SCHEME
// =============================================================================

/**
 * Custom URL scheme for deep linking.
 * Must match the "scheme" in app.json.
 * 
 * Used for redirect URLs after:
 * - Passkey authentication
 * - Transaction signing
 */
export const APP_SCHEME = "lazorkit-examples";

/**
 * Redirect URLs for different flows.
 * The Lazorkit portal will redirect back to these URLs.
 */
export const REDIRECT_URLS = {
    /** Redirect after wallet connection */
    connect: `${APP_SCHEME}://home`,
    /** Redirect after transaction signing */
    transaction: `${APP_SCHEME}://callback`,
    /** Redirect after message signing */
    sign: `${APP_SCHEME}://callback`,
};

// =============================================================================
// NETWORK CONFIGURATION
// =============================================================================

/**
 * Current Solana network.
 */
export const NETWORK: Cluster = "devnet";

// =============================================================================
// LAZORKIT SDK CONFIGURATION
// =============================================================================

/**
 * Official Lazorkit SDK configuration.
 * These values are passed to the LazorKitProvider.
 * 
 * @see https://docs.lazorkit.com for more configuration options
 */
export const LAZORKIT_CONFIG = {
    /** RPC URL for Solana connection */
    rpcUrl: "https://api.devnet.solana.com",

    /** Lazorkit portal URL for passkey authentication */
    portalUrl: "https://portal.lazor.sh",

    /** Paymaster configuration for gasless transactions */
    configPaymaster: {
        paymasterUrl: "https://kora.devnet.lazorkit.com",
        // apiKey: 'YOUR_API_KEY' // Optional - for production use
    },
};

// =============================================================================
// SOLANA EXPLORER URLs
// =============================================================================

const EXPLORER_BASE = "https://explorer.solana.com";

/**
 * Generates a Solana Explorer URL for a transaction.
 */
export const getTransactionUrl = (signature: string): string => {
    return `${EXPLORER_BASE}/tx/${signature}?cluster=${NETWORK}`;
};

/**
 * Generates a Solana Explorer URL for a wallet address.
 */
export const getAddressUrl = (address: string): string => {
    return `${EXPLORER_BASE}/address/${address}?cluster=${NETWORK}`;
};

// =============================================================================
// UI HELPERS
// =============================================================================

/**
 * Truncates a long address or signature for display.
 */
export const truncateAddress = (address: string, chars = 4): string => {
    if (!address) return "";
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// =============================================================================
// APP THEME COLORS
// =============================================================================

/**
 * App color palette for consistent theming.
 * Matches the web app's dark theme aesthetic.
 */
export const Colors = {
    // Background colors
    background: "#0a0a0a",
    card: "#18181b",
    cardHover: "#27272a",

    // Text colors
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",

    // Accent colors
    primary: "#f43f5e",      // Rose
    primaryGradient: "#f97316", // Orange
    success: "#22c55e",      // Green
    warning: "#f59e0b",      // Amber
    error: "#ef4444",        // Red
    info: "#3b82f6",         // Blue

    // Border colors
    border: "rgba(255, 255, 255, 0.1)",
    borderActive: "rgba(244, 63, 94, 0.5)",
};

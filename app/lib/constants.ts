/**
 * =============================================================================
 * LAZORKIT SDK EXAMPLES - SHARED CONSTANTS
 * =============================================================================
 * 
 * This file contains all shared constants used across the example applications.
 * Centralizing these values makes it easier to update configurations and
 * maintain consistency across all examples.
 * 
 * KEY CONCEPTS:
 * - Network configuration for Solana devnet
 * - Lazorkit provider configuration
 * - Common token mints and their decimals
 */

import { clusterApiUrl } from "@solana/web3.js";

// =============================================================================
// NETWORK CONFIGURATION
// =============================================================================

/**
 * The Solana network we're using for examples.
 * Using 'devnet' for development and testing.
 * 
 * Available options:
 * - 'devnet': Development network with test SOL
 * - 'testnet': Test network for staging
 * - 'mainnet-beta': Production network with real SOL
 */
export const NETWORK = "devnet";

/**
 * RPC URL for connecting to the Solana network.
 * Using Solana's public devnet endpoint.
 * 
 * For production applications, consider using a dedicated RPC provider like:
 * - Helius: https://helius.dev
 * - QuickNode: https://quicknode.com
 * - Alchemy: https://alchemy.com
 */
export const RPC_URL = clusterApiUrl(NETWORK);

/**
 * Commitment level for transactions.
 * 'confirmed' provides a good balance between speed and certainty.
 * 
 * Options:
 * - 'processed': Fastest, but may be rolled back
 * - 'confirmed': Transaction confirmed by supermajority
 * - 'finalized': Transaction finalized, highest certainty
 */
export const COMMITMENT = "confirmed" as const;

// =============================================================================
// LAZORKIT CONFIGURATION
// =============================================================================

/**
 * Configuration for the Lazorkit SDK.
 * 
 * - rpcUrl: The Solana RPC endpoint for transactions
 * - portalUrl: Lazorkit's authentication portal for passkey management
 * - paymasterUrl: Lazorkit's paymaster service for gasless transactions
 */
export const LAZORKIT_CONFIG = {
    /** RPC URL for Solana transactions */
    rpcUrl: RPC_URL,

    /** Lazorkit portal URL for passkey authentication */
    portalUrl: "https://portal.lazor.sh",

    /** Paymaster configuration for gasless transactions */
    paymaster: {
        /** URL of the Kora paymaster service */
        paymasterUrl: "https://kora.devnet.lazorkit.com",
    },
} as const;

// =============================================================================
// TOKEN CONSTANTS
// =============================================================================

/**
 * Common token information for Solana devnet.
 * 
 * Note: These are DEVNET tokens and have no real value.
 * Mainnet token addresses are different!
 */
export const TOKENS = {
    /**
     * Native SOL token (wrapped SOL)
     * Used when SOL needs to be traded as an SPL token
     */
    SOL: {
        symbol: "SOL",
        name: "Solana",
        mint: "So11111111111111111111111111111111111111112",
        decimals: 9,
        /** Logo URL for UI display */
        logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    },

    /**
     * USDC stablecoin (devnet version)
     * Note: This is the devnet mint address, different from mainnet!
     */
    USDC: {
        symbol: "USDC",
        name: "USD Coin",
        mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        decimals: 6,
        logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    },
} as const;

// =============================================================================
// EXPLORER CONFIGURATION
// =============================================================================

/**
 * Base URL for Solana Explorer.
 * Used to generate links to transactions, accounts, and tokens.
 */
export const EXPLORER_BASE_URL = "https://explorer.solana.com";

/**
 * Generates a transaction explorer URL.
 * 
 * @param signature - The transaction signature
 * @returns Full URL to view the transaction on Solana Explorer
 * 
 * @example
 * const url = getTransactionUrl("5XRJy...");
 * // Returns: "https://explorer.solana.com/tx/5XRJy...?cluster=devnet"
 */
export const getTransactionUrl = (signature: string): string => {
    return `${EXPLORER_BASE_URL}/tx/${signature}?cluster=${NETWORK}`;
};

/**
 * Generates an account/address explorer URL.
 * 
 * @param address - The account public key (as string)
 * @returns Full URL to view the account on Solana Explorer
 */
export const getAddressUrl = (address: string): string => {
    return `${EXPLORER_BASE_URL}/address/${address}?cluster=${NETWORK}`;
};

/**
 * Generates a token explorer URL.
 * 
 * @param mint - The token mint address
 * @returns Full URL to view the token on Solana Explorer
 */
export const getTokenUrl = (mint: string): string => {
    return `${EXPLORER_BASE_URL}/address/${mint}?cluster=${NETWORK}`;
};

// =============================================================================
// UI CONSTANTS
// =============================================================================

/**
 * Truncates a wallet address for display.
 * Shows first 4 and last 4 characters with ellipsis.
 * 
 * @param address - Full wallet address
 * @param chars - Number of characters to show on each end (default: 4)
 * @returns Truncated address string
 * 
 * @example
 * truncateAddress("7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2");
 * // Returns: "7Np4...T4K2"
 */
export const truncateAddress = (address: string, chars: number = 4): string => {
    if (!address) return "";
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// =============================================================================
// EXAMPLE METADATA
// =============================================================================

/**
 * Information about each example in the repository.
 * Used for navigation and documentation.
 */
export const EXAMPLES = [
    {
        id: 1,
        slug: "01-smart-wallet",
        title: "Smart Wallet & Authentication",
        description: "Create and connect a passkey-based smart wallet using Lazorkit SDK.",
        path: "/examples/01-smart-wallet",
        icon: "🔐",
    },
    {
        id: 2,
        slug: "02-gasless-transfer",
        title: "Gasless SOL Transfer",
        description: "Transfer SOL without paying gas fees using Lazorkit's paymaster.",
        path: "/examples/02-gasless-transfer",
        icon: "💸",
    },
    {
        id: 3,
        slug: "03-nft-minting",
        title: "NFT Creation & Minting",
        description: "Create and mint NFTs using Metaplex with your smart wallet.",
        path: "/examples/03-nft-minting",
        icon: "🎨",
    },
] as const;

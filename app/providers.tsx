"use client";

/**
 * =============================================================================
 * LAZORKIT PROVIDER SETUP
 * =============================================================================
 * 
 * This file configures and exports the LazorkitProvider component
 * that wraps the entire application.
 * 
 * WHAT IS LAZORKITPROVIDER?
 * The LazorkitProvider is a React context provider that makes wallet
 * functionality available throughout your application. It handles:
 * 
 * - Wallet connection state management
 * - Passkey authentication flow
 * - Transaction signing and submission
 * - Paymaster interaction for gasless transactions
 * 
 * CONFIGURATION:
 * 
 * - rpcUrl: The Solana RPC endpoint. Using devnet for examples.
 *   For production, use a reliable RPC provider like Helius, QuickNode, or Alchemy.
 * 
 * - portalUrl: Lazorkit's authentication portal URL.
 *   This is where passkey registration and authentication happens.
 * 
 * - paymasterConfig: Configuration for the gasless transaction paymaster.
 *   The paymaster sponsors transaction fees so users don't need to pay gas.
 * 
 * =============================================================================
 */

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";
import { LAZORKIT_CONFIG } from "./lib/constants";

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

/**
 * Props for the Providers component
 */
interface ProvidersProps {
    /** Child components that will have access to wallet context */
    children: ReactNode;
}

/**
 * Providers Component
 * 
 * Wraps the application with necessary context providers.
 * Currently includes LazorkitProvider for wallet functionality.
 * 
 * Add additional providers here as needed (theme, state management, etc.)
 * 
 * @param children - Components that need access to wallet context
 * 
 * @example
 * // In your layout.tsx:
 * <Providers>
 *   {children}
 * </Providers>
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <LazorkitProvider
            // The Solana RPC endpoint URL
            // Using devnet for development and testing
            rpcUrl={LAZORKIT_CONFIG.rpcUrl}

            // Lazorkit's authentication portal
            // This handles the passkey registration/authentication UI
            portalUrl={LAZORKIT_CONFIG.portalUrl}

            // Paymaster configuration for gasless transactions
            // The paymaster sponsors transaction fees
            paymasterConfig={LAZORKIT_CONFIG.paymaster}
        >
            {children}
        </LazorkitProvider>
    );
}

// =============================================================================
// NOTES ON PROVIDER CONFIGURATION
// =============================================================================
/*
 * PRODUCTION CONSIDERATIONS:
 * 
 * 1. RPC URL:
 *    - Use a dedicated RPC provider for reliability
 *    - Consider rate limits and request quotas
 *    - Options: Helius, QuickNode, Alchemy, Triton
 * 
 * 2. Portal URL:
 *    - Keep using https://portal.lazor.sh for authentication
 *    - This is Lazorkit's hosted passkey management portal
 * 
 * 3. Paymaster:
 *    - The devnet paymaster has generous limits
 *    - For mainnet, you may need to fund a paymaster account
 *    - Check Lazorkit docs for production paymaster setup
 * 
 * 4. Error Handling:
 *    - Consider wrapping provider in error boundary
 *    - Handle cases where passkeys aren't supported
 */

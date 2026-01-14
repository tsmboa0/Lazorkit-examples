"use client";

/**
 * =============================================================================
 * WALLET STATUS COMPONENT
 * =============================================================================
 * 
 * A reusable component that displays the current wallet connection status.
 * Shows the connected wallet address and provides connect/disconnect actions.
 * 
 * This component is used across all examples to provide consistent
 * wallet management UI.
 * 
 * FEATURES:
 * - Shows connection status (connected/disconnected)
 * - Displays truncated wallet address
 * - Connect button with passkey authentication
 * - Disconnect button
 * - Copy address to clipboard
 * - Link to view on Solana Explorer
 */

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { truncateAddress, getAddressUrl } from "../lib/constants";

/**
 * WalletStatus Component
 * 
 * Displays the current wallet connection status and provides
 * connect/disconnect functionality using Lazorkit SDK.
 * 
 * @component
 * @example
 * // In your page component:
 * <WalletStatus />
 */
export function WalletStatus() {
    // ============================================
    // LAZORKIT WALLET HOOK
    // ============================================
    // The useWallet hook provides all wallet functionality:
    // - connect: Opens passkey authentication flow
    // - disconnect: Clears wallet session
    // - wallet: Contains smartWallet address when connected
    // - isConnected: Boolean indicating connection status
    const { connect, disconnect, wallet, isConnected } = useWallet();

    // Local state for copy feedback
    const [copied, setCopied] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handles wallet connection via passkey.
     * This triggers the browser's passkey/biometric prompt.
     */
    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            // The connect() function opens Lazorkit's passkey flow
            // This will either:
            // 1. Create a new passkey (first time users)
            // 2. Authenticate with existing passkey (returning users)
            await connect();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    /**
     * Handles wallet disconnection.
     * Clears the current session but doesn't delete the passkey.
     */
    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        }
    };

    /**
     * Copies the wallet address to clipboard.
     */
    const handleCopyAddress = async () => {
        if (!wallet?.smartWallet) return;

        try {
            await navigator.clipboard.writeText(wallet.smartWallet);
            setCopied(true);
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy address:", error);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    // Disconnected State
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-900/50 ring-1 ring-white/10">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-500" />
                    <span className="text-sm text-zinc-400">Wallet Not Connected</span>
                </div>

                {/* Connect Button */}
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="
            flex items-center justify-center gap-2
            w-full px-6 py-3 rounded-xl
            bg-gradient-to-r from-rose-500 to-orange-500
            text-white font-medium text-sm
            shadow-lg shadow-rose-500/20
            ring-1 ring-white/10
            transition-all duration-200
            hover:shadow-rose-500/30 hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
                >
                    {isConnecting ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                            <span>🔐</span>
                            <span>Connect with Passkey</span>
                        </>
                    )}
                </button>

                <p className="text-xs text-zinc-500 text-center">
                    Use your device's biometrics to authenticate
                </p>
            </div>
        );
    }

    // Connected State
    return (
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900/50 ring-1 ring-white/10">
            {/* Status Indicator */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]" />
                    <span className="text-sm text-emerald-400">Wallet Connected</span>
                </div>

                {/* Disconnect Button */}
                <button
                    onClick={handleDisconnect}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    Disconnect
                </button>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                    <code className="text-sm font-mono text-zinc-300">
                        {truncateAddress(wallet?.smartWallet || "", 8)}
                    </code>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopyAddress}
                    className="
            px-3 py-3 rounded-xl
            bg-white/5 text-zinc-400
            ring-1 ring-white/10
            hover:bg-white/10 hover:text-white
            transition-colors
          "
                    title="Copy address"
                >
                    {copied ? "✓" : "📋"}
                </button>

                {/* Explorer Link */}
                <a
                    href={getAddressUrl(wallet?.smartWallet || "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
            px-3 py-3 rounded-xl
            bg-white/5 text-zinc-400
            ring-1 ring-white/10
            hover:bg-white/10 hover:text-white
            transition-colors
          "
                    title="View on Explorer"
                >
                    🔗
                </a>
            </div>

            {/* Full Address (collapsed) */}
            <details className="text-xs">
                <summary className="text-zinc-500 cursor-pointer hover:text-zinc-400">
                    Show full address
                </summary>
                <code className="block mt-2 p-2 rounded bg-black/40 text-zinc-400 break-all">
                    {wallet?.smartWallet}
                </code>
            </details>
        </div>
    );
}

/**
 * WalletStatusCompact Component
 * 
 * A compact version of the wallet status for use in headers/navbars.
 * Shows just the address and a connect/disconnect button.
 * 
 * @component
 */
export function WalletStatusCompact() {
    const { connect, disconnect, wallet, isConnected } = useWallet();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connect();
        } catch (error) {
            console.error("Failed to connect:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    if (!isConnected) {
        return (
            <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="
          px-4 py-2 rounded-lg
          bg-rose-500/20 text-rose-400
          ring-1 ring-rose-500/30
          hover:bg-rose-500/30
          transition-colors text-sm
          disabled:opacity-50
        "
            >
                {isConnecting ? "..." : "Connect"}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <code className="text-xs text-zinc-300">
                    {truncateAddress(wallet?.smartWallet || "")}
                </code>
            </div>
            <button
                onClick={disconnect}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                title="Disconnect"
            >
                ✕
            </button>
        </div>
    );
}

"use client";

/**
 * =============================================================================
 * EXAMPLE 1: SMART WALLET & AUTHENTICATION
 * =============================================================================
 * 
 * This example demonstrates how to create and connect a passkey-based
 * smart wallet using the Lazorkit SDK.
 * 
 * WHAT YOU'LL LEARN:
 * - Setting up the LazorkitProvider
 * - Using the useWallet hook
 * - Creating a new wallet with passkeys
 * - Connecting to an existing wallet
 * - Displaying wallet information
 * - Handling wallet disconnection
 * 
 * PREREQUISITES:
 * - A browser that supports passkeys (Chrome, Safari, Firefox, Edge)
 * - The app must be served over HTTPS or localhost
 * 
 * KEY CONCEPTS:
 * 
 * 1. PASSKEYS: Passkeys are a modern authentication method that uses
 *    your device's biometrics (Face ID, Touch ID, Windows Hello) or
 *    a security key to authenticate. They replace traditional passwords
 *    and seed phrases.
 * 
 * 2. SMART WALLET: A smart wallet is a Solana wallet controlled by
 *    a smart contract. Instead of a traditional private key, your
 *    passkey credential controls the wallet, making it more secure
 *    and easier to use.
 * 
 * 3. LAZORKIT PROVIDER: The LazorkitProvider component wraps your app
 *    and provides wallet functionality to all child components through
 *    React context.
 * 
 * =============================================================================
 */

import { useWallet } from "@lazorkit/wallet";
import { useState, useEffect } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PageLayout, Section, InfoBox, CodeBlock } from "../../components/PageLayout";
import { getAddressUrl, RPC_URL, truncateAddress } from "../../lib/constants";
import { getConnection } from "../../lib/solana-utils";

/**
 * SmartWalletExample Component
 * 
 * The main component for Example 1.
 * Demonstrates the complete passkey wallet flow.
 */
export default function SmartWalletExample() {
    // ============================================
    // STEP 1: USE THE WALLET HOOK
    // ============================================
    // The useWallet() hook is your main interface to Lazorkit.
    // It provides everything you need to manage wallet state.
    const {
        connect,           // Function to initiate passkey authentication
        disconnect,        // Function to sign out
        wallet,           // Wallet object containing the smart wallet address
        isConnected,      // Boolean indicating if a wallet is connected
    } = useWallet();

    // ============================================
    // LOCAL STATE
    // ============================================
    // State for UI feedback
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [copied, setCopied] = useState(false);

    // ============================================
    // STEP 2: CONNECT WALLET
    // ============================================
    /**
     * Handles the wallet connection process.
     * 
     * When called, this function:
     * 1. Opens Lazorkit's authentication portal
     * 2. Prompts the user to authenticate with their passkey
     * 3. If successful, the wallet object is populated with the smart wallet address
     * 
     * For first-time users, this will create a new passkey and smart wallet.
     * For returning users, this will authenticate with their existing passkey.
     */
    const handleConnect = async () => {
        // Reset any previous errors
        setError(null);
        setIsConnecting(true);

        try {
            // Call the connect function from useWallet()
            // This opens a popup window for passkey authentication
            await connect();

            // If successful, isConnected will become true
            // and wallet.smartWallet will contain the address
            console.log("✅ Wallet connected successfully!");

        } catch (err: any) {
            // Handle connection errors
            console.error("❌ Failed to connect wallet:", err);

            // Common error cases:
            // - User cancelled the passkey prompt
            // - Browser doesn't support passkeys
            // - Network error
            setError(err.message || "Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    };

    // ============================================
    // STEP 3: DISCONNECT WALLET
    // ============================================
    /**
     * Handles wallet disconnection.
     * 
     * This clears the current session but does NOT delete the passkey.
     * The user can reconnect later using the same passkey.
     */
    const handleDisconnect = async () => {
        try {
            await disconnect();
            setSolBalance(null);
            console.log("👋 Wallet disconnected");
        } catch (err: any) {
            console.error("Failed to disconnect:", err);
        }
    };

    // ============================================
    // STEP 4: FETCH BALANCE
    // ============================================
    /**
     * Fetches the SOL balance of the connected wallet.
     * 
     * This demonstrates how to use the wallet address
     * to interact with the Solana blockchain.
     */
    const fetchBalance = async () => {
        if (!wallet?.smartWallet) return;

        setLoadingBalance(true);
        try {
            // Create a connection to Solana
            const connection = getConnection();

            // Convert the wallet address string to a PublicKey
            const publicKey = new PublicKey(wallet.smartWallet);

            // Fetch the balance in lamports (1 SOL = 1 billion lamports)
            const balanceLamports = await connection.getBalance(publicKey);

            // Convert to SOL
            const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

            setSolBalance(balanceSol);
            console.log(`💰 Balance: ${balanceSol} SOL`);
        } catch (err: any) {
            console.error("Failed to fetch balance:", err);
        } finally {
            setLoadingBalance(false);
        }
    };

    // Fetch balance when wallet connects
    useEffect(() => {
        if (isConnected && wallet?.smartWallet) {
            fetchBalance();
        }
    }, [isConnected, wallet?.smartWallet]);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /**
     * Copies the wallet address to clipboard
     */
    const copyAddress = async () => {
        if (!wallet?.smartWallet) return;

        await navigator.clipboard.writeText(wallet.smartWallet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <PageLayout
            exampleNumber={1}
            title="Smart Wallet & Authentication"
            description="Learn how to create and connect passkey-based wallets using the Lazorkit SDK. This is the foundation for all other examples."
        >
            {/* Introduction */}
            <InfoBox type="info" title="What are Passkeys?">
                Passkeys are a modern, secure authentication method that uses your device's
                biometrics (Face ID, Touch ID, Windows Hello) instead of passwords.
                They're phishing-resistant and tied to your device's secure hardware.
            </InfoBox>

            {/* Wallet Status Section */}
            <Section
                title="Wallet Connection"
                description="Connect your wallet using passkey authentication"
            >
                {!isConnected ? (
                    /* ====== DISCONNECTED STATE ====== */
                    <div className="flex flex-col items-center gap-6 py-8">
                        {/* Passkey Icon */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 ring-1 ring-rose-500/30">
                            <span className="text-5xl">🔐</span>
                        </div>

                        {/* Status Text */}
                        <div className="text-center">
                            <p className="text-lg text-zinc-300">
                                No wallet connected
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">
                                Click below to authenticate with your passkey
                            </p>
                        </div>

                        {/* Connect Button */}
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="
                flex items-center justify-center gap-3
                px-8 py-4 rounded-xl
                bg-gradient-to-r from-rose-500 to-orange-500
                text-white font-semibold text-lg
                shadow-lg shadow-rose-500/25
                ring-1 ring-white/10
                transition-all duration-200
                hover:shadow-rose-500/40 hover:scale-[1.02]
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
                                    <span>👆</span>
                                    <span>Connect with Passkey</span>
                                </>
                            )}
                        </button>

                        {/* Error Display */}
                        {error && (
                            <div className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ====== CONNECTED STATE ====== */
                    <div className="space-y-6">
                        {/* Success Banner */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                            <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500)]" />
                            <span className="text-emerald-400 font-medium">
                                Wallet Connected Successfully!
                            </span>
                        </div>

                        {/* Wallet Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                Smart Wallet Address
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                                    <code className="text-sm font-mono text-zinc-300 break-all">
                                        {wallet?.smartWallet}
                                    </code>
                                </div>
                                <button
                                    onClick={copyAddress}
                                    className="shrink-0 px-4 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/10"
                                >
                                    {copied ? "✓" : "📋"}
                                </button>
                            </div>
                        </div>

                        {/* Balance Display */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                SOL Balance
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                                    <span className="text-2xl font-bold text-white">
                                        {loadingBalance ? (
                                            "..."
                                        ) : solBalance !== null ? (
                                            `${solBalance.toFixed(4)} SOL`
                                        ) : (
                                            "0 SOL"
                                        )}
                                    </span>
                                </div>
                                <button
                                    onClick={fetchBalance}
                                    disabled={loadingBalance}
                                    className="px-4 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/10 disabled:opacity-50"
                                >
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <a
                                href={getAddressUrl(wallet?.smartWallet || "")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                            >
                                🔗 View on Explorer
                            </a>
                            <button
                                onClick={handleDisconnect}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                            >
                                🚪 Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </Section>

            {/* Code Example Section */}
            <Section
                title="How It Works"
                description="Here's the code that powers this example"
            >
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400">
                        The <code className="text-rose-400">useWallet()</code> hook provides
                        all the functionality you need:
                    </p>

                    <CodeBlock
                        language="typescript"
                        code={`import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  // Get wallet functions from the hook
  const { connect, disconnect, wallet, isConnected } = useWallet();

  // Connect wallet with passkey
  const handleConnect = async () => {
    await connect();
    // After connection, wallet.smartWallet contains the address
    console.log("Connected:", wallet?.smartWallet);
  };

  // Disconnect wallet
  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <div>
      {isConnected ? (
        <p>Connected: {wallet?.smartWallet}</p>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
}`}
                    />
                </div>
            </Section>

            {/* Tips Section */}
            <Section title="Tips & Best Practices">
                <div className="grid gap-4 md:grid-cols-2">
                    <InfoBox type="tip" title="Error Handling">
                        Always wrap connect() in a try/catch block. Users may cancel the
                        passkey prompt, or their browser might not support passkeys.
                    </InfoBox>

                    <InfoBox type="warning" title="HTTPS Required">
                        Passkeys only work over HTTPS or localhost. Make sure your app
                        is served securely in production.
                    </InfoBox>

                    <InfoBox type="success" title="Automatic Persistence">
                        Lazorkit automatically manages session persistence. Users stay
                        connected until they explicitly disconnect.
                    </InfoBox>

                    <InfoBox type="info" title="Cross-Device Support">
                        Passkeys can be synced across devices using iCloud Keychain,
                        Google Password Manager, or Windows Hello.
                    </InfoBox>
                </div>
            </Section>

            {/* What's Next */}
            <Section title="What's Next?">
                <p className="text-zinc-400">
                    Now that you can connect a wallet, you're ready to start making transactions!
                    In the next example, we'll use this wallet to perform <strong className="text-white">gasless SOL transfers</strong> —
                    sending SOL without the user needing to pay transaction fees.
                </p>
            </Section>
        </PageLayout>
    );
}

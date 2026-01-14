"use client";

/**
 * =============================================================================
 * EXAMPLE 2: GASLESS SOL TRANSFER
 * =============================================================================
 * 
 * This example demonstrates how to perform gasless SOL transfers using
 * Lazorkit's paymaster service. Users can send SOL without needing to
 * pay transaction fees themselves!
 * 
 * WHAT YOU'LL LEARN:
 * - Building Solana transaction instructions
 * - Using signAndSendTransaction from Lazorkit
 * - How the paymaster sponsors transaction fees
 * - Handling transaction confirmations
 * 
 * PREREQUISITES:
 * - Complete Example 1 (connect wallet)
 * - Have some devnet SOL in your wallet (get from faucet)
 * 
 * KEY CONCEPTS:
 * 
 * 1. PAYMASTER: A service that pays transaction fees on behalf of users.
 *    Lazorkit's paymaster sponsors gas fees, so users can transact with
 *    zero SOL for fees (they still need SOL for the transfer amount).
 * 
 * 2. TRANSACTION INSTRUCTIONS: Solana transactions are composed of
 *    instructions that tell the runtime what operations to perform.
 *    For a simple transfer, we use SystemProgram.transfer().
 * 
 * 3. GASLESS FLOW:
 *    a. Build transaction instructions
 *    b. Call signAndSendTransaction with feeToken: "SOL"
 *    c. User signs with passkey
 *    d. Paymaster adds fee payment and submits
 *    e. Transaction confirmed on-chain
 * 
 * =============================================================================
 */

import { useWallet } from "@lazorkit/wallet";
import { useState, useEffect, useCallback } from "react";
import {
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram
} from "@solana/web3.js";
import { PageLayout, Section, InfoBox, CodeBlock } from "../../components/PageLayout";
import { WalletStatus } from "../../components/WalletStatus";
import {
    getTransactionUrl,
    truncateAddress,
    NETWORK
} from "../../lib/constants";
import { getConnection } from "../../lib/solana-utils";

/**
 * GaslessTransferExample Component
 * 
 * The main component for Example 2.
 * Demonstrates gasless SOL transfers using Lazorkit paymaster.
 */
export default function GaslessTransferExample() {
    // ============================================
    // WALLET HOOK
    // ============================================
    // Get wallet functions including signAndSendTransaction
    const {
        wallet,
        isConnected,
        signAndSendTransaction
    } = useWallet();

    // ============================================
    // LOCAL STATE
    // ============================================
    // Form inputs
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    // Transaction state
    const [isTransferring, setIsTransferring] = useState(false);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Balance tracking
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(false);

    // ============================================
    // FETCH BALANCE
    // ============================================
    /**
     * Fetches the current SOL balance of the wallet.
     */
    const fetchBalance = useCallback(async () => {
        if (!wallet?.smartWallet) return;

        setLoadingBalance(true);
        try {
            const connection = getConnection();
            const publicKey = new PublicKey(wallet.smartWallet);
            const balance = await connection.getBalance(publicKey);
            setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        } finally {
            setLoadingBalance(false);
        }
    }, [wallet?.smartWallet]);

    // Fetch balance on connect and after transactions
    useEffect(() => {
        if (isConnected) {
            fetchBalance();
        }
    }, [isConnected, fetchBalance]);

    // ============================================
    // STEP 1: VALIDATE INPUTS
    // ============================================
    /**
     * Validates the transfer inputs before submitting.
     * Returns an error message if invalid, null if valid.
     */
    const validateInputs = (): string | null => {
        // Check recipient address
        if (!recipient.trim()) {
            return "Please enter a recipient address";
        }

        // Validate it's a valid Solana address
        try {
            new PublicKey(recipient);
        } catch {
            return "Invalid Solana address format";
        }

        // Check amount
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return "Please enter a valid amount";
        }

        // Check balance
        if (solBalance !== null && amountNum > solBalance) {
            return `Insufficient balance. You have ${solBalance.toFixed(4)} SOL`;
        }

        // Don't allow sending to yourself
        if (recipient === wallet?.smartWallet) {
            return "Cannot send to yourself";
        }

        return null;
    };

    // ============================================
    // STEP 2: EXECUTE GASLESS TRANSFER
    // ============================================
    /**
     * Executes a gasless SOL transfer using Lazorkit.
     * 
     * The flow:
     * 1. Build a SystemProgram.transfer instruction
     * 2. Call signAndSendTransaction with the instruction
     * 3. User authenticates with passkey
     * 4. Paymaster sponsors the transaction fee
     * 5. Transaction is submitted and confirmed
     */
    const handleTransfer = async () => {
        // Validate inputs first
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        // Reset state
        setError(null);
        setTxSignature(null);
        setIsTransferring(true);

        try {
            // ========================================
            // STEP 2a: BUILD THE TRANSFER INSTRUCTION
            // ========================================
            // Convert SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
            const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

            // Create the transfer instruction using SystemProgram
            // This tells Solana to transfer lamports from one account to another
            const transferInstruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(wallet!.smartWallet),  // Sender (our wallet)
                toPubkey: new PublicKey(recipient),              // Recipient
                lamports: lamports,                               // Amount in lamports
            });

            console.log("📝 Transfer instruction created:", {
                from: wallet?.smartWallet,
                to: recipient,
                amount: `${amount} SOL (${lamports} lamports)`,
            });

            // ========================================
            // STEP 2b: SIGN AND SEND TRANSACTION
            // ========================================
            // signAndSendTransaction handles:
            // - Wrapping instructions in a transaction
            // - Getting recent blockhash
            // - Passkey signing via the user's device
            // - Paymaster fee sponsorship
            // - Submitting to the network
            // - Waiting for confirmation

            const signature = await signAndSendTransaction({
                // Array of instructions to include in the transaction
                instructions: [transferInstruction],

                // Transaction options
                transactionOptions: {
                    // "SOL" means the paymaster will sponsor fees
                    // This is what makes it "gasless" for the user!
                    feeToken: "USDC",
                },
            });

            console.log("✅ Transaction successful!");
            console.log("📜 Signature:", signature);

            // Store signature for display
            setTxSignature(signature);

            // Clear form
            setRecipient("");
            setAmount("");

            // Refresh balance
            await fetchBalance();

        } catch (err: any) {
            console.error("❌ Transfer failed:", err);

            // Parse common errors for user-friendly messages
            let errorMessage = err.message || "Transaction failed";

            if (errorMessage.includes("insufficient")) {
                errorMessage = "Insufficient SOL balance for this transfer";
            } else if (errorMessage.includes("cancelled") || errorMessage.includes("canceled")) {
                errorMessage = "Transaction was cancelled";
            } else if (errorMessage.includes("blockhash")) {
                errorMessage = "Transaction expired. Please try again.";
            }

            setError(errorMessage);
        } finally {
            setIsTransferring(false);
        }
    };

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /**
     * Sets the max amount (full balance minus a small buffer)
     */
    const handleSetMax = () => {
        if (solBalance !== null) {
            // Leave a tiny buffer for rent (though gasless handles fees)
            const maxAmount = Math.max(0, solBalance - 0.001);
            setAmount(maxAmount.toFixed(4));
        }
    };

    /**
     * Pre-fill with a test recipient (devnet faucet address)
     */
    const handleTestRecipient = () => {
        // This is a common devnet test address
        setRecipient("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
        setAmount("0.001");
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <PageLayout
            exampleNumber={2}
            title="Gasless SOL Transfer"
            description="Send SOL without paying transaction fees. The Lazorkit paymaster sponsors your transactions, making the experience seamless for users."
        >
            {/* Introduction */}
            <InfoBox type="tip" title="What's Gasless?">
                With Lazorkit's paymaster, users don't pay transaction fees. The paymaster
                service covers the ~0.000005 SOL fee, so users only need SOL for the actual
                transfer amount. This dramatically improves UX for new users!
            </InfoBox>

            {/* Wallet Connection Check */}
            {!isConnected ? (
                <Section
                    title="Connect Your Wallet"
                    description="You need to connect a wallet first to make transfers"
                >
                    <WalletStatus />
                    <InfoBox type="warning" title="Wallet Required">
                        Please complete Example 1 and connect your wallet to continue with this example.
                    </InfoBox>
                </Section>
            ) : (
                <>
                    {/* Balance Display */}
                    <Section title="Your Wallet">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Address
                                </label>
                                <div className="px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                                    <code className="text-sm text-zinc-300">
                                        {truncateAddress(wallet?.smartWallet || "", 8)}
                                    </code>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Balance
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                                        <span className="text-lg font-bold text-white">
                                            {loadingBalance ? "..." : `${solBalance?.toFixed(4) || "0"} SOL`}
                                        </span>
                                    </div>
                                    <button
                                        onClick={fetchBalance}
                                        disabled={loadingBalance}
                                        className="px-4 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/10 disabled:opacity-50"
                                    >
                                        🔄
                                    </button>
                                </div>
                            </div>
                        </div>

                        {solBalance === 0 && (
                            <InfoBox type="warning" title="No SOL Balance">
                                You need some devnet SOL to make transfers. Get free devnet SOL from the{" "}
                                <a
                                    href="https://faucet.solana.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-rose-400 underline hover:text-rose-300"
                                >
                                    Solana Faucet
                                </a>
                            </InfoBox>
                        )}
                    </Section>

                    {/* Transfer Form */}
                    <Section
                        title="Send SOL"
                        description="Enter recipient address and amount to transfer"
                    >
                        <div className="space-y-4">
                            {/* Recipient Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Recipient Address
                                    </label>
                                    <button
                                        onClick={handleTestRecipient}
                                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                    >
                                        Use test address
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Solana wallet address..."
                                    value={recipient}
                                    onChange={(e) => {
                                        setRecipient(e.target.value);
                                        setError(null);
                                    }}
                                    className="
                    w-full px-4 py-3 rounded-xl
                    bg-black/40 text-white
                    placeholder-zinc-600
                    ring-1 ring-white/10
                    focus:outline-none focus:ring-rose-500/50
                    font-mono text-sm
                  "
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Amount (SOL)
                                    </label>
                                    <button
                                        onClick={handleSetMax}
                                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setError(null);
                                    }}
                                    step="0.0001"
                                    min="0"
                                    className="
                    w-full px-4 py-3 rounded-xl
                    bg-black/40 text-white text-lg font-semibold
                    placeholder-zinc-600
                    ring-1 ring-white/10
                    focus:outline-none focus:ring-rose-500/50
                  "
                                />
                            </div>

                            {/* Gasless Badge */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                                <span>⛽</span>
                                <span className="text-sm text-emerald-400">
                                    Gas fees sponsored by Lazorkit Paymaster
                                </span>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="px-4 py-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleTransfer}
                                disabled={isTransferring || !recipient || !amount}
                                className="
                  w-full flex items-center justify-center gap-2
                  px-6 py-4 rounded-xl
                  bg-gradient-to-r from-rose-500 to-orange-500
                  text-white font-semibold
                  shadow-lg shadow-rose-500/25
                  ring-1 ring-white/10
                  transition-all duration-200
                  hover:shadow-rose-500/40 hover:scale-[1.01]
                  active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
                            >
                                {isTransferring ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>💸</span>
                                        <span>Send SOL (Gasless)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </Section>

                    {/* Success Display */}
                    {txSignature && (
                        <Section title="Transaction Successful! 🎉">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                                    <span className="text-2xl">✅</span>
                                    <span className="text-emerald-400 font-medium">
                                        Your SOL has been sent successfully!
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Transaction Signature
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5 overflow-hidden">
                                            <code className="text-sm text-zinc-300 break-all">
                                                {txSignature}
                                            </code>
                                        </div>
                                        <a
                                            href={getTransactionUrl(txSignature)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 px-4 py-3 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors ring-1 ring-rose-500/30"
                                        >
                                            View ↗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    )}
                </>
            )}

            {/* Code Example */}
            <Section
                title="How It Works"
                description="The code behind gasless transfers"
            >
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400">
                        Build a transfer instruction and use <code className="text-rose-400">signAndSendTransaction</code>
                        with the paymaster to send it gaslessly:
                    </p>

                    <CodeBlock
                        language="typescript"
                        code={`import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function TransferComponent() {
  const { wallet, signAndSendTransaction } = useWallet();

  const handleTransfer = async (recipient: string, amount: number) => {
    // 1. Build the transfer instruction
    const instruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.smartWallet),
      toPubkey: new PublicKey(recipient),
      lamports: amount * LAMPORTS_PER_SOL,
    });

    // 2. Sign and send with gasless option
    const signature = await signAndSendTransaction({
      instructions: [instruction],
      transactionOptions: {
        feeToken: "SOL",  // Paymaster sponsors the fee!
      },
    });

    console.log("Transaction sent:", signature);
  };
}`}
                    />
                </div>
            </Section>

            {/* Understanding Section */}
            <Section title="Understanding Gasless Transactions">
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoBox type="info" title="How Paymaster Works">
                            The paymaster is a service that pays transaction fees on behalf of users.
                            When you set <code>feeToken: "SOL"</code>, Lazorkit routes the transaction
                            through the paymaster which covers the ~0.000005 SOL fee.
                        </InfoBox>

                        <InfoBox type="tip" title="When to Use Gasless">
                            Gasless transactions are great for onboarding new users who don't have
                            SOL yet, or for apps that want to provide a web2-like experience where
                            users don't think about gas.
                        </InfoBox>
                    </div>

                    <InfoBox type="warning" title="Devnet Note">
                        On devnet, the paymaster has generous limits. In production, there may
                        be rate limits or requirements to fund the paymaster service.
                    </InfoBox>
                </div>
            </Section>

            {/* What's Next */}
            <Section title="What's Next?">
                <p className="text-zinc-400">
                    Now that you can make gasless transfers, let's do something more exciting!
                    In the final example, we'll use our smart wallet to <strong className="text-white">create and mint NFTs</strong> using
                    the Metaplex protocol.
                </p>
            </Section>
        </PageLayout>
    );
}

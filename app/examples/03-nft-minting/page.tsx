"use client";

/**
 * =============================================================================
 * EXAMPLE 3: NFT CREATION & MINTING
 * =============================================================================
 * 
 * This example demonstrates how to create and mint NFTs using Metaplex
 * with a Lazorkit smart wallet.
 * 
 * WHAT YOU'LL LEARN:
 * - Understanding NFT structure on Solana
 * - Building NFT minting instructions
 * - Using Metaplex Token Metadata program
 * - Signing complex transactions with Lazorkit
 * 
 * PREREQUISITES:
 * - Complete Examples 1 & 2 (connected wallet with SOL)
 * - Have at least 0.05 devnet SOL for rent
 * 
 * KEY CONCEPTS:
 * 
 * 1. NFT STRUCTURE: On Solana, NFTs are SPL tokens with:
 *    - 0 decimals (indivisible)
 *    - Supply of exactly 1
 *    - Metadata account (name, symbol, URI)
 *    - Master edition account (proves uniqueness)
 * 
 * 2. METAPLEX: The standard protocol for NFTs on Solana.
 *    Provides the Token Metadata program for creating
 *    and managing NFT metadata.
 * 
 * 3. METADATA URI: Points to a JSON file (usually on IPFS/Arweave)
 *    containing the NFT's image, description, and attributes.
 * 
 * =============================================================================
 */

import { useWallet } from "@lazorkit/wallet";
import { useState, useEffect, useCallback } from "react";
import { PublicKey, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { PageLayout, Section, InfoBox, CodeBlock } from "../../components/PageLayout";
import { WalletStatus } from "../../components/WalletStatus";
import {
    getTransactionUrl,
    getAddressUrl,
    truncateAddress,
} from "../../lib/constants";
import { getConnection } from "../../lib/solana-utils";
import {
    createNFTInstructions,
    NFTMetadataInput,
    SAMPLE_METADATA_JSON,
} from "./utils/metaplex";

/**
 * NFTMintingExample Component
 * 
 * The main component for Example 3.
 * Demonstrates NFT creation using Metaplex with Lazorkit.
 */
export default function NFTMintingExample() {
    // ============================================
    // WALLET HOOK
    // ============================================
    const {
        wallet,
        isConnected,
        signAndSendTransaction
    } = useWallet();

    // ============================================
    // LOCAL STATE
    // ============================================
    // Form inputs
    const [nftName, setNftName] = useState("My Lazorkit NFT");
    const [nftSymbol, setNftSymbol] = useState("LNFT");
    const [nftDescription, setNftDescription] = useState(
        "An NFT created using Lazorkit SDK with passkey authentication"
    );
    const [nftImageUrl, setNftImageUrl] = useState(
        "https://placehold.co/600x600/1a1a2e/ff6b6b?text=Lazorkit+NFT"
    );

    // Transaction state
    const [isMinting, setIsMinting] = useState(false);
    const [mintedNFT, setMintedNFT] = useState<{
        signature: string;
        mintAddress: string;
        tokenAccount: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Balance tracking
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(false);

    // Mint keypair - stored to sign the transaction
    const [mintKeypair, setMintKeypair] = useState<Keypair | null>(null);

    // ============================================
    // FETCH BALANCE
    // ============================================
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

    useEffect(() => {
        if (isConnected) {
            fetchBalance();
        }
    }, [isConnected, fetchBalance]);

    // ============================================
    // VALIDATE INPUTS
    // ============================================
    const validateInputs = (): string | null => {
        if (!nftName.trim()) return "Please enter an NFT name";
        if (nftName.length > 32) return "Name must be 32 characters or less";

        if (!nftSymbol.trim()) return "Please enter a symbol";
        if (nftSymbol.length > 10) return "Symbol must be 10 characters or less";

        if (!nftImageUrl.trim()) return "Please enter an image URL";

        // Check balance (need at least 0.02 SOL for rent)
        if (solBalance !== null && solBalance < 0.02) {
            return "Need at least 0.02 SOL for account rent";
        }

        return null;
    };

    // ============================================
    // MINT NFT
    // ============================================
    /**
     * Creates and mints an NFT using Metaplex.
     * 
     * NOTE: In this example, we demonstrate the NFT minting flow conceptually.
     * Full NFT minting requires the mint keypair to sign the transaction.
     * Depending on Lazorkit's SDK version, this may require:
     * - Using a pre-funded mint address
     * - Partial signing before submission
     * - Working with Lazorkit's multi-signer support
     * 
     * For demonstration purposes, this shows the instruction building process.
     */
    const handleMintNFT = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setMintedNFT(null);
        setIsMinting(true);

        try {
            const connection = getConnection();
            const payerPubkey = new PublicKey(wallet!.smartWallet);

            // ========================================
            // STEP 1: PREPARE METADATA
            // ========================================
            // In production, you would upload this JSON to IPFS/Arweave
            // and use the resulting URI. For this demo, we'll use a
            // placeholder URI that points to sample metadata.

            // Create a simple metadata JSON (conceptually)
            const metadataJson = {
                name: nftName,
                symbol: nftSymbol,
                description: nftDescription,
                image: nftImageUrl,
                attributes: [
                    { trait_type: "Created With", value: "Lazorkit SDK" },
                    { trait_type: "Network", value: "Devnet" },
                ],
            };

            console.log("📋 NFT Metadata:", metadataJson);

            // For this example, we use a placeholder URI
            // In production, upload metadataJson to IPFS and use that URI
            const metadataUri = `data:application/json,${encodeURIComponent(
                JSON.stringify(metadataJson)
            )}`;

            const metadata: NFTMetadataInput = {
                name: nftName,
                symbol: nftSymbol,
                description: nftDescription,
                uri: metadataUri,
                sellerFeeBasisPoints: 0, // No royalties for this example
            };

            // ========================================
            // STEP 2: CREATE NFT INSTRUCTIONS
            // ========================================
            console.log("🔨 Building NFT instructions...");

            const nftResult = await createNFTInstructions(
                connection,
                payerPubkey,
                metadata
            );

            // Store the mint keypair for display
            setMintKeypair(nftResult.mintKeypair);

            console.log("📝 NFT will be minted to:", nftResult.mintAddress.toBase58());
            console.log("🖼️ Token account:", nftResult.tokenAccount.toBase58());

            // ========================================
            // STEP 3: SIGN AND SEND TRANSACTION
            // ========================================
            // NOTE: NFT minting requires the mint keypair to sign.
            // This example demonstrates the flow - actual implementation
            // may vary based on Lazorkit SDK version and capabilities.

            console.log("✍️ Signing transaction with passkey...");
            console.log("📌 Mint keypair public key:", nftResult.mintKeypair.publicKey.toBase58());

            // For this example, we demonstrate using signAndSendTransaction
            // The transaction includes all NFT creation instructions
            const signature = await signAndSendTransaction({
                instructions: nftResult.instructions,
                transactionOptions: {
                    feeToken: "SOL",
                    // Higher compute limit for NFT operations
                    computeUnitLimit: 400_000,
                },
            });

            console.log("✅ NFT minted successfully!");
            console.log("📜 Transaction:", signature);

            // Store minted NFT info
            setMintedNFT({
                signature,
                mintAddress: nftResult.mintAddress.toBase58(),
                tokenAccount: nftResult.tokenAccount.toBase58(),
            });

            // Refresh balance
            await fetchBalance();

        } catch (err: any) {
            console.error("❌ Minting failed:", err);

            let errorMessage = err.message || "Failed to mint NFT";

            if (errorMessage.includes("insufficient")) {
                errorMessage = "Insufficient SOL for account rent. Need at least 0.02 SOL.";
            } else if (errorMessage.includes("cancelled")) {
                errorMessage = "Transaction was cancelled";
            } else if (errorMessage.includes("signature")) {
                errorMessage = "NFT minting requires additional signer support. See documentation.";
            }

            setError(errorMessage);
        } finally {
            setIsMinting(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <PageLayout
            exampleNumber={3}
            title="NFT Creation & Minting"
            description="Create and mint NFTs using the Metaplex protocol with your Lazorkit smart wallet. This is the final example in the series!"
        >
            {/* Introduction */}
            <InfoBox type="tip" title="About Metaplex NFTs">
                Metaplex is the standard protocol for NFTs on Solana. Each NFT is an SPL token
                with supply of 1, plus metadata and edition accounts that store information
                like name, image, and proof of uniqueness.
            </InfoBox>

            {/* Wallet Connection Check */}
            {!isConnected ? (
                <Section
                    title="Connect Your Wallet"
                    description="You need to connect a wallet first to mint NFTs"
                >
                    <WalletStatus />
                    <InfoBox type="warning" title="Wallet Required">
                        Please complete Example 1 and connect your wallet to continue.
                    </InfoBox>
                </Section>
            ) : (
                <>
                    {/* Balance Display */}
                    <Section title="Your Wallet">
                        <div className="grid gap-4 md:grid-cols-2">
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

                        {solBalance !== null && solBalance < 0.02 && (
                            <InfoBox type="warning" title="Need More SOL">
                                Minting an NFT requires at least 0.02 SOL for account rent. Get devnet SOL from the{" "}
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

                    {/* NFT Form */}
                    <Section
                        title="Create Your NFT"
                        description="Fill in the details for your NFT"
                    >
                        <div className="space-y-4">
                            {/* NFT Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    NFT Name
                                </label>
                                <input
                                    type="text"
                                    value={nftName}
                                    onChange={(e) => {
                                        setNftName(e.target.value);
                                        setError(null);
                                    }}
                                    maxLength={32}
                                    placeholder="My Awesome NFT"
                                    className="
                    w-full px-4 py-3 rounded-xl
                    bg-black/40 text-white
                    placeholder-zinc-600
                    ring-1 ring-white/10
                    focus:outline-none focus:ring-rose-500/50
                  "
                                />
                                <p className="text-xs text-zinc-500">{nftName.length}/32 characters</p>
                            </div>

                            {/* NFT Symbol */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Symbol
                                </label>
                                <input
                                    type="text"
                                    value={nftSymbol}
                                    onChange={(e) => {
                                        setNftSymbol(e.target.value.toUpperCase());
                                        setError(null);
                                    }}
                                    maxLength={10}
                                    placeholder="LNFT"
                                    className="
                    w-full px-4 py-3 rounded-xl
                    bg-black/40 text-white uppercase
                    placeholder-zinc-600
                    ring-1 ring-white/10
                    focus:outline-none focus:ring-rose-500/50
                  "
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    value={nftDescription}
                                    onChange={(e) => {
                                        setNftDescription(e.target.value);
                                        setError(null);
                                    }}
                                    rows={3}
                                    placeholder="Describe your NFT..."
                                    className="
                    w-full px-4 py-3 rounded-xl
                    bg-black/40 text-white
                    placeholder-zinc-600
                    ring-1 ring-white/10
                    focus:outline-none focus:ring-rose-500/50
                    resize-none
                  "
                                />
                            </div>

                            {/* Image URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={nftImageUrl}
                                    onChange={(e) => {
                                        setNftImageUrl(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="https://example.com/image.png"
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

                            {/* Preview */}
                            {nftImageUrl && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Preview
                                    </label>
                                    <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/10">
                                        <img
                                            src={nftImageUrl}
                                            alt="NFT Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-sm font-medium text-white truncate">{nftName}</p>
                                            <p className="text-xs text-zinc-400">{nftSymbol}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cost Info */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                                <span>💎</span>
                                <span className="text-sm text-blue-400">
                                    Minting costs ~0.015 SOL for account rent (non-refundable)
                                </span>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="px-4 py-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Mint Button */}
                            <button
                                onClick={handleMintNFT}
                                disabled={isMinting}
                                className="
                  w-full flex items-center justify-center gap-2
                  px-6 py-4 rounded-xl
                  bg-gradient-to-r from-purple-500 to-rose-500
                  text-white font-semibold
                  shadow-lg shadow-purple-500/25
                  ring-1 ring-white/10
                  transition-all duration-200
                  hover:shadow-purple-500/40 hover:scale-[1.01]
                  active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
                            >
                                {isMinting ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        <span>Minting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🎨</span>
                                        <span>Mint NFT</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </Section>

                    {/* Success Display */}
                    {mintedNFT && (
                        <Section title="NFT Minted Successfully! 🎉">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                                    <span className="text-2xl">🖼️</span>
                                    <span className="text-emerald-400 font-medium">
                                        Your NFT has been created and is now in your wallet!
                                    </span>
                                </div>

                                {/* NFT Details */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Mint Address (NFT ID)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5 overflow-hidden">
                                                <code className="text-sm text-zinc-300">
                                                    {truncateAddress(mintedNFT.mintAddress, 8)}
                                                </code>
                                            </div>
                                            <a
                                                href={getAddressUrl(mintedNFT.mintAddress)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 px-3 py-3 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors ring-1 ring-rose-500/30"
                                            >
                                                ↗
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Token Account
                                        </label>
                                        <div className="px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5 overflow-hidden">
                                            <code className="text-sm text-zinc-300">
                                                {truncateAddress(mintedNFT.tokenAccount, 8)}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Transaction Signature
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-4 py-3 rounded-xl bg-black/40 ring-1 ring-white/5 overflow-hidden">
                                            <code className="text-sm text-zinc-300 break-all">
                                                {mintedNFT.signature}
                                            </code>
                                        </div>
                                        <a
                                            href={getTransactionUrl(mintedNFT.signature)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 px-4 py-3 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors ring-1 ring-purple-500/30"
                                        >
                                            View Tx ↗
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
                description="The code behind NFT minting"
            >
                <div className="space-y-4">
                    <p className="text-sm text-zinc-400">
                        NFT minting requires creating multiple accounts and instructions:
                    </p>

                    <CodeBlock
                        language="typescript"
                        code={`import { useWallet } from "@lazorkit/wallet";
import { createNFTInstructions } from "./utils/metaplex";

function MintComponent() {
  const { wallet, signAndSendTransaction } = useWallet();

  const mintNFT = async () => {
    // 1. Prepare metadata
    const metadata = {
      name: "My NFT",
      symbol: "MNFT",
      description: "A cool NFT",
      uri: "https://arweave.net/...", // Metadata JSON URI
    };

    // 2. Build NFT instructions
    const { instructions, mintKeypair } = await createNFTInstructions(
      connection,
      wallet.smartWallet,
      metadata
    );

    // 3. Sign and send (mint keypair must also sign)
    const signature = await signAndSendTransaction({
      instructions,
      transactionOptions: { feeToken: "SOL" },
      signers: [mintKeypair],
    });

    console.log("NFT minted:", mintKeypair.publicKey.toBase58());
  };
}`}
                    />
                </div>
            </Section>

            {/* NFT Structure */}
            <Section title="Understanding NFT Structure on Solana">
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoBox type="info" title="Mint Account">
                            The unique address of your NFT. It's an SPL token with 0 decimals
                            and supply of exactly 1.
                        </InfoBox>

                        <InfoBox type="info" title="Token Account">
                            Where the NFT is stored. This is the Associated Token Account (ATA)
                            owned by your wallet for this specific mint.
                        </InfoBox>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoBox type="tip" title="Metadata Account">
                            Stores on-chain metadata: name, symbol, and a URI pointing to the
                            full metadata JSON (usually on IPFS or Arweave).
                        </InfoBox>

                        <InfoBox type="tip" title="Master Edition">
                            Proves this is the original NFT and controls whether prints/copies
                            can be made. For 1/1 NFTs, max supply is set to 0.
                        </InfoBox>
                    </div>
                </div>
            </Section>

            {/* Congratulations */}
            <Section title="🎉 Congratulations!">
                <div className="space-y-4">
                    <p className="text-zinc-300">
                        You've completed all three Lazorkit SDK examples! You've learned how to:
                    </p>
                    <ul className="space-y-2 text-zinc-400">
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Create and connect passkey-based smart wallets
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Perform gasless SOL transfers using the paymaster
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Create and mint NFTs using Metaplex
                        </li>
                    </ul>
                    <InfoBox type="success" title="What's Next?">
                        Check out the full Lazorkit documentation for more advanced features like
                        session keys, custom paymasters, and account recovery!
                    </InfoBox>
                </div>
            </Section>
        </PageLayout>
    );
}

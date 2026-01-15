/**
 * =============================================================================
 * EXAMPLE 3: SEND SOL
 * =============================================================================
 * 
 * This example demonstrates how to send SOL using the Lazorkit SDK
 * with gasless transactions via the paymaster.
 * 
 * WHAT YOU'LL LEARN:
 * - Building Solana transaction instructions
 * - Using signAndSendTransaction from Lazorkit SDK
 * - Providing redirectUrl for transaction signing
 * - How the paymaster sponsors transaction fees
 * - Handling transaction confirmations
 * 
 * PREREQUISITES:
 * - Complete Examples 1 & 2 (connected wallet with SOL balance)
 * =============================================================================
 */

import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
    Linking,
    ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Official Lazorkit SDK hook
import { useWallet } from "@lazorkit/wallet-mobile-adapter";

// Local utilities
import { getSolBalance, isValidPublicKey, formatTransactionError } from "@/lib/solana";
import {
    Colors,
    truncateAddress,
    getTransactionUrl,
    REDIRECT_URLS
} from "@/lib/constants";

// =============================================================================
// SEND SCREEN COMPONENT
// =============================================================================

export default function SendScreen() {
    // ==========================================
    // WALLET HOOK (Official SDK)
    // ==========================================
    /**
     * The signAndSendTransaction function from the SDK:
     * - Builds the transaction
     * - Opens portal for passkey signing
     * - Submits to network via paymaster
     * - Returns transaction signature
     */
    const { smartWalletPubkey, isConnected, signAndSendTransaction } = useWallet();

    // Get wallet address as string for display
    const walletAddress = smartWalletPubkey?.toBase58() || null;

    // ==========================================
    // LOCAL STATE
    // ==========================================
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    // ==========================================
    // FETCH BALANCE
    // ==========================================
    const fetchBalance = useCallback(async () => {
        if (!walletAddress) return;
        setIsLoadingBalance(true);
        try {
            const solBalance = await getSolBalance(walletAddress);
            setBalance(solBalance);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (isConnected && walletAddress) {
            fetchBalance();
        }
    }, [isConnected, walletAddress, fetchBalance]);

    // ==========================================
    // VALIDATE INPUTS
    // ==========================================
    const validateInputs = (): string | null => {
        if (!recipient.trim()) {
            return "Please enter a recipient address";
        }
        if (!isValidPublicKey(recipient)) {
            return "Invalid Solana address format";
        }
        if (recipient === walletAddress) {
            return "Cannot send to yourself";
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return "Please enter a valid amount";
        }
        if (balance !== null && amountNum > balance) {
            return `Insufficient balance. You have ${balance.toFixed(4)} SOL`;
        }

        return null;
    };

    // ==========================================
    // HANDLE SEND
    // ==========================================
    /**
     * Executes the SOL transfer using the official Lazorkit SDK.
     * 
     * The signAndSendTransaction function:
     * 1. Takes an array of instructions
     * 2. Opens Lazorkit portal for passkey signing
     * 3. Uses paymaster to sponsor gas fees
     * 4. Submits transaction to network
     * 5. Redirects back to app via redirectUrl
     */
    const handleSend = async () => {
        Keyboard.dismiss();

        const validationError = validateInputs();
        if (validationError) {
            Alert.alert("Validation Error", validationError);
            return;
        }

        if (!walletAddress || !smartWalletPubkey) {
            Alert.alert("Error", "Wallet not connected");
            return;
        }

        setIsSending(true);
        setTxSignature(null);

        try {
            // ========================================
            // STEP 1: BUILD TRANSFER INSTRUCTION
            // ========================================
            const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey(recipient),
                lamports,
            });

            console.log("📝 Transfer instruction:", {
                from: walletAddress,
                to: recipient,
                amount: `${amount} SOL (${lamports} lamports)`,
            });

            // ========================================
            // STEP 2: SIGN AND SEND WITH PAYMASTER
            // ========================================
            /**
             * signAndSendTransaction takes two arguments:
             * 1. Transaction config:
             *    - instructions: Array of transaction instructions
             *    - transactionOptions: Optional config like feeToken
             * 2. Options with redirectUrl for deep linking back
             */
            const signature = await signAndSendTransaction(
                {
                    instructions: [instruction],
                    transactionOptions: {
                        feeToken: "SOL",
                        clusterSimulation: "devnet", // Required field per SDK types
                    },
                },
                {
                    redirectUrl: REDIRECT_URLS.transaction,
                }
            );

            console.log("✅ Transaction successful:", signature);
            setTxSignature(signature);

            // Clear form
            setRecipient("");
            setAmount("");

            // Refresh balance
            await fetchBalance();

            Alert.alert("Success! 🎉", "Your SOL has been sent successfully!");
        } catch (error: any) {
            console.error("❌ Transfer failed:", error);
            Alert.alert("Transfer Failed", formatTransactionError(error));
        } finally {
            setIsSending(false);
        }
    };

    // ==========================================
    // HELPERS
    // ==========================================
    const handleSetMax = () => {
        if (balance !== null) {
            const maxAmount = Math.max(0, balance - 0.001);
            setAmount(maxAmount.toFixed(4));
        }
    };

    const handleUseTestAddress = () => {
        setRecipient("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
        setAmount("0.001");
    };

    const openTransaction = () => {
        if (txSignature) {
            Linking.openURL(getTransactionUrl(txSignature));
        }
    };

    // ==========================================
    // RENDER - NOT CONNECTED STATE
    // ==========================================
    if (!isConnected) {
        return (
            <View style={styles.container}>
                <View style={styles.notConnectedContainer}>
                    <View style={styles.iconCircle}>
                        <FontAwesome name="exclamation-circle" size={40} color={Colors.warning} />
                    </View>
                    <Text style={styles.notConnectedTitle}>Wallet Not Connected</Text>
                    <Text style={styles.notConnectedText}>
                        Please connect your wallet in the Connect tab first to send SOL.
                    </Text>
                </View>
            </View>
        );
    }

    // ==========================================
    // RENDER - CONNECTED STATE
    // ==========================================
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            {/* Gasless Badge */}
            <View style={styles.gaslessBadge}>
                <FontAwesome name="bolt" size={16} color={Colors.success} />
                <Text style={styles.gaslessBadgeText}>
                    Gas fees sponsored by Lazorkit Paymaster
                </Text>
            </View>

            {/* Balance Display */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>
                        {balance !== null ? balance.toFixed(4) : "—"}
                    </Text>
                    <Text style={styles.balanceCurrency}>SOL</Text>
                    <TouchableOpacity
                        style={styles.refreshIconButton}
                        onPress={fetchBalance}
                        disabled={isLoadingBalance}
                    >
                        <FontAwesome
                            name="refresh"
                            size={14}
                            color={isLoadingBalance ? Colors.textMuted : Colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Transfer Form */}
            <View style={styles.formCard}>
                {/* Recipient Input */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputLabelRow}>
                        <Text style={styles.inputLabel}>Recipient Address</Text>
                        <TouchableOpacity onPress={handleUseTestAddress}>
                            <Text style={styles.inputAction}>Use test address</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter Solana address..."
                        placeholderTextColor={Colors.textMuted}
                        value={recipient}
                        onChangeText={setRecipient}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Amount Input */}
                <View style={styles.inputGroup}>
                    <View style={styles.inputLabelRow}>
                        <Text style={styles.inputLabel}>Amount (SOL)</Text>
                        <TouchableOpacity onPress={handleSetMax}>
                            <Text style={styles.inputAction}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder="0.00"
                        placeholderTextColor={Colors.textMuted}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Send Button */}
                <TouchableOpacity
                    style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={isSending || !recipient || !amount}
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color={Colors.text} />
                    ) : (
                        <>
                            <FontAwesome name="send" size={18} color={Colors.text} />
                            <Text style={styles.sendButtonText}>Send SOL</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Transaction Success */}
            {txSignature && (
                <View style={styles.successCard}>
                    <FontAwesome name="check-circle" size={24} color={Colors.success} />
                    <View style={styles.successContent}>
                        <Text style={styles.successTitle}>Transaction Sent!</Text>
                        <Text style={styles.successSignature}>
                            {truncateAddress(txSignature, 8)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton} onPress={openTransaction}>
                        <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Code Example */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Code Example</Text>
                <View style={styles.codeCard}>
                    <Text style={styles.codeComment}>// Create transfer instruction</Text>
                    <Text style={styles.codeLine}>{"const ix = SystemProgram.transfer({ ... });"}</Text>
                    <Text style={styles.codeLine}>{""}</Text>
                    <Text style={styles.codeComment}>// Sign and send with redirect</Text>
                    <Text style={styles.codeLine}>{"const sig = await signAndSendTransaction("}</Text>
                    <Text style={styles.codeLine}>{"  { instructions: [ix] },"}</Text>
                    <Text style={styles.codeLine}>{"  { redirectUrl: 'myapp://callback' }"}</Text>
                    <Text style={styles.codeLine}>{")"}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },

    // Not Connected
    notConnectedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${Colors.warning}15`,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    notConnectedTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 8,
    },
    notConnectedText: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },

    // Gasless Badge
    gaslessBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `${Colors.success}15`,
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: `${Colors.success}30`,
    },
    gaslessBadgeText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.success,
        marginLeft: 8,
    },

    // Balance Card
    balanceCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    balanceLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.textMuted,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    balanceValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.text,
    },
    balanceCurrency: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.textSecondary,
        marginLeft: 6,
    },
    refreshIconButton: {
        marginLeft: "auto",
        padding: 8,
    },

    // Form Card
    formCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.textSecondary,
        textTransform: "uppercase",
    },
    inputAction: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.primary,
    },
    textInput: {
        backgroundColor: Colors.background,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sendButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 8,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
        marginLeft: 10,
    },

    // Success Card
    successCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${Colors.success}10`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: `${Colors.success}30`,
    },
    successContent: {
        flex: 1,
        marginLeft: 12,
    },
    successTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.success,
    },
    successSignature: {
        fontSize: 13,
        fontFamily: "SpaceMono",
        color: Colors.textSecondary,
        marginTop: 2,
    },
    viewButton: {
        backgroundColor: Colors.success,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    viewButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.text,
    },

    // Section
    section: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 12,
    },

    // Code Card
    codeCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    codeComment: {
        fontSize: 11,
        fontFamily: "SpaceMono",
        color: Colors.textMuted,
        marginBottom: 4,
    },
    codeLine: {
        fontSize: 11,
        fontFamily: "SpaceMono",
        color: Colors.textSecondary,
        marginBottom: 2,
    },
});

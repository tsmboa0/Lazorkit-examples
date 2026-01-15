/**
 * =============================================================================
 * EXAMPLE 2: CHECK BALANCE
 * =============================================================================
 * 
 * This example demonstrates how to fetch and display the SOL balance
 * of a connected wallet using the Lazorkit SDK.
 * 
 * WHAT YOU'LL LEARN:
 * - Accessing wallet address from useWallet hook
 * - Fetching on-chain data with @solana/web3.js
 * - Displaying balance with formatting
 * - Implementing pull-to-refresh
 * 
 * PREREQUISITES:
 * - Complete Example 1 (connect wallet)
 * - Have some devnet SOL (get from faucet)
 * =============================================================================
 */

import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    Linking,
    Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// Official Lazorkit SDK hook
import { useWallet } from "@lazorkit/wallet-mobile-adapter";

// Local utilities
import { getSolBalance } from "@/lib/solana";
import { Colors, truncateAddress, getAddressUrl, NETWORK } from "@/lib/constants";

// =============================================================================
// BALANCE SCREEN COMPONENT
// =============================================================================

export default function BalanceScreen() {
    // ==========================================
    // WALLET HOOK (Official SDK)
    // ==========================================
    /**
     * Access the connected wallet from useWallet hook.
     * - smartWalletPubkey: The user's smart wallet PublicKey
     * - isConnected: Whether a wallet is connected
     */
    const { smartWalletPubkey, isConnected } = useWallet();

    // Get wallet address as string for display
    const walletAddress = smartWalletPubkey?.toBase58() || null;

    // ==========================================
    // LOCAL STATE
    // ==========================================
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // ==========================================
    // FETCH BALANCE
    // ==========================================
    /**
     * Fetches the current SOL balance from the Solana network.
     */
    const fetchBalance = useCallback(async () => {
        if (!walletAddress) return;

        setIsLoading(true);
        try {
            const solBalance = await getSolBalance(walletAddress);
            setBalance(solBalance);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            Alert.alert("Error", "Failed to fetch balance. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress]);

    // ==========================================
    // AUTO-FETCH ON CONNECT
    // ==========================================
    useEffect(() => {
        if (isConnected && walletAddress) {
            fetchBalance();
        }
    }, [isConnected, walletAddress, fetchBalance]);

    // ==========================================
    // HELPERS
    // ==========================================
    const openFaucet = () => {
        Linking.openURL("https://faucet.solana.com");
    };

    const openExplorer = () => {
        if (walletAddress) {
            Linking.openURL(getAddressUrl(walletAddress));
        }
    };

    const formatLastUpdated = (): string => {
        if (!lastUpdated) return "";
        return lastUpdated.toLocaleTimeString();
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
                        Please connect your wallet in the Connect tab first to view your balance.
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
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchBalance}
                    tintColor={Colors.primary}
                    colors={[Colors.primary]}
                />
            }
        >
            {/* Info Box */}
            <View style={styles.infoBox}>
                <FontAwesome name="info-circle" size={20} color={Colors.info} />
                <Text style={styles.infoText}>
                    Pull down to refresh your balance. SOL is the native token of Solana,
                    used for transactions and fees.
                </Text>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                    <Text style={styles.balanceLabel}>SOL Balance</Text>
                    <View style={styles.networkTag}>
                        <Text style={styles.networkTagText}>{NETWORK}</Text>
                    </View>
                </View>

                <View style={styles.balanceValueContainer}>
                    {balance !== null ? (
                        <>
                            <Text style={styles.balanceValue}>
                                {balance.toFixed(4)}
                            </Text>
                            <Text style={styles.balanceCurrency}>SOL</Text>
                        </>
                    ) : (
                        <Text style={styles.balanceLoading}>Loading...</Text>
                    )}
                </View>

                {lastUpdated && (
                    <Text style={styles.lastUpdated}>
                        Last updated: {formatLastUpdated()}
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchBalance}
                    disabled={isLoading}
                >
                    <FontAwesome
                        name="refresh"
                        size={16}
                        color={Colors.text}
                        style={isLoading ? { opacity: 0.5 } : undefined}
                    />
                    <Text style={styles.refreshButtonText}>
                        {isLoading ? "Refreshing..." : "Refresh Balance"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Wallet Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Wallet Info</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoRowLabel}>Address</Text>
                    <TouchableOpacity onPress={openExplorer}>
                        <Text style={styles.infoRowValue}>
                            {truncateAddress(walletAddress || "", 6)}
                            {" "}
                            <FontAwesome name="external-link" size={12} color={Colors.primary} />
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoRowLabel}>Network</Text>
                    <Text style={styles.infoRowValue}>{NETWORK}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoRowLabel}>In Lamports</Text>
                    <Text style={styles.infoRowValue}>
                        {balance !== null
                            ? Math.floor(balance * LAMPORTS_PER_SOL).toLocaleString()
                            : "—"}
                    </Text>
                </View>
            </View>

            {/* Get Devnet SOL */}
            {balance !== null && balance < 0.01 && (
                <View style={styles.faucetCard}>
                    <FontAwesome name="tint" size={24} color={Colors.info} />
                    <View style={styles.faucetContent}>
                        <Text style={styles.faucetTitle}>Need Devnet SOL?</Text>
                        <Text style={styles.faucetDescription}>
                            Get free SOL from the Solana Faucet to test transactions.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.faucetButton} onPress={openFaucet}>
                        <Text style={styles.faucetButtonText}>Get SOL</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Code Example */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Works</Text>
                <View style={styles.codeCard}>
                    <Text style={styles.codeComment}>// Access wallet from hook</Text>
                    <Text style={styles.codeLine}>{"const { wallet } = useWallet();"}</Text>
                    <Text style={styles.codeLine}>{""}</Text>
                    <Text style={styles.codeComment}>// Fetch balance from network</Text>
                    <Text style={styles.codeLine}>{"const balance = await connection.getBalance("}</Text>
                    <Text style={styles.codeLine}>{"  new PublicKey(wallet.smartWallet)"}</Text>
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

    // Info Box
    infoBox: {
        flexDirection: "row",
        backgroundColor: `${Colors.info}15`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: `${Colors.info}30`,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: 12,
        lineHeight: 20,
    },

    // Balance Card
    balanceCard: {
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: "center",
    },
    balanceHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    balanceLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.textSecondary,
        textTransform: "uppercase",
    },
    networkTag: {
        backgroundColor: `${Colors.success}20`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginLeft: 10,
    },
    networkTagText: {
        fontSize: 10,
        fontWeight: "700",
        color: Colors.success,
        textTransform: "uppercase",
    },
    balanceValueContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 48,
        fontWeight: "bold",
        color: Colors.text,
    },
    balanceCurrency: {
        fontSize: 20,
        fontWeight: "600",
        color: Colors.textSecondary,
        marginLeft: 8,
    },
    balanceLoading: {
        fontSize: 24,
        color: Colors.textMuted,
    },
    lastUpdated: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 16,
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    refreshButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
        marginLeft: 8,
    },

    // Section
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 12,
    },

    // Info Rows
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.card,
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoRowLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    infoRowValue: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
    },

    // Faucet Card
    faucetCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${Colors.info}10`,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: `${Colors.info}30`,
    },
    faucetContent: {
        flex: 1,
        marginLeft: 14,
    },
    faucetTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
    },
    faucetDescription: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    faucetButton: {
        backgroundColor: Colors.info,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    faucetButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.text,
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

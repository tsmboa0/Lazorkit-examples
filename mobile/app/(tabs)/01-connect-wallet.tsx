/**
 * =============================================================================
 * EXAMPLE 1: CONNECT WALLET
 * =============================================================================
 * 
 * This example demonstrates how to connect a passkey-based wallet
 * using the official Lazorkit SDK on mobile.
 * 
 * WHAT YOU'LL LEARN:
 * - Using the useWallet hook from @lazorkit/wallet-mobile-adapter
 * - Connecting with passkey authentication
 * - Using redirectUrl for deep linking back to the app
 * - Displaying wallet information
 * - Disconnecting the wallet
 * 
 * PASSKEY AUTHENTICATION FLOW:
 * 1. User taps "Connect with Passkey"
 * 2. App opens the Lazorkit portal in browser
 * 3. User authenticates with biometrics
 * 4. Portal redirects back to app via custom URL scheme
 * 5. Wallet is connected and ready to use
 * =============================================================================
 */

import React, { useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Linking,
    ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Official Lazorkit SDK hook
import { useWallet } from "@lazorkit/wallet-mobile-adapter";

// Local utilities
import {
    Colors,
    truncateAddress,
    getAddressUrl,
    REDIRECT_URLS
} from "@/lib/constants";

// =============================================================================
// CONNECT SCREEN COMPONENT
// =============================================================================

export default function ConnectScreen() {
    // ==========================================
    // WALLET HOOK (Official SDK)
    // ==========================================
    /**
     * The useWallet hook from @lazorkit/wallet-mobile-adapter provides:
     * - connect: Function to initiate passkey authentication
     * - disconnect: Function to disconnect the wallet
     * - isConnected: Boolean indicating connection status
     * - smartWalletPubkey: PublicKey of connected smart wallet
     */
    const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();

    // Get wallet address as string for display
    const walletAddress = smartWalletPubkey?.toBase58() || null;

    // Local loading state for UI feedback
    const [isConnecting, setIsConnecting] = useState(false);

    // ==========================================
    // CONNECT HANDLER
    // ==========================================
    /**
     * Connects wallet using passkey authentication.
     * 
     * IMPORTANT: The redirectUrl must match your app's URL scheme
     * configured in app.json. This tells the Lazorkit portal
     * where to redirect after authentication.
     */
    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            // Connect with redirect back to our app
            await connect({ redirectUrl: REDIRECT_URLS.connect });

            // Note: Success is handled automatically when the portal
            // redirects back and the SDK processes the response
        } catch (error: any) {
            console.error("Connection failed:", error);
            Alert.alert(
                "Connection Failed",
                error.message || "Failed to connect wallet. Please try again."
            );
        } finally {
            setIsConnecting(false);
        }
    };

    // ==========================================
    // DISCONNECT HANDLER
    // ==========================================
    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect Wallet",
            "Are you sure you want to disconnect?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Disconnect",
                    style: "destructive",
                    onPress: () => {
                        disconnect();
                    },
                },
            ]
        );
    };

    // ==========================================
    // VIEW ON EXPLORER
    // ==========================================
    const handleViewOnExplorer = () => {
        if (walletAddress) {
            Linking.openURL(getAddressUrl(walletAddress));
        }
    };

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header Info */}
            <View style={styles.infoBox}>
                <FontAwesome name="info-circle" size={20} color={Colors.info} />
                <Text style={styles.infoText}>
                    Connect using passkey authentication. Your device's biometrics
                    (Face ID, fingerprint) are used to secure your wallet.
                </Text>
            </View>

            {/* Connection Status Card */}
            <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                    <Text style={styles.statusTitle}>Wallet Status</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: isConnected ? `${Colors.success}20` : `${Colors.warning}20` },
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: isConnected ? Colors.success : Colors.warning },
                            ]}
                        />
                        <Text
                            style={[
                                styles.statusBadgeText,
                                { color: isConnected ? Colors.success : Colors.warning },
                            ]}
                        >
                            {isConnected ? "Connected" : "Not Connected"}
                        </Text>
                    </View>
                </View>

                {/* Connected State */}
                {isConnected && walletAddress ? (
                    <View style={styles.walletInfo}>
                        <Text style={styles.addressLabel}>Smart Wallet Address</Text>
                        <View style={styles.addressRow}>
                            <Text style={styles.addressText}>
                                {truncateAddress(walletAddress, 8)}
                            </Text>
                            <TouchableOpacity
                                style={styles.explorerButton}
                                onPress={handleViewOnExplorer}
                            >
                                <FontAwesome name="external-link" size={14} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Disconnect Button */}
                        <TouchableOpacity
                            style={styles.disconnectButton}
                            onPress={handleDisconnect}
                        >
                            <FontAwesome name="sign-out" size={16} color={Colors.error} />
                            <Text style={styles.disconnectButtonText}>Disconnect</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Not Connected State */
                    <View style={styles.connectContainer}>
                        <View style={styles.iconCircle}>
                            <FontAwesome name="lock" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.connectPrompt}>
                            No wallet connected
                        </Text>
                        <Text style={styles.connectSubtext}>
                            Tap the button below to connect with passkey
                        </Text>

                        {/* Connect Button */}
                        <TouchableOpacity
                            style={[
                                styles.connectButton,
                                isConnecting && styles.buttonDisabled,
                            ]}
                            onPress={handleConnect}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <ActivityIndicator size="small" color={Colors.text} />
                            ) : (
                                <>
                                    <FontAwesome name="unlock-alt" size={18} color={Colors.text} />
                                    <Text style={styles.connectButtonText}>Connect with Passkey</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* How It Works Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Works</Text>

                <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Tap Connect</Text>
                        <Text style={styles.stepDescription}>
                            Opens Lazorkit portal in browser
                        </Text>
                    </View>
                </View>

                <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Authenticate</Text>
                        <Text style={styles.stepDescription}>
                            Use Face ID, fingerprint, or PIN
                        </Text>
                    </View>
                </View>

                <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Redirected Back</Text>
                        <Text style={styles.stepDescription}>
                            Portal redirects to app via URL scheme
                        </Text>
                    </View>
                </View>

                <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>4</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Connected!</Text>
                        <Text style={styles.stepDescription}>
                            Your smart wallet is ready to use
                        </Text>
                    </View>
                </View>
            </View>

            {/* Code Example */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Code Example</Text>
                <View style={styles.codeCard}>
                    <Text style={styles.codeComment}>// Using the official SDK</Text>
                    <Text style={styles.codeLine}>{"import { useWallet } from '@lazorkit/wallet-mobile-adapter';"}</Text>
                    <Text style={styles.codeLine}>{""}</Text>
                    <Text style={styles.codeLine}>{"const { connect, wallet } = useWallet();"}</Text>
                    <Text style={styles.codeLine}>{""}</Text>
                    <Text style={styles.codeComment}>// Connect with redirect URL</Text>
                    <Text style={styles.codeLine}>{"await connect({ redirectUrl: 'myapp://home' });"}</Text>
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

    // Status Card
    statusCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: "600",
    },

    // Wallet Info (Connected)
    walletInfo: {
        alignItems: "center",
    },
    addressLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 8,
        textTransform: "uppercase",
        fontWeight: "600",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    addressText: {
        fontSize: 16,
        fontFamily: "SpaceMono",
        color: Colors.text,
    },
    explorerButton: {
        marginLeft: 10,
        padding: 6,
    },
    disconnectButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${Colors.error}15`,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: `${Colors.error}30`,
    },
    disconnectButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.error,
        marginLeft: 8,
    },

    // Connect Container
    connectContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: `${Colors.primary}30`,
    },
    connectPrompt: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 4,
    },
    connectSubtext: {
        fontSize: 14,
        color: Colors.textMuted,
        marginBottom: 20,
    },
    connectButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        width: "100%",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    connectButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
        marginLeft: 10,
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

    // Steps
    stepCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}20`,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primary,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
    },
    stepDescription: {
        fontSize: 13,
        color: Colors.textSecondary,
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

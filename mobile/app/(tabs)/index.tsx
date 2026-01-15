/**
 * =============================================================================
 * HOME SCREEN - WELCOME & OVERVIEW
 * =============================================================================
 * 
 * The landing screen for the Lazorkit Mobile Examples app.
 * Provides an overview of what users can learn and quick access to examples.
 * 
 * FEATURES:
 * - Welcome message
 * - List of available examples
 * - Quick start instructions
 * - Links to each example tab
 * =============================================================================
 */

import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

import { Colors, NETWORK } from "@/lib/constants";

// =============================================================================
// HOME SCREEN COMPONENT
// =============================================================================

/**
 * HomeScreen Component
 * 
 * The main welcome screen displaying:
 * - App title and description
 * - Network indicator
 * - List of examples to explore
 * - Getting started instructions
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <View style={styles.hero}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="lock" size={40} color={Colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Lazorkit SDK</Text>
        <Text style={styles.subtitle}>Mobile Examples</Text>

        {/* Description */}
        <Text style={styles.description}>
          Learn how to build Solana mobile apps with passkey authentication.
          No seed phrases, just modern UX.
        </Text>

        {/* Network Badge */}
        <View style={styles.networkBadge}>
          <View style={styles.networkDot} />
          <Text style={styles.networkText}>{NETWORK.toUpperCase()}</Text>
        </View>
      </View>

      {/* ==========================================
          EXAMPLES LIST
          ========================================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Examples</Text>

        {/* Example 1: Connect */}
        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => router.push("/01-connect-wallet")}
        >
          <View style={styles.exampleIcon}>
            <FontAwesome name="lock" size={24} color={Colors.primary} />
          </View>
          <View style={styles.exampleContent}>
            <Text style={styles.exampleNumber}>Example 1</Text>
            <Text style={styles.exampleTitle}>Connect Wallet</Text>
            <Text style={styles.exampleDescription}>
              Create and connect a passkey-based wallet
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Example 2: Balance */}
        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => router.push("/02-check-balance")}
        >
          <View style={styles.exampleIcon}>
            <FontAwesome name="credit-card" size={24} color={Colors.info} />
          </View>
          <View style={styles.exampleContent}>
            <Text style={styles.exampleNumber}>Example 2</Text>
            <Text style={styles.exampleTitle}>Check Balance</Text>
            <Text style={styles.exampleDescription}>
              View your SOL balance with auto-refresh
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Example 3: Send */}
        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => router.push("/03-send-sol")}
        >
          <View style={styles.exampleIcon}>
            <FontAwesome name="send" size={24} color={Colors.success} />
          </View>
          <View style={styles.exampleContent}>
            <Text style={styles.exampleNumber}>Example 3</Text>
            <Text style={styles.exampleTitle}>Send SOL</Text>
            <Text style={styles.exampleDescription}>
              Transfer SOL with gasless transactions
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ==========================================
          GETTING STARTED
          ========================================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Getting Started</Text>

        <View style={styles.infoCard}>
          <FontAwesome name="info-circle" size={20} color={Colors.info} />
          <Text style={styles.infoText}>
            Start with Example 1 to connect your wallet, then explore the other
            examples in order. Each builds on concepts from the previous one.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <FontAwesome name="money" size={20} color={Colors.warning} />
          <Text style={styles.infoText}>
            You'll need devnet SOL for Examples 2 and 3. Get some from the
            Solana Faucet by tapping the button below.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.faucetButton}
          onPress={() => Linking.openURL("https://faucet.solana.com")}
        >
          <FontAwesome name="tint" size={16} color={Colors.text} />
          <Text style={styles.faucetButtonText}>Open Solana Faucet</Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with Lazorkit SDK
        </Text>
        <Text style={styles.footerSubtext}>
          Passkey Authentication for Solana
        </Text>
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

  // Hero Section
  hero: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}40`,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  networkBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  networkText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
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

  // Example Cards
  exampleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exampleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  exampleContent: {
    flex: 1,
  },
  exampleNumber: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  exampleDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  // Info Cards
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },

  // Faucet Button
  faucetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  faucetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

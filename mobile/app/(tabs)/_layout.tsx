/**
 * =============================================================================
 * TAB LAYOUT - MOBILE EXAMPLES
 * =============================================================================
 * 
 * Configures the bottom tab navigation for the examples app.
 * 
 * TABS:
 * 1. Home - Welcome screen with overview
 * 2. 01-connect-wallet - Wallet connection example
 * 3. 02-check-balance - Check SOL balance example
 * 4. 03-send-sol - Transfer SOL example
 * =============================================================================
 */

import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";

import { Colors } from "@/lib/constants";

// =============================================================================
// TAB BAR ICON COMPONENT
// =============================================================================

/**
 * Props for TabBarIcon component.
 */
interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

/**
 * TabBarIcon Component
 * 
 * Renders an icon for the tab bar with consistent styling.
 */
function TabBarIcon(props: TabBarIconProps) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

// =============================================================================
// TAB LAYOUT COMPONENT
// =============================================================================

/**
 * TabLayout Component
 * 
 * Configures the bottom tab navigator with 4 tabs:
 * - Home: Welcome and overview
 * - Connect: Wallet connection
 * - Balance: View balance
 * - Send: Transfer SOL
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tab bar styling
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 5,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          height: Platform.OS === "ios" ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        // Header styling
        headerStyle: {
          backgroundColor: Colors.card,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        // Right header button (network badge)
        headerRight: () => (
          <View style={styles.networkBadge}>
            <FontAwesome name="circle" size={8} color={Colors.success} />
          </View>
        ),
      }}
    >
      {/* ==========================================
          TAB 1: HOME
          ========================================== */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: "Lazorkit Examples",
        }}
      />

      {/* ==========================================
          TAB 2: CONNECT WALLET (Example 1)
          ========================================== */}
      <Tabs.Screen
        name="01-connect-wallet"
        options={{
          title: "Connect",
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
          headerTitle: "Example 1: Connect Wallet",
        }}
      />

      {/* ==========================================
          TAB 3: CHECK BALANCE (Example 2)
          ========================================== */}
      <Tabs.Screen
        name="02-check-balance"
        options={{
          title: "Balance",
          tabBarIcon: ({ color }) => <TabBarIcon name="credit-card" color={color} />,
          headerTitle: "Example 2: Check Balance",
        }}
      />

      {/* ==========================================
          TAB 4: SEND SOL (Example 3)
          ========================================== */}
      <Tabs.Screen
        name="03-send-sol"
        options={{
          title: "Send",
          tabBarIcon: ({ color }) => <TabBarIcon name="send" color={color} />,
          headerTitle: "Example 3: Send SOL",
        }}
      />
    </Tabs>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  networkBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

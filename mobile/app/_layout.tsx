/**
 * =============================================================================
 * ROOT LAYOUT - MOBILE APP
 * =============================================================================
 * 
 * The root layout for the Lazorkit Mobile Examples app.
 * 
 * IMPORTANT: Polyfills must be imported at the very top before any other imports!
 * React Native doesn't have a standardized Node.js environment, so Solana
 * libraries need these polyfills to work correctly.
 * =============================================================================
 */

// =============================================================================
// POLYFILLS - MUST BE AT THE VERY TOP
// =============================================================================
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

// =============================================================================
// IMPORTS
// =============================================================================
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// Official Lazorkit SDK Provider
import { LazorKitProvider } from "@lazorkit/wallet-mobile-adapter";

// Local constants
import { Colors, LAZORKIT_CONFIG } from "@/lib/constants";

// Re-export ErrorBoundary for Expo Router
export { ErrorBoundary } from "expo-router";

// Initial route configuration
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// =============================================================================
// CUSTOM DARK THEME
// =============================================================================

/**
 * Custom dark theme matching the web app's aesthetic.
 */
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

// =============================================================================
// ROOT LAYOUT COMPONENT
// =============================================================================

/**
 * RootLayout Component
 * 
 * The main entry point for the app. Handles:
 * - Font loading
 * - Splash screen management
 * - Provider setup (Lazorkit + Theme)
 */
export default function RootLayout() {
  // Load custom fonts
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Handle font loading errors
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Show nothing while fonts are loading
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// =============================================================================
// ROOT NAVIGATION
// =============================================================================

/**
 * RootLayoutNav Component
 * 
 * Sets up the navigation structure with providers:
 * - ThemeProvider: Applies dark theme
 * - LazorKitProvider: Official Lazorkit wallet provider
 * - Stack: Main navigation stack
 * 
 * CONFIGURATION:
 * - rpcUrl: Solana RPC endpoint
 * - portalUrl: Lazorkit passkey portal
 * - configPaymaster: Paymaster for gasless transactions
 */
function RootLayoutNav() {
  return (
    <ThemeProvider value={CustomDarkTheme}>
      <LazorKitProvider
        rpcUrl={LAZORKIT_CONFIG.rpcUrl}
        portalUrl={LAZORKIT_CONFIG.portalUrl}
        configPaymaster={LAZORKIT_CONFIG.configPaymaster}
      >
        <Stack>
          {/* Main tabs navigation */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        </Stack>
      </LazorKitProvider>
    </ThemeProvider>
  );
}

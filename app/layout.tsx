/**
 * =============================================================================
 * ROOT LAYOUT
 * =============================================================================
 * 
 * The root layout for the Lazorkit Examples application.
 * 
 * This file:
 * - Imports polyfills for Node.js APIs in the browser
 * - Sets up global fonts (Geist Sans and Geist Mono)
 * - Wraps the app with LazorkitProvider for wallet functionality
 * - Provides page metadata for SEO
 */

import "./polyfills";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// =============================================================================
// FONTS
// =============================================================================

/**
 * Geist Sans - Primary font for body text
 * Clean, modern sans-serif typeface from Vercel
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono - Monospace font for code snippets
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// =============================================================================
// METADATA
// =============================================================================

/**
 * SEO metadata for the application
 */
export const metadata: Metadata = {
  title: "Lazorkit SDK Examples | Passkey Authentication for Solana",
  description:
    "Learn how to build Solana applications with passkey authentication using Lazorkit SDK. Examples include smart wallet creation, gasless transfers, and NFT minting.",
  keywords: [
    "Lazorkit",
    "Solana",
    "Passkey",
    "Web3",
    "Wallet",
    "NFT",
    "Metaplex",
    "Smart Wallet",
    "Gasless",
  ],
  authors: [{ name: "Lazorkit Team" }],
  openGraph: {
    title: "Lazorkit SDK Examples",
    description: "Passkey-based wallet authentication for Solana",
    type: "website",
  },
};

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

/**
 * RootLayout Component
 * 
 * The root layout wraps all pages with:
 * - HTML document structure
 * - Font CSS variables
 * - LazorkitProvider for wallet context
 * 
 * @param children - The page content to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 
          Providers wraps the app with LazorkitProvider 
          This makes wallet functionality available to all pages
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

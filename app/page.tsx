"use client";

/**
 * =============================================================================
 * LAZORKIT SDK EXAMPLES - LANDING PAGE
 * =============================================================================
 * 
 * Welcome to the Lazorkit SDK Examples repository!
 * 
 * This landing page serves as the hub for all examples, providing an overview
 * of what users can learn and quick access to each example.
 * 
 * EXAMPLES OVERVIEW:
 * 1. Smart Wallet & Authentication - Create passkey-based wallets
 * 2. Gasless SOL Transfer - Send SOL without paying fees
 * 3. NFT Creation & Minting - Create NFTs using Metaplex
 */

import Link from "next/link";
import { EXAMPLES, LAZORKIT_CONFIG, NETWORK } from "./lib/constants";
import { WalletStatusCompact } from "./components/WalletStatus";

/**
 * LandingPage Component
 * 
 * The main entry point for the examples repository.
 * Shows an overview and links to all examples.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Abstract Background Gradient */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h1 className="text-lg font-semibold">Lazorkit SDK Examples</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium uppercase">
              {NETWORK}
            </span>
            <WalletStatusCompact />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          {/* Logo */}
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 ring-1 ring-rose-500/30 mb-8">
            <span className="text-5xl">🔐</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-6">
            Lazorkit SDK Examples
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Learn how to build Solana applications with passkey authentication.
            No seed phrases, no browser extensions, just modern UX.
          </p>

          {/* CTA */}
          <Link
            href={EXAMPLES[0].path}
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-xl
              bg-gradient-to-r from-rose-500 to-orange-500
              text-white font-semibold text-lg
              shadow-lg shadow-rose-500/25
              ring-1 ring-white/10
              transition-all duration-200
              hover:shadow-rose-500/40 hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <span>Start Learning</span>
            <span>→</span>
          </Link>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-12">
            What You'll Build
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Passkey Authentication
              </h3>
              <p className="text-sm text-zinc-400">
                Replace seed phrases with biometrics. Users authenticate with Face ID,
                Touch ID, or Windows Hello.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⛽</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Gasless Transactions
              </h3>
              <p className="text-sm text-zinc-400">
                Users don't pay gas fees. The paymaster sponsors transactions,
                enabling web2-like UX.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                NFT Integration
              </h3>
              <p className="text-sm text-zinc-400">
                Create and mint NFTs using Metaplex. Build marketplaces, games,
                or digital collectibles.
              </p>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Example Walkthroughs
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
            Each example builds on the previous one, guiding you from basic wallet
            connection to advanced NFT minting.
          </p>

          <div className="space-y-4">
            {EXAMPLES.map((example, index) => (
              <Link
                key={example.id}
                href={example.path}
                className="
                  flex items-center gap-6 p-6 rounded-2xl
                  bg-white/5 ring-1 ring-white/10
                  hover:bg-white/10 hover:ring-rose-500/30
                  transition-all duration-200 group
                "
              >
                {/* Number Badge */}
                <div className="
                  flex-shrink-0 h-12 w-12 rounded-xl
                  bg-gradient-to-br from-rose-500/20 to-orange-500/20
                  ring-1 ring-rose-500/30
                  flex items-center justify-center
                  text-xl font-bold text-rose-400
                ">
                  {example.id}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{example.icon}</span>
                    <h3 className="text-lg font-semibold text-white">
                      {example.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {example.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Prerequisites Section */}
        <section className="mb-20">
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8">
            <h2 className="text-xl font-semibold mb-6">Prerequisites</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Required
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    Modern browser (Chrome, Safari, Firefox, Edge)
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    Passkey support (biometrics or security key)
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-400">✓</span>
                    HTTPS or localhost (passkey requirement)
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Recommended
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-blue-400">○</span>
                    Node.js 18+ (for local development)
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-blue-400">○</span>
                    Devnet SOL (get from Solana Faucet)
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-blue-400">○</span>
                    Basic React/TypeScript knowledge
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-8">Quick Start</h2>
          <div className="rounded-2xl bg-black/40 ring-1 ring-white/10 p-6 font-mono text-sm">
            <div className="text-zinc-500 mb-4"># Clone and run</div>
            <div className="text-zinc-300">git clone https://github.com/your-repo/lazorkit-examples.git</div>
            <div className="text-zinc-300">cd lazorkit-examples</div>
            <div className="text-zinc-300">npm install</div>
            <div className="text-zinc-300">npm run dev</div>
            <div className="text-zinc-500 mt-4"># Open http://localhost:3000</div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold text-center mb-8">Resources</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <a
              href="https://docs.lazorkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium text-white">Lazorkit Docs</div>
            </a>
            <a
              href="https://docs.metaplex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium text-white">Metaplex Docs</div>
            </a>
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <div className="text-2xl mb-2">💧</div>
              <div className="text-sm font-medium text-white">Solana Faucet</div>
            </a>
            <a
              href="https://explorer.solana.com?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-medium text-white">Explorer</div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">
          <p>
            Built with{" "}
            <a
              href="https://lazorkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              Lazorkit SDK
            </a>
            {" "}• Passkey Authentication for Solana
          </p>
          <p className="mt-2">
            Using <span className="text-emerald-400">{NETWORK}</span> network
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

/**
 * =============================================================================
 * PAGE LAYOUT COMPONENT
 * =============================================================================
 * 
 * A consistent layout wrapper for all example pages.
 * Provides a unified structure with title, description, and navigation.
 * 
 * FEATURES:
 * - Consistent page structure across all examples
 * - Title and description display
 * - Example number badge
 * - Background gradient effects
 * - Footer with example navigation
 */

import { ReactNode } from "react";
import { Navigation, ExampleNav } from "./Navigation";
import { EXAMPLES } from "../lib/constants";

/**
 * PageLayout Props
 */
interface PageLayoutProps {
    /** The example number (1, 2, or 3) */
    exampleNumber: number;
    /** Page title */
    title: string;
    /** Page description/subtitle */
    description: string;
    /** Page content */
    children: ReactNode;
}

/**
 * PageLayout Component
 * 
 * Wraps example pages with consistent navigation, styling, and structure.
 * 
 * @component
 * @example
 * <PageLayout
 *   exampleNumber={1}
 *   title="Smart Wallet & Authentication"
 *   description="Learn how to create and connect passkey-based wallets"
 * >
 *   {content}
 * </PageLayout>
 */
export function PageLayout({
    exampleNumber,
    title,
    description,
    children,
}: PageLayoutProps) {
    // Get example metadata
    const example = EXAMPLES.find((e) => e.id === exampleNumber);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Abstract Background Gradient */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-rose-500/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Page Header */}
                <header className="mb-12">
                    {/* Example Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-rose-500/10 ring-1 ring-rose-500/20">
                        <span>{example?.icon}</span>
                        <span className="text-xs font-medium text-rose-400">
                            Example {exampleNumber} of {EXAMPLES.length}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                        {description}
                    </p>
                </header>

                {/* Page Content */}
                <div className="space-y-8">
                    {children}
                </div>

                {/* Example Navigation */}
                <ExampleNav currentExample={exampleNumber} />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 mt-20">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-zinc-500">
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
                </div>
            </footer>
        </div>
    );
}

/**
 * Section Component
 * 
 * A styled section wrapper for organizing content within examples.
 * 
 * @component
 */
interface SectionProps {
    /** Section title */
    title: string;
    /** Optional description */
    description?: string;
    /** Section content */
    children: ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
    return (
        <section className="rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="rounded-[14px] bg-zinc-900/50 p-6">
                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    {description && (
                        <p className="mt-1 text-sm text-zinc-400">{description}</p>
                    )}
                </div>

                {/* Section Content */}
                {children}
            </div>
        </section>
    );
}

/**
 * CodeBlock Component
 * 
 * Displays code snippets with syntax highlighting styling.
 * 
 * @component
 */
interface CodeBlockProps {
    /** Code content */
    code: string;
    /** Programming language for styling */
    language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
    return (
        <div className="relative">
            {/* Language Badge */}
            <div className="absolute top-3 right-3 text-xs text-zinc-500 uppercase">
                {language}
            </div>

            {/* Code Content */}
            <pre className="p-4 rounded-xl bg-black/60 overflow-x-auto">
                <code className="text-sm text-zinc-300 font-mono">{code}</code>
            </pre>
        </div>
    );
}

/**
 * InfoBox Component
 * 
 * Displays informational notes, warnings, or tips.
 * 
 * @component
 */
interface InfoBoxProps {
    /** Box type affects styling */
    type: "info" | "warning" | "success" | "tip";
    /** Box title */
    title: string;
    /** Box content */
    children: ReactNode;
}

export function InfoBox({ type, title, children }: InfoBoxProps) {
    // Style variants based on type
    const styles = {
        info: "bg-blue-500/10 ring-blue-500/20 text-blue-400",
        warning: "bg-yellow-500/10 ring-yellow-500/20 text-yellow-400",
        success: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-400",
        tip: "bg-purple-500/10 ring-purple-500/20 text-purple-400",
    };

    const icons = {
        info: "ℹ️",
        warning: "⚠️",
        success: "✅",
        tip: "💡",
    };

    return (
        <div className={`rounded-xl p-4 ring-1 ${styles[type]}`}>
            <div className="flex items-center gap-2 mb-2">
                <span>{icons[type]}</span>
                <span className="font-medium">{title}</span>
            </div>
            <div className="text-sm text-zinc-300">{children}</div>
        </div>
    );
}

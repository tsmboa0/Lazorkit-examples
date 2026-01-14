"use client";

/**
 * =============================================================================
 * NAVIGATION COMPONENT
 * =============================================================================
 * 
 * A responsive navigation component that displays links to all examples
 * in the repository. Shows the current example and allows navigation
 * between examples.
 * 
 * FEATURES:
 * - Shows all available examples with icons
 * - Highlights current example
 * - Responsive design for mobile and desktop
 * - Links back to home page
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXAMPLES } from "../lib/constants";

/**
 * Navigation Component
 * 
 * Renders a navigation bar/sidebar for the examples repository.
 * Automatically highlights the current example based on the URL path.
 * 
 * @component
 * @example
 * // In your layout or page component:
 * <Navigation />
 */
export function Navigation() {
    // Get current path to highlight active example
    const pathname = usePathname();

    return (
        <nav className="w-full bg-zinc-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-3">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                    {/* Logo/Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white font-semibold hover:text-rose-400 transition-colors"
                    >
                        <span className="text-xl">⚡</span>
                        <span>Lazorkit Examples</span>
                    </Link>

                    {/* GitHub Link */}
                    <a
                        href="https://github.com/example/lazorkit-examples"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                        GitHub →
                    </a>
                </div>

                {/* Examples Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {EXAMPLES.map((example) => {
                        // Check if this is the current example
                        const isActive = pathname?.includes(example.slug);

                        return (
                            <Link
                                key={example.id}
                                href={example.path}
                                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap
                  transition-all duration-200
                  ${isActive
                                        ? "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }
                `}
                            >
                                <span>{example.icon}</span>
                                <span className="hidden sm:inline">{example.title}</span>
                                <span className="sm:hidden">#{example.id}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

/**
 * Example Navigation Props
 * Used for the previous/next navigation at the bottom of each example
 */
interface ExampleNavProps {
    /** The current example number (1, 2, or 3) */
    currentExample: number;
}

/**
 * ExampleNav Component
 * 
 * Renders previous/next navigation buttons for moving between examples.
 * Shows appropriate labels and handles edge cases (first/last example).
 * 
 * @component
 * @example
 * // At the bottom of Example 2:
 * <ExampleNav currentExample={2} />
 */
export function ExampleNav({ currentExample }: ExampleNavProps) {
    // Find previous and next examples
    const prevExample = EXAMPLES.find((e) => e.id === currentExample - 1);
    const nextExample = EXAMPLES.find((e) => e.id === currentExample + 1);

    return (
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
            {/* Previous Example */}
            {prevExample ? (
                <Link
                    href={prevExample.path}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <div className="text-left">
                        <div className="text-xs text-zinc-500">Previous</div>
                        <div className="text-sm">{prevExample.title}</div>
                    </div>
                </Link>
            ) : (
                <div /> // Empty spacer
            )}

            {/* Next Example */}
            {nextExample ? (
                <Link
                    href={nextExample.path}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <div className="text-right">
                        <div className="text-xs text-zinc-500">Next</div>
                        <div className="text-sm">{nextExample.title}</div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            ) : (
                <Link
                    href="/"
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <div className="text-right">
                        <div className="text-xs text-zinc-500">Completed!</div>
                        <div className="text-sm">Back to Home</div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">🏠</span>
                </Link>
            )}
        </div>
    );
}

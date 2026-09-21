"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * ============================================================================
 * Type Definition: NavLinkItem
 * ============================================================================
 * Configuration for individual header navigation items.
 * - href: Target route destination
 * - label: Text label displayed to users
 * - dotColor: Optional brand theme accent dot for visual brand differentiation
 * - badge: Optional micro-badge (e.g. "Flagship", "Heavy-Duty")
 */
interface NavLinkItem {
  href: string;
  label: string;
  dotColor?: string;
  badge?: string;
}

/**
 * ============================================================================
 * Component: Header
 * ============================================================================
 * Primary site header featuring:
 * 1. Precision lock monogram logo and brand wordmark.
 * 2. Sticky positioning with frosted-glass backdrop blur (glassmorphism).
 * 3. Multi-brand route navigation with dynamic active state highlighting.
 * 4. Distinct brand color indicator dots (S-Nafi gold, Greek blue, Raksham red).
 * 5. Quick-action Call-To-Action (CTA) for dealer inquiries.
 * 6. Fully responsive mobile navigation drawer with animated toggle button.
 */
export default function Header() {
  // Access current route path to calculate active link state
  const pathname = usePathname();

  // State to toggle mobile drawer menu open/closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  /**
   * Navigation links array adhering to architecture decision #3:
   * Each of the three flagship brands is represented directly in the main header.
   */
  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    {
      href: "/brands/s-nafi",
      label: "S-Nafi",
      dotColor: "bg-[#9A7228]", // Brass gold theme
      badge: "Brass",
    },
    {
      href: "/brands/greek",
      label: "Greek",
      dotColor: "bg-[#235F8E]", // Aegean blue theme
      badge: "Classic",
    },
    {
      href: "/brands/raksham",
      label: "Raksham",
      dotColor: "bg-[#9A2F24]", // Guardian crimson theme
      badge: "Security",
    },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-divider/80 bg-background/95 backdrop-blur-md transition-shadow">
      <nav
        className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* ====================================================================
            1. Brand Identity & Lock Emblem
            ==================================================================== */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
        >
          {/* ── Custom Lock Emblem Icon Stage ── */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9A7228] to-[#6A4B13] p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[6px] bg-[#15130F] flex items-center justify-center">
              {/* Precision Padlock SVG Monogram */}
              <svg
                className="w-5 h-5 text-[#E6BF70] transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Shackle */}
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                {/* Padlock Body */}
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                {/* Keyhole */}
                <circle cx="12" cy="16" r="1" fill="currentColor" />
                <path d="M12 17v2" />
              </svg>
            </div>
          </div>

          {/* ── Typographic Lockup ── */}
          <div className="flex flex-col">
            <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-primary leading-tight">
              Nafi <span className="text-accent font-serif font-normal">Lock Industries</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted -mt-0.5">
              Est. 1995 • Precision Engineering
            </span>
          </div>
        </Link>

        {/* ====================================================================
            2. Desktop Navigation Links (with Active State & Brand Dots)
            ==================================================================== */}
        <ul className="hidden md:flex items-center gap-1.5 bg-surface/80 p-1.5 rounded-full border border-divider/60 shadow-xs">
          {navLinks.map((link) => {
            // Determine whether this link represents the currently active page
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-background text-primary shadow-xs border border-divider/80 font-semibold"
                      : "text-muted hover:text-primary hover:bg-background/60"
                  }`}
                >
                  {/* Brand signature color dot (if applicable) */}
                  {link.dotColor && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${link.dotColor} shrink-0 ${
                        isActive ? "ring-2 ring-accent/30" : "opacity-80"
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Nav item label */}
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ====================================================================
            3. Action CTA & Mobile Navigation Toggle
            ==================================================================== */}
        <div className="flex items-center gap-3">
          {/* ── Wholesale / Dealer Inquiries Quick Button (Desktop) ── */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md bg-accent text-white hover:bg-accent-hover shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <span>Dealer Inquiry</span>
            {/* Arrow SVG Icon */}
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* ── Mobile Hamburger Menu Toggle Button ── */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md border border-divider text-muted hover:text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              /* Close (X) Icon */
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger Bars Icon */
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ====================================================================
          4. Responsive Mobile Navigation Drawer
          ==================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-divider bg-background px-6 py-4 shadow-lg animate-in slide-in-from-top duration-200">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-surface text-accent font-semibold"
                        : "text-muted hover:text-primary hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {link.dotColor && (
                        <span
                          className={`w-2 h-2 rounded-full ${link.dotColor}`}
                          aria-hidden="true"
                        />
                      )}
                      <span>{link.label}</span>
                    </div>

                    {link.badge && (
                      <span className="font-mono text-[10px] uppercase text-muted px-2 py-0.5 rounded bg-surface border border-divider">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Direct Action Button */}
          <div className="mt-4 pt-4 border-t border-divider">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-accent text-white hover:bg-accent-hover shadow-sm transition-colors"
            >
              <span>Contact Wholesale Desk</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * ============================================================================
 * Type Definition: NavLinkItem
 * ============================================================================
 * Configuration for individual header navigation items.
 * - href: Target route destination URL
 * - label: Display name shown to users
 * - dotColor: Distinct signature brand theme dot (S-Nafi, Greek, Raksham)
 * - badge: Optional technical category indicator
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
 * Ethereal, morphing site navigation header.
 *
 * Key Architecture & Requested Design Changes:
 * 1. Official SVG Logo: Uses the user's uploaded vector logo (/logos/nafi-logo.svg).
 * 2. Removed Subtitle: "[Est. 1995 • Precision Engineering]" has been removed.
 * 3. Borderless Navigation: All border lines removed from nav items and container.
 * 4. Morphing Header Effect (Ethereal Glassmorphism):
 *    - Uses a scroll listener to detect when the user scrolls down the page.
 *    - At top (scrollY === 0): Generous padding and crisp ethereal blur.
 *    - When scrolled (scrollY > 20): Smoothly morphs into a compact, floating
 *      glassmorphism dock with deeper backdrop blur (backdrop-blur-2xl),
 *      reduced vertical height, and elevated ambient shadow.
 * 5. Responsive Mobile Drawer: Smooth slide-down menu with seamless touch targets.
 */
export default function Header() {
  // Read active pathname to dynamically compute active nav link state
  const pathname = usePathname();

  // State to toggle mobile navigation drawer open / closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Scroll state to trigger the header morphing animation
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /**
   * Scroll listener to activate the header morphing effect when page is scrolled.
   * Passive listener ensures 60fps+ smooth scrolling performance.
   */
  useEffect(() => {
    const handleScroll = () => {
      // Morph header when scrolled past 20px
      setIsScrolled(window.scrollY > 20);
    };

    // Evaluate initial scroll on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Navigation links array adhering to architecture decision #3:
   * Each of the three flagship brands is represented directly in the main header.
   */
  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    {
      href: "/brands/s-nafi",
      label: "S-Nafi",
      dotColor: "bg-[#9A7228]", // Signature Brass Gold
      badge: "Brass",
    },
    {
      href: "/brands/greek",
      label: "Greek",
      dotColor: "bg-[#235F8E]", // Signature Aegean Blue
      badge: "Classic",
    },
    {
      href: "/brands/raksham",
      label: "Raksham",
      dotColor: "bg-[#9A2F24]", // Signature Guardian Crimson
      badge: "Security",
    },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-b border-black/[0.04] py-2 sm:py-2.5"
          : "bg-white/95 backdrop-blur-md border-b border-divider/60 py-3.5 sm:py-4"
      }`}
      aria-label="Site Header"
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* ====================================================================
            1. Brand Identity & Official SVG Logo
            ==================================================================== */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group transition-transform duration-300 hover:scale-[1.01]"
          aria-label="Nafi Lock Industries Homepage"
        >
          {/*
            Official SVG Vector Emblem:
            - Rendered with Next.js Image optimization for crisp vector fidelity.
            - Subtle golden ambient glow via drop-shadow.
            - Interactive micro-rotation and scale on group hover.
          */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
            <Image
              src="/logos/nafi-logo.svg"
              alt="Nafi Lock Industries Official Logo"
              width={44}
              height={44}
              priority
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(184,146,63,0.3)]"
            />
          </div>

          {/*
            Brand Typographic Wordmark:
            - Features Fraunces serif headline font for authoritative industrial prestige.
            - Sub-caption [Est. 1995 • Precision Engineering] removed per user request.
          */}
          <span className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary flex items-center gap-1.5">
            Nafi <span className="text-accent font-serif font-normal">Lock Industries</span>
          </span>
        </Link>

        {/* ====================================================================
            2. Borderless Desktop Navigation (Pill Morphing Effect)
            ==================================================================== */}
        {/*
          Outer nav container:
          - Border line has been completely removed per user request.
          - Soft translucent background with subtle pill curvature.
        */}
        <ul className="hidden md:flex items-center gap-1 bg-surface/70 p-1 rounded-full backdrop-blur-sm">
          {navLinks.map((link) => {
            // Check whether this route is currently active
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                {/*
                  Nav item link:
                  - All border lines removed.
                  - Smooth background pill transition (bg-white shadow-xs on active).
                  - Gentle opacity and color shift on hover.
                */}
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-white text-primary shadow-xs font-semibold"
                      : "text-muted hover:text-primary hover:bg-white/60"
                  }`}
                >
                  {/* Distinct Brand Signature Dot */}
                  {link.dotColor && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${link.dotColor} shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-125 ring-2 ring-accent/25" : "opacity-75"
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Nav Item Title */}
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ====================================================================
            3. Header Actions & Mobile Drawer Toggle
            ==================================================================== */}
        <div className="flex items-center gap-3">
          {/* ── Direct Dealer Inquiry CTA Button ── */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Dealer Inquiry</span>
            {/* Arrow SVG Icon */}
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
            className="md:hidden p-2 rounded-lg text-muted hover:text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
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
        <div className="md:hidden border-t border-divider/60 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-surface text-accent font-semibold"
                        : "text-muted hover:text-primary hover:bg-surface/60"
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
                      <span className="font-mono text-[10px] uppercase text-muted px-2 py-0.5 rounded bg-surface border border-divider/60">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Direct Mobile Contact CTA */}
          <div className="mt-4 pt-4 border-t border-divider/60">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-colors"
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

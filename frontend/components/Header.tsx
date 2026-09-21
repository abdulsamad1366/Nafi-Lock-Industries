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
 * - badge: Optional technical category indicator
 */
interface NavLinkItem {
  href: string;
  label: string;
  badge?: string;
}

/**
 * ============================================================================
 * Component: Header
 * ============================================================================
 * Dual-State Precision Navigation Header:
 *
 * 1. Unscrolled State (scrollY <= 20):
 *    - Full-width edge-to-edge layout directly beneath the manufacturing marquee.
 *    - Crisp border-b divider with high-contrast luxury brand typography.
 *
 * 2. Scrolled State (scrollY > 20) — Floating Capsule Dock (per reference design):
 *    - Morphs smoothly from full width into an elevated, centered floating capsule dock (`rounded-full`).
 *    - Inset from viewport boundaries (`top-3 sm:top-4 px-4 sm:px-6`) with deep ambient drop-shadow
 *      (`shadow-[0_12px_35px_rgba(0,0,0,0.08)]`) and 2xl glassmorphic blur.
 *    - Page content scrolls freely behind the floating dock.
 *
 * 3. 3-Zone Symmetrical Alignment:
 *    - Left: Official royal gold lock SVG emblem + brand wordmark.
 *    - Center: Mathematically dead-center desktop navigation (`md:absolute md:left-1/2 md:-translate-x-1/2`).
 *    - Right: Royal gold "Dealer Inquiry" capsule CTA button + mobile menu toggle.
 *
 * 4. Responsive Mobile Drawer:
 *    - Dynamically adapts between full-width drawer and floating card drawer.
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
   * Color dots removed per user request for a cleaner typographic presentation.
   */
  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    {
      href: "/brands/s-nafi",
      label: "S-Nafi",
      badge: "Brass",
    },
    {
      href: "/brands/greek",
      label: "Greek",
      badge: "Classic",
    },
    {
      href: "/brands/raksham",
      label: "Raksham",
      badge: "Security",
    },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky z-40 transition-all duration-300 ease-out ${
        isScrolled
          ? "top-3 sm:top-4 w-full px-4 sm:px-6 pointer-events-none"
          : "top-0 w-full bg-white/95 backdrop-blur-md border-b border-divider/60 py-3.5 sm:py-4"
      }`}
      aria-label="Site Header"
    >
      {/*
        Dual-State Navigation Container:
        - When unscrolled (at top of page): standard max-w-6xl container flush inside the full-width header.
        - When scrolled: transforms into a self-contained floating capsule dock (`rounded-full`)
          with pure white glassmorphism, subtle border, and luxury elevation drop shadow.
        - Pointer events enabled on <nav> so surrounding margin/padding remains click-through.
      */}
      <nav
        className={`max-w-6xl mx-auto relative flex items-center justify-between pointer-events-auto transition-all duration-300 ease-out ${
          isScrolled
            ? "px-6 sm:px-8 py-2.5 rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] border border-black/[0.06]"
            : "px-6"
        }`}
      >
        {/* ====================================================================
            1. Left Zone: Brand Identity & Official SVG Logo
            ==================================================================== */}
        <div className="flex items-center shrink-0">
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
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Lock Industries Official Logo"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(184,146,63,0.3)]"
              />
            </div>

            {/*
              Brand Typographic Wordmark:
              - Features Fraunces serif headline font for authoritative industrial prestige.
              - Positioned flush left alongside the logo emblem.
            */}
            <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-primary flex items-center gap-1.5">
              Nafi <span className="text-accent font-serif font-normal">Lock Industries</span>
            </span>
          </Link>
        </div>

        {/* ====================================================================
            2. Center Zone: Desktop Navigation (Mathematically Dead-Center)
            ==================================================================== */}
        {/*
          Centered via `md:absolute md:left-1/2 md:-translate-x-1/2` to ensure
          the menu stays perfectly aligned with the center axis of the header,
          independent of unequal widths between the left logo and right CTA.
        */}
        <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center pointer-events-auto">
          <ul className="flex items-center gap-1 sm:gap-1.5">
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
                    - Clean typography matching the reference aesthetic.
                    - Active state: accented color with an elegant underline indicator.
                    - Hover state: subtle text color change and soft background hint.
                  */}
                  <Link
                    href={link.href}
                    className={`relative flex items-center px-3.5 sm:px-4 py-2 rounded-full text-sm sm:text-[15px] tracking-wide transition-all duration-200 ${
                      isActive
                        ? "text-accent font-semibold after:absolute after:bottom-0.5 after:left-3.5 after:right-3.5 after:h-[2px] after:bg-accent after:rounded-full"
                        : "text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ====================================================================
            3. Right Zone: Dealer Inquiry CTA & Mobile Toggle
            ==================================================================== */}
        <div className="flex items-center gap-3 shrink-0">
          {/* ── Direct Dealer Inquiry CTA Capsule Button ── */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
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
        <div
          className={`md:hidden pointer-events-auto transition-all duration-200 animate-in slide-in-from-top-2 ${
            isScrolled
              ? "mt-2 max-w-6xl mx-auto rounded-3xl bg-white/98 backdrop-blur-2xl shadow-2xl border border-black/[0.06] px-6 py-4"
              : "w-full border-t border-divider/60 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-xl"
          }`}
        >
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
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base transition-colors ${
                      isActive
                        ? "bg-surface text-accent font-semibold"
                        : "text-muted hover:text-primary hover:bg-surface/60 font-medium"
                    }`}
                  >
                    <span>{link.label}</span>

                    {link.badge && (
                      <span className="font-mono text-xs uppercase text-muted px-2.5 py-0.5 rounded bg-surface border border-divider/60">
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
              className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-colors"
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

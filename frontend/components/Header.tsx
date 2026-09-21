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
 * Ethereal, morphing site navigation header.
 *
 * Recent Refinements:
 * 1. Official SVG Logo: Displays the royal gold lock & wreath emblem (/logos/nafi-logo.svg).
 * 2. Increased Nav Text Size: Upgraded from 12px (text-xs) to prominent 15px (text-sm sm:text-[15px])
 *    for maximum readability and comfortable visual weight.
 * 3. Clean Text Branding: Removed color dots from brand names for a refined, minimalist aesthetic.
 * 4. Borderless Navigation: Nav items feature soft pill morphing without harsh border lines.
 * 5. Morphing Scroll Effect:
 *    - At top (scrollY === 0): Generous padding and crisp ethereal blur.
 *    - When scrolled (scrollY > 20): Smoothly morphs into a compact, floating
 *      glassmorphism dock with deeper backdrop blur (backdrop-blur-2xl)
 *      and soft ambient shadow.
 * 6. Responsive Mobile Drawer: Accessible slide-down menu with large touch targets.
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
            2. Borderless Desktop Navigation (Increased Size & Clean Text)
            ==================================================================== */}
        {/*
          Outer nav container:
          - Border line removed per user request.
          - Soft translucent background with pill curvature and gentle backdrop blur.
        */}
        <ul className="hidden md:flex items-center gap-1.5 bg-surface/70 p-1.5 rounded-full backdrop-blur-sm">
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
                  - Increased text size: text-sm sm:text-[15px] for clear, prominent visibility.
                  - Generous padding: px-4 sm:px-5 py-2.
                  - Color dots removed for a clean, sophisticated typographic look.
                  - Active state: soft white background with gentle elevation shadow.
                  - Hover state: subtle white overlay with smooth color transition.
                */}
                <Link
                  href={link.href}
                  className={`relative flex items-center px-4 sm:px-5 py-2 rounded-full text-sm sm:text-[15px] tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-white text-primary shadow-xs font-semibold"
                      : "text-muted hover:text-primary hover:bg-white/60 font-medium"
                  }`}
                >
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

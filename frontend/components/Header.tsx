"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";

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
 * Component: Header (GSAP Animated Dual-State Navigation)
 * ============================================================================
 * High-performance, GSAP-driven navigation header featuring continuous physics-based
 * morphing between two distinct visual layouts:
 *
 * 1. Unscrolled State (scrollY <= 20):
 *    - Full-width edge-to-edge layout extending directly beneath the manufacturing marquee.
 *    - GSAP sets: width: 100%, borderRadius: 0px, y: 0, boxShadow: 0 1px 0 divider line.
 *
 * 2. Scrolled State (scrollY > 20) — Floating Capsule Dock (Reference Aesthetic):
 *    - Smoothly morphs via GSAP power3.out physics into a centered, floating capsule dock.
 *    - GSAP sets: width: calc(100% - 32px), maxWidth: 1152px, borderRadius: 9999px (full pill),
 *      y: 12px (floating offset), and deep luxury drop shadow.
 *
 * 3. 3-Zone Mathematical Symmetrical Alignment:
 *    - Left Zone: Official royal gold lock SVG emblem + "Nafi Lock Industries" brand wordmark.
 *    - Center Zone: Mathematically dead-center desktop navigation (`md:absolute md:left-1/2 md:-translate-x-1/2`),
 *      with elegant gold underline indicator for the active route.
 *    - Right Zone: Royal gold "Dealer Inquiry" capsule CTA button + mobile menu toggle.
 *
 * 4. Micro-Interactions:
 *    - Synchronized GSAP micro-scaling on logo emblem and CTA button for harmonious tactile feedback.
 *    - Smooth GSAP fade-and-slide on mobile drawer menu opening.
 */
export default function Header() {
  // Read active pathname to dynamically compute active nav link state
  const pathname = usePathname();

  // State to toggle mobile navigation drawer open / closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Scroll state to trigger the GSAP header morphing animation
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /**
   * DOM References for GSAP direct element manipulation:
   * - headerRef: Outer sticky positioning wrapper
   * - dockRef: Inner nav container that morphs width, borderRadius, y, and shadow
   * - logoRef: Brand emblem for subtle micro-scaling
   * - ctaRef: Dealer inquiry button for subtle micro-scaling
   * - mobileMenuRef: Mobile drawer container for smooth GSAP slide-in
   * - isInitialRender: Guard to prevent animation flash if loaded already scrolled
   */
  const headerRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef<boolean>(true);

  /**
   * ==========================================================================
   * 1. Passive Scroll Listener Hook
   * ==========================================================================
   * Efficiently detects scroll position without layout thrashing.
   * Threshold set to 20px to cleanly separate initial resting state from active scrolling.
   */
  useEffect(() => {
    const handleScroll = () => {
      // Toggle scrolled state when passing threshold
      setIsScrolled(window.scrollY > 20);
    };

    // Evaluate initial scroll on component mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * ==========================================================================
   * 2. GSAP Morphing Animation Controller
   * ==========================================================================
   * Animates the navigation dock between full-width flat bar and floating capsule pill.
   * Uses `power3.out` easing curve for an ultra-smooth, physical hardware feel.
   */
  useEffect(() => {
    if (!dockRef.current) return;

    // Check if this is initial mount to skip animation delay on page refresh
    const isInitial = isInitialRender.current;
    if (isInitial) {
      isInitialRender.current = false;
    }

    // Set 0s duration on initial mount to prevent layout flash; 0.45s on active scroll
    const duration = isInitial ? 0 : 0.45;

    // GSAP context ensures clean teardown and prevents animation conflicts
    const ctx = gsap.context(() => {
      if (isScrolled) {
        /*
          ────────────────────────────────────────────────────────────────────
          Scrolled State: Floating Capsule Dock Animation
          ────────────────────────────────────────────────────────────────────
          - Width shrinks inward with 16px horizontal margin (calc(100% - 32px)).
          - Max width locks to 1152px (max-w-6xl) on wider viewports.
          - Border radius smoothly curves from flat 0px to complete pill (9999px).
          - Floats 12px down from top of viewport.
          - Box shadow smoothly blooms into a soft ambient glow.
          - Padding compresses slightly for an aerodynamic floating dock look.
        */
        gsap.to(dockRef.current, {
          width: "calc(100% - 32px)",
          maxWidth: 1152,
          borderRadius: 9999,
          y: 12,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 28,
          paddingRight: 28,
          boxShadow: "0px 14px 35px rgba(0, 0, 0, 0.08)",
          borderColor: "rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });

        // Micro-scale logo emblem to harmonize with compact floating dock
        if (logoRef.current) {
          gsap.to(logoRef.current, {
            scale: 0.96,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        // Micro-scale CTA button to harmonize with compact floating dock
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            scale: 0.98,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      } else {
        /*
          ────────────────────────────────────────────────────────────────────
          Unscrolled State: Full-Width Layout Animation
          ────────────────────────────────────────────────────────────────────
          - Width expands out to 100% edge-to-edge.
          - Border radius flattens out to 0px.
          - Floats back up to top (y: 0).
          - Box shadow transforms into a crisp 1px bottom divider line.
          - Padding expands for generous breathing room directly under marquee.
        */
        gsap.to(dockRef.current, {
          width: "100%",
          maxWidth: "100%",
          borderRadius: 0,
          y: 0,
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 24,
          paddingRight: 24,
          boxShadow: "0px 1px 0px rgba(229, 231, 235, 0.8)",
          borderColor: "rgba(229, 231, 235, 0)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });

        // Reset logo emblem scale
        if (logoRef.current) {
          gsap.to(logoRef.current, {
            scale: 1,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        // Reset CTA button scale
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            scale: 1,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      }
    });

    return () => ctx.revert();
  }, [isScrolled]);

  /**
   * ==========================================================================
   * 3. GSAP Mobile Drawer Transition Hook
   * ==========================================================================
   * Delivers a smooth entrance animation when the mobile drawer is opened.
   */
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -8, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [mobileMenuOpen]);

  /**
   * ==========================================================================
   * 4. Navigation Links Data
   * ==========================================================================
   * Configured per Architecture Decision #3:
   * Direct top-level representation for each flagship brand.
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
      ref={headerRef}
      className="sticky top-0 z-40 gap-2 w-full pointer-events-none flex flex-col items-center"
      aria-label="Site Header"
    >
      {/*
        ======================================================================
        GSAP-Animated Navigation Dock
        ======================================================================
        - Direct GSAP target: width, maxWidth, borderRadius, y, shadow, and padding
          are smoothly driven via GreenSock tweens.
        - Pointer events enabled specifically on dock so outer margin space is click-through.
        - Backdrop-blur-2xl produces a frosted glass effect over underlying content.
      */}
      <nav
        ref={dockRef}
        className="pointer-events-auto relative flex items-center justify-between border backdrop-blur-2xl transition-[background-color] will-change-[width,max-width,border-radius,transform]"
        style={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: "0px",
          transform: "translate3d(0, 0, 0)",
          boxShadow: "0px 1px 0px rgba(229, 231, 235, 0.8)",
          borderColor: "rgba(229, 231, 235, 0)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
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
              - Ref attached for GSAP micro-scaling.
            */}
            <div
              ref={logoRef}
              className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2 will-change-transform"
            >
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
            ref={ctaRef}
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] will-change-transform"
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
          4. Responsive Mobile Navigation Drawer (GSAP-Animated)
          ==================================================================== */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`pointer-events-auto w-full transition-all duration-300 ${
            isScrolled
              ? "mt-2 px-4 sm:px-6 max-w-6xl"
              : "px-6"
          }`}
        >
          <div
            className={`w-full bg-white/98 backdrop-blur-2xl px-6 py-4 shadow-2xl border ${
              isScrolled
                ? "rounded-3xl border-black/[0.06]"
                : "border-t border-divider/60"
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
        </div>
      )}
    </header>
  );
}

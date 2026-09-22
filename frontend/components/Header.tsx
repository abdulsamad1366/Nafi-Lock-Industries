"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { getUser, AuthUser } from "@/lib/userAuth";

/**
 * ============================================================================
 * Type Definition: NavLinkItem
 * ============================================================================
 */
interface NavLinkItem {
  href: string;
  label: string;
}

/**
 * ============================================================================
 * Component: Header (GSAP Animated Dual-State Bi-directional Navigation)
 * ============================================================================
 * High-performance, GSAP-driven navigation header featuring continuous physics-based
 * morphing in BOTH directions:
 *
 * 1. Full-Width -> Round Floating Capsule (when scrolling down)
 * 2. Round Floating Capsule -> Full-Width (when scrolling back to top)
 * 3. Navigation Links (Requested Order):
 *    - Home, S-Nafi, Raksham, Greek, Blog, Contact
 * 4. Action Button:
 *    - "Login" capsule button linking to /login (or /account / /distributor if logged in).
 */
export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef<boolean>(true);

  /**
   * 1. Passive Scroll Listener Hook
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Hydrate logged in user on mount & route change
   */
  useEffect(() => {
    setCurrentUser(getUser());
  }, [pathname]);

  /**
   * 2. Component Lifetime GSAP Context (Reverts only on component unmount)
   */
  useEffect(() => {
    const ctx = gsap.context(() => {});
    return () => ctx.revert();
  }, []);

  /**
   * 3. GSAP Bi-Directional Morphing Controller
   * Handles BOTH (full-width -> round) AND (round -> full-width) seamlessly.
   */
  useEffect(() => {
    if (!dockRef.current) return;

    // Skip animation delay on initial page load / refresh
    if (isInitialRender.current) {
      isInitialRender.current = false;
      if (isScrolled) {
        gsap.set(dockRef.current, {
          width: "calc(100% - 32px)",
          maxWidth: 1152,
          borderRadius: 40,
          y: 12,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 28,
          paddingRight: 28,
          boxShadow: "0px 14px 35px rgba(0, 0, 0, 0.08)",
          borderColor: "rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        });
        if (logoRef.current) gsap.set(logoRef.current, { scale: 0.96 });
        if (ctaRef.current) gsap.set(ctaRef.current, { scale: 0.98 });
      }
      return;
    }

    if (isScrolled) {
      /* ── Animation: Full Width -> Round Floating Pill Header ── */
      gsap.to(dockRef.current, {
        width: "calc(100% - 32px)",
        maxWidth: 1152,
        borderRadius: 40,
        y: 12,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 28,
        paddingRight: 28,
        boxShadow: "0px 14px 35px rgba(0, 0, 0, 0.08)",
        borderColor: "rgba(0, 0, 0, 0.06)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (logoRef.current) {
        gsap.to(logoRef.current, {
          scale: 0.96,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          scale: 0.98,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    } else {
      /* ── Animation: Round Floating Pill Header -> Full Width Header ── */
      const targetMaxWidth =
        typeof window !== "undefined" ? window.innerWidth : 1920;

      gsap.to(dockRef.current, {
        width: "calc(100% - 0px)",
        maxWidth: targetMaxWidth,
        borderRadius: 0,
        y: 0,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 24,
        paddingRight: 24,
        boxShadow: "0px 1px 0px rgba(229, 231, 235, 0.8)",
        borderColor: "rgba(229, 231, 235, 0)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => {
          if (dockRef.current) {
            dockRef.current.style.maxWidth = "100%";
          }
        },
      });

      if (logoRef.current) {
        gsap.to(logoRef.current, {
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }
  }, [isScrolled]);

  /**
   * 4. Mobile Drawer Transition Hook
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
   * 5. Navigation Links (Configured Exactly per User Request)
   * 1. Home
   * 2. S-Nafi
   * 3. Raksham
   * 4. Greek
   * 5. Blog
   * 6. Contact
   */
  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    { href: "/brands/s-nafi", label: "S-Nafi" },
    { href: "/brands/raksham", label: "Raksham" },
    { href: "/brands/greek", label: "Greek" },
    { href: "/blog", label: "Blog" },
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
      */}
      <nav
        ref={dockRef}
        className="pointer-events-auto relative flex items-center justify-between border backdrop-blur-2xl transition-[background-color] will-change-[width,max-width,border-radius,transform]"
        style={{
          width: "calc(100% - 0px)",
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
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Nafi Lock Industries Homepage"
          >
            <div
              ref={logoRef}
              className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2 will-change-transform"
            >
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Lock Industries Official Logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(184,146,63,0.3)]"
              />
            </div>

            <span className="font-headline text-base sm:text-lg font-bold tracking-tight text-primary flex items-center gap-1.5">
              Nafi <span className="text-accent font-serif font-normal">Lock Industries</span>
            </span>
          </Link>
        </div>

        {/* ====================================================================
            2. Center Zone: Desktop Navigation (Mathematically Dead-Center)
            ==================================================================== */}
        <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 items-center pointer-events-auto">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-[14px] tracking-wide transition-all duration-200 ${
                      isActive
                        ? "text-accent font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
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
            3. Right Zone: Login CTA Button & Mobile Toggle
            ==================================================================== */}
        <div className="flex items-center gap-3 shrink-0">
          {/* ── Direct Login CTA Capsule Button ── */}
          <Link
            ref={ctaRef}
            href={
              currentUser?.role === "DISTRIBUTOR"
                ? "/distributor"
                : currentUser
                ? "/account"
                : "/login"
            }
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] will-change-transform"
          >
            <span>
              {currentUser?.role === "DISTRIBUTOR"
                ? "Distributor Portal"
                : currentUser
                ? "My Account"
                : "Login"}
            </span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </Link>

          {/* ── Mobile Hamburger Menu Toggle Button ── */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
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
            isScrolled ? "mt-2 px-4 sm:px-6 max-w-6xl" : "px-6"
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
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Direct Mobile Login CTA */}
            <div className="mt-4 pt-4 border-t border-divider/60">
              <Link
                href={
                  currentUser?.role === "DISTRIBUTOR"
                    ? "/distributor"
                    : currentUser
                    ? "/account"
                    : "/login"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-colors"
              >
                <span>
                  {currentUser?.role === "DISTRIBUTOR"
                    ? "Distributor Portal"
                    : currentUser
                    ? "My Account"
                    : "Login"}
                </span>
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

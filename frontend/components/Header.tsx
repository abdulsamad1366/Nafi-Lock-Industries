"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { getUser, clearUserSession, AuthUser } from "@/lib/userAuth";
import MobileNavDrawer from "@/components/MobileNavDrawer";

/**
 * ============================================================================
 * Component: Header (GSAP Animated Navigation with Desktop Popover & Mobile Drawer)
 * ============================================================================
 * Desktop Navigation Structure:
 * - Left: Official Brand Logo & Name
 * - Center: Home | Brand ▾ (S-Nafi, Raksham, Greek) | Gallery | Blogs
 * - Right:
 *   - "Not a member? Register" link (/signup)
 *   - Login / Distributor Portal CTA Button
 *   - Hamburger icon (☰) triggering Desktop Popover or Mobile Drawer
 *
 * Hamburger Menu Content:
 * - If not logged in: Contact Us, Privacy Policy, Terms of Condition
 * - If logged in: Distributor Portal (all 5 tab links) + Contact Us, Privacy Policy, Terms of Condition, Sign Out
 */
export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<boolean>(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const handleCloseMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const headerRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const brandsDropdownRef = useRef<HTMLLIElement>(null);
  const brandsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
   * Click-outside & Keyboard handlers for desktop menus
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target as Node) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(e.target as Node)
      ) {
        setDesktopMenuOpen(false);
      }
      if (
        brandsDropdownRef.current &&
        !brandsDropdownRef.current.contains(e.target as Node)
      ) {
        setBrandsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDesktopMenuOpen(false);
        setBrandsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDesktopMenuOpen(false);
    setBrandsDropdownOpen(false);
  }, [pathname]);

  /**
   * 2. Component Lifetime GSAP Context
   */
  useEffect(() => {
    const ctx = gsap.context(() => {});
    return () => ctx.revert();
  }, []);

  /**
   * 3. GSAP Bi-Directional Morphing Controller
   */
  useEffect(() => {
    if (!dockRef.current) return;

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
      gsap.to(dockRef.current, {
        width: "calc(100% - 0px)",
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
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
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

  const handleBrandMouseEnter = () => {
    if (brandsTimeoutRef.current) {
      clearTimeout(brandsTimeoutRef.current);
      brandsTimeoutRef.current = null;
    }
    setBrandsDropdownOpen(true);
  };

  const handleBrandMouseLeave = () => {
    if (brandsTimeoutRef.current) {
      clearTimeout(brandsTimeoutRef.current);
    }
    brandsTimeoutRef.current = setTimeout(() => {
      setBrandsDropdownOpen(false);
    }, 400);
  };

  const handleHamburgerClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setDesktopMenuOpen((prev) => !prev);
    } else {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setDesktopMenuOpen(false);
    window.location.href = "/login";
  };

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
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-300 hover:scale-[1.01]"
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
            2. Center Zone: Desktop Navigation (Home | Brand ▾ | Gallery | Blogs | Contact Us)
            ==================================================================== */}
        <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 items-center pointer-events-auto">
          <ul className="flex items-center gap-1.5 text-xs sm:text-[14px]">
            {/* 1. Home */}
            <li>
              <Link
                href="/"
                className={`relative flex items-center px-3.5 py-1.5 rounded-full tracking-wide transition-all duration-200 ${
                  pathname === "/"
                    ? "text-accent font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
                    : "text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
                }`}
              >
                <span>Home</span>
              </Link>
            </li>

            {/* 2. Brand ▾ (Dropdown: S-Nafi, Raksham, Greek) */}
            <li
              ref={brandsDropdownRef}
              className="relative group/brand"
              onMouseEnter={handleBrandMouseEnter}
              onMouseLeave={handleBrandMouseLeave}
            >
              <button
                type="button"
                onClick={() => setBrandsDropdownOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 px-3.5 py-1.5 rounded-full tracking-wide transition-all duration-200 cursor-pointer ${
                  pathname.startsWith("/brands")
                    ? "text-accent font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
                    : "text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
                }`}
                aria-expanded={brandsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Brand</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 group-hover/brand:rotate-180 ${
                    brandsDropdownOpen ? "rotate-180 text-accent" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Brands Floating Popover Menu with Overlapping Hover Bridge */}
              <div
                className={`absolute top-full -mt-1 left-0 pt-2 w-64 z-50 transition-all duration-200 ${
                  brandsDropdownOpen
                    ? "visible opacity-100 pointer-events-auto translate-y-0"
                    : "invisible opacity-0 pointer-events-none -translate-y-1 group-hover/brand:visible group-hover/brand:opacity-100 group-hover/brand:pointer-events-auto group-hover/brand:translate-y-0"
                }`}
                onMouseEnter={handleBrandMouseEnter}
                onMouseLeave={handleBrandMouseLeave}
              >
                {/* 16px Invisible Hit Area Bridge connecting button to menu seamlessly */}
                <div className="absolute -top-2 inset-x-0 h-5 bg-transparent pointer-events-auto" />

                <div
                  className="w-full bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 p-2"
                  style={{ colorScheme: "light" }}
                >
                  <Link
                    href="/brands/s-nafi"
                    onClick={() => setBrandsDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-amber-50/70 transition-colors group/item"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9A7228]" />
                      <span className="font-serif font-bold text-xs text-gray-900 group-hover/item:text-[#9A7228]">
                        S-Nafi
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-4 mt-0.5">
                      Architectural Mortise & Brass Masters
                    </p>
                  </Link>

                  <Link
                    href="/brands/raksham"
                    onClick={() => setBrandsDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-red-50/70 transition-colors group/item"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9A2F24]" />
                      <span className="font-serif font-bold text-xs text-gray-900 group-hover/item:text-[#9A2F24]">
                        Raksham
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-4 mt-0.5">
                      Hardened Shackle & Security Padlocks
                    </p>
                  </Link>

                  <Link
                    href="/brands/greek"
                    onClick={() => setBrandsDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-sky-50/70 transition-colors group/item"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#235F8E]" />
                      <span className="font-serif font-bold text-xs text-gray-900 group-hover/item:text-[#235F8E]">
                        Greek
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-4 mt-0.5">
                      Pin Cylinders & Classical Iron Locksets
                    </p>
                  </Link>
                </div>
              </div>
            </li>

            {/* 3. Gallery */}
            <li>
              <Link
                href="/#heritage"
                className="relative flex items-center px-3.5 py-1.5 rounded-full tracking-wide transition-all duration-200 text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
              >
                <span>Gallery</span>
              </Link>
            </li>

            {/* 4. Blogs */}
            <li>
              <Link
                href="/blog"
                className={`relative flex items-center px-3.5 py-1.5 rounded-full tracking-wide transition-all duration-200 ${
                  pathname.startsWith("/blog")
                    ? "text-accent font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
                    : "text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
                }`}
              >
                <span>Blogs</span>
              </Link>
            </li>

            {/* 5. Contact Us */}
            <li>
              <Link
                href="/contact"
                className={`relative flex items-center px-3.5 py-1.5 rounded-full tracking-wide transition-all duration-200 ${
                  pathname === "/contact"
                    ? "text-accent font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
                    : "text-muted hover:text-primary hover:bg-black/[0.03] font-medium"
                }`}
              >
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* ====================================================================
            3. Right Zone: Register Link + Login CTA Button & Hamburger
            ==================================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 relative">
          {/* ── Not a member? Register link (Desktop only, when not logged in) ── */}
          {!currentUser && (
            <div className="hidden lg:flex items-center text-xs text-gray-600 font-medium select-none">
              <span>Not a member?&nbsp;</span>
              <Link
                href="/signup"
                className="text-[#9A7228] font-bold hover:underline transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* ── Direct Login / Distributor Portal CTA Capsule Button (Desktop only) ── */}
          <Link
            ref={ctaRef}
            href={
              currentUser?.role === "DISTRIBUTOR"
                ? "/distributor"
                : currentUser
                ? "/account"
                : "/login"
            }
            className="hidden lg:inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent text-white hover:bg-accent-hover shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] will-change-transform"
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

          {/* ── Animated Morphing Hamburger Menu Toggle Button ── */}
          <button
            ref={hamburgerBtnRef}
            type="button"
            id="mobile-nav-hamburger-btn"
            onClick={handleHamburgerClick}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out active:scale-90 cursor-pointer touch-manipulation group ${
              desktopMenuOpen || mobileMenuOpen
                ? "bg-amber-50 text-[#9A7228] ring-2 ring-[#9A7228]/30 shadow-xs"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 active:bg-gray-200/80"
            }`}
            aria-expanded={desktopMenuOpen || mobileMenuOpen}
            aria-label="Navigation Menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  desktopMenuOpen || mobileMenuOpen
                    ? "rotate-45 translate-y-[7px]"
                    : "translate-y-0 rotate-0 group-hover:scale-x-90"
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-current rounded-full transition-all duration-200 ease-out ${
                  desktopMenuOpen || mobileMenuOpen
                    ? "opacity-0 scale-x-0"
                    : "opacity-100 scale-x-100 group-hover:scale-x-110"
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  desktopMenuOpen || mobileMenuOpen
                    ? "-rotate-45 -translate-y-[7px]"
                    : "translate-y-0 rotate-0 group-hover:scale-x-90"
                }`}
              />
            </div>
          </button>

          {/* ── Desktop Hamburger Popover Dropdown Menu (With Spring Physics & Micro-Interactions) ── */}
          <div
            ref={desktopMenuRef}
            className={`hidden lg:block absolute right-0 top-full mt-2.5 w-72 bg-white/95 backdrop-blur-xl text-gray-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-gray-100/90 p-2.5 z-50 origin-top-right transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              desktopMenuOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
            }`}
            style={{ colorScheme: "light" }}
          >
            {currentUser ? (
              <>
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                    Distributor Portal
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* 1. Company Profile */}
                <Link
                  href="/distributor"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                      Company Profile
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                {/* 2. Liked Locks */}
                <Link
                  href="/distributor/liked"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                      Liked Locks
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                {/* 3. Orders */}
                <Link
                  href="/distributor/orders"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                      Purchase Orders
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                {/* 4. Ledger */}
                <Link
                  href="/distributor/ledger"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                      Account Ledger
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                {/* 5. Catalog Downloads */}
                <Link
                  href="/distributor/downloads"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                      Catalog Downloads
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                <div className="my-1.5 border-t border-dashed border-gray-200" />
              </>
            ) : null}

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={() => setDesktopMenuOpen(false)}
              className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                  Contact Us
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            <div className="my-1.5 border-t border-dashed border-gray-200" />

            {/* Privacy Policy */}
            <Link
              href="/privacy"
              onClick={() => setDesktopMenuOpen(false)}
              className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                  Privacy Policy
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {/* Terms of Condition */}
            <Link
              href="/terms"
              onClick={() => setDesktopMenuOpen(false)}
              className="group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-serif text-gray-700 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-200 hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-[#9A7228] transition-colors">
                  Terms of Condition
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {currentUser && (
              <>
                <div className="my-1.5 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group w-full text-left px-3 py-2 rounded-2xl text-xs font-serif text-rose-600 hover:bg-rose-50 active:scale-[0.98] transition-all duration-200 hover:translate-x-1 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </div>
                    <span className="font-semibold">Sign Out of Account</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-rose-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ====================================================================
          4. Responsive Full-Screen Mobile Navigation Drawer (Window Slide)
          ==================================================================== */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        currentUser={currentUser}
      />
    </header>
  );
}

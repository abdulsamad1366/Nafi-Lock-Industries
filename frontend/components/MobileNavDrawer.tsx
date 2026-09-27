"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser, clearUserSession } from "@/lib/userAuth";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  currentUser,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Accordion state for expandable menu items
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Location selector state
  const [locationPill, setLocationPill] = useState("All Locations");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Dark / Light theme toggle state
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize theme from document or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("nafi_theme_mode");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.setAttribute("data-mode", "dark");
      }
    }
  }, []);

  const toggleTheme = (targetDark: boolean) => {
    setIsDarkMode(targetDark);
    if (targetDark) {
      document.documentElement.setAttribute("data-mode", "dark");
      localStorage.setItem("nafi_theme_mode", "dark");
    } else {
      document.documentElement.removeAttribute("data-mode");
      localStorage.setItem("nafi_theme_mode", "light");
    }
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsLocationOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close drawer on route change (only when route actually changes)
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleLogout = () => {
    clearUserSession();
    onClose();
    router.push("/login");
  };

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "aligarh", label: "Aligarh Foundry (HQ)" },
    { id: "delhi", label: "Delhi Freight Hub" },
    { id: "mumbai", label: "Mumbai Commercial Hub" },
  ];

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] pointer-events-auto transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* ── 1. Semi-Transparent Backdrop Overlay ── */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* ── 2. Full-Screen Sliding Drawer Window (Cover Screen) ── */}
      <div
        className={`fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:max-w-md bg-white dark:bg-[#13151b] flex flex-col shadow-2xl transition-transform duration-300 ease-out z-[10000] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header Banner Bar (Matched to Reference Styling with Brand Colors) ── */}
        <div className="bg-[#9A7228] text-white px-4 py-3 sm:py-3.5 flex items-center justify-between shadow-md shrink-0 relative select-none">
          {/* Brand Monogram / Emblem */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 group touch-manipulation"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center p-1 shadow-2xs group-hover:bg-white/30 transition-colors overflow-hidden">
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Crest"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif font-bold text-sm tracking-wide hidden xs:inline">
              Nafi Lock
            </span>
          </Link>

          {/* Location / Territory Selector Capsule Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocationOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#9A7228] font-serif font-bold text-xs shadow-xs hover:bg-white/95 active:scale-95 transition-all touch-manipulation cursor-pointer"
            >
              <span className="truncate max-w-[140px]">{locationPill}</span>
              <svg
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                  isLocationOpen ? "rotate-180" : ""
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

            {/* Location Dropdown Popover */}
            {isLocationOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white text-primary rounded-2xl shadow-2xl border border-divider p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <span className="block px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-muted font-bold">
                  Dispatch Depots
                </span>
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setLocationPill(loc.label);
                      setIsLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-serif transition-colors flex items-center justify-between ${
                      locationPill === loc.label
                        ? "bg-accent/10 text-accent font-bold"
                        : "hover:bg-surface text-primary"
                    }`}
                  >
                    <span>{loc.label}</span>
                    {locationPill === loc.label && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close 'X' Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white transition-colors touch-manipulation cursor-pointer"
            aria-label="Close Navigation"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable Body Area ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-1">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/"
                ? "bg-accent/10 text-accent font-bold"
                : "text-primary hover:bg-surface/80"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Home</span>
            </div>
          </Link>

          {/* 2. Brands (Expandable Accordion) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("brands")}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                pathname.startsWith("/brands")
                  ? "bg-accent/10 text-accent font-bold"
                  : "text-primary hover:bg-surface/80"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Our Brands</span>
              </div>
              <svg
                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                  expandedSection === "brands" ? "rotate-180 text-accent" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === "brands" && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/brands/s-nafi"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  <span className="font-bold text-primary block">S-Nafi</span>
                  <span className="text-[11px] opacity-75">Architectural Mortise & Brass Masters</span>
                </Link>
                <Link
                  href="/brands/raksham"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  <span className="font-bold text-primary block">Raksham</span>
                  <span className="text-[11px] opacity-75">Hardened Shackle & Security Padlocks</span>
                </Link>
                <Link
                  href="/brands/greek"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  <span className="font-bold text-primary block">Greek</span>
                  <span className="text-[11px] opacity-75">Pin Cylinders & Classical Iron Locksets</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Lock Catalog (Expandable Accordion) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("catalog")}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                pathname === "/#catalog" || pathname.startsWith("/products")
                  ? "bg-accent/10 text-accent font-bold"
                  : "text-primary hover:bg-surface/80"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Lock Catalog</span>
              </div>
              <svg
                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                  expandedSection === "catalog" ? "rotate-180 text-accent" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === "catalog" && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Padlocks & Brass Shackle Locks
                </Link>
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Mortise Locks & Door Hardware
                </Link>
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Cylindrical Knob Locks
                </Link>
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Armored Heavy-Duty Security Locks
                </Link>
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif font-bold text-accent hover:underline"
                >
                  View Complete Catalog →
                </Link>
              </div>
            )}
          </div>

          {/* 4. Distributor Portal (Expandable Accordion) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("distributor")}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                pathname.startsWith("/distributor")
                  ? "bg-accent/10 text-accent font-bold"
                  : "text-primary hover:bg-surface/80"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-serif text-sm font-semibold block">Distributor Hub</span>
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                  expandedSection === "distributor" ? "rotate-180 text-accent" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === "distributor" && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/distributor"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  B2B Company Profile
                </Link>
                <Link
                  href="/distributor/orders"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Track Purchase Orders
                </Link>
                <Link
                  href="/distributor/ledger"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Account Ledger & Invoices
                </Link>
                <Link
                  href="/distributor/liked"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Liked Catalog Locks
                </Link>
                <Link
                  href="/distributor/downloads"
                  onClick={onClose}
                  className="block px-3 py-1.5 rounded-xl text-xs font-serif text-muted hover:text-accent hover:bg-surface transition-colors"
                >
                  Catalog Downloads & PDFs
                </Link>
              </div>
            )}
          </div>

          {/* 5. Foundry Gallery & Heritage */}
          <Link
            href="/#heritage"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-2xl text-primary hover:bg-surface/80 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Foundry Gallery</span>
            </div>
          </Link>

          {/* 6. Craft & Engineering Specs */}
          <Link
            href="/#process"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-2xl text-primary hover:bg-surface/80 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <path d="M22 6h-2v4a2 2 0 01-2 2h-4v8a2 2 0 01-2 2h0a2 2 0 01-2-2v-8H6a2 2 0 01-2-2V6H2" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Engineering Specs</span>
            </div>
          </Link>

          {/* 7. Technical Journal & Blogs */}
          <Link
            href="/blog"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname.startsWith("/blog")
                ? "bg-accent/10 text-accent font-bold"
                : "text-primary hover:bg-surface/80"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Blogs & Articles</span>
            </div>
          </Link>

          {/* 8. Contact Us & Support */}
          <Link
            href="/contact"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/contact"
                ? "bg-accent/10 text-accent font-bold"
                : "text-primary hover:bg-surface/80"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Contact Us</span>
            </div>
          </Link>

          {/* ── Subtle Dashed Divider (Matched to Reference) ── */}
          <div className="pt-3 pb-1">
            <div className="border-t border-dashed border-divider" />
          </div>

          {/* 9. Privacy Policy */}
          <Link
            href="/privacy"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-2xl text-primary hover:bg-surface/80 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Privacy Policy</span>
            </div>
          </Link>

          {/* 10. Terms of Service */}
          <Link
            href="/terms"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-2xl text-primary hover:bg-surface/80 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Terms of Service</span>
            </div>
          </Link>

          {/* ── Another Subtle Divider ── */}
          <div className="pt-2 pb-1">
            <div className="border-t border-divider/60" />
          </div>

          {/* 11. Theme Switcher Row (Matched to Reference Layout with Sun & Moon Icons) ── */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.64 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-4 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold text-primary">Theme</span>
            </div>

            {/* Sun / Moon Switch Capsule */}
            <div className="flex items-center p-1 bg-surface border border-divider rounded-full shadow-2xs">
              <button
                type="button"
                onClick={() => toggleTheme(false)}
                className={`p-1.5 rounded-full transition-all touch-manipulation cursor-pointer ${
                  !isDarkMode
                    ? "bg-white text-amber-500 shadow-xs"
                    : "text-muted hover:text-primary"
                }`}
                title="Light Mode"
                aria-label="Switch to Light Theme"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => toggleTheme(true)}
                className={`p-1.5 rounded-full transition-all touch-manipulation cursor-pointer ${
                  isDarkMode
                    ? "bg-[#181b21] text-accent shadow-xs"
                    : "text-muted hover:text-primary"
                }`}
                title="Dark Mode"
                aria-label="Switch to Dark Theme"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Sticky Action Button (Matched to Reference Sign In Pill) ── */}
        <div className="p-4 sm:p-5 border-t border-divider bg-surface/95 backdrop-blur-md shrink-0 space-y-2">
          {currentUser ? (
            <>
              <Link
                href={currentUser.role === "DISTRIBUTOR" ? "/distributor" : "/account"}
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-full bg-[#9A7228] hover:bg-[#85601E] active:scale-[0.99] text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>
                  {currentUser.role === "DISTRIBUTOR"
                    ? "Distributor Portal"
                    : "My Account"}
                </span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-1.5 text-xs font-mono text-muted hover:text-rose-500 transition-colors cursor-pointer touch-manipulation"
              >
                Sign Out of Account
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-full bg-[#9A7228] hover:bg-[#85601E] active:scale-[0.99] text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <span>Sign In</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

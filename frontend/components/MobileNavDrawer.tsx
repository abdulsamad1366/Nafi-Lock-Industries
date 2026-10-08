"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser, clearUserSession } from "@/lib/userAuth";
import { useOrderCart } from "@/components/OrderCartProvider";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
}

/**
 * ============================================================================
 * Component: MobileNavDrawer (Responsive Sliding Navigation Drawer)
 * ============================================================================
 * Matches exact mobile specifications:
 *
 * IF NOT LOGIN:
 * - Header Bar: LOGO + NAME + Close button
 * - Menu list:
 *   1. HOME (/)
 *   2. OUR BRANDS { S-Nafi, Raksham, Greek } (Expandable accordion)
 *   3. GALLERY (/#heritage)
 *   4. BLOGS & ARTICLES (/blog)
 *   5. CONTACT US (/contact)
 *   6. PRIVACY POLICY (/privacy)
 *   7. TERMS OF CONDITION (/terms)
 * - Bottom Action: LOGIN (/login)
 *
 * IF LOGIN:
 * - Header Bar: LOGO + NAME + Close button
 * - Menu list:
 *   1. HOME (/)
 *   2. OUR BRANDS { S-Nafi, Raksham, Greek } (Expandable accordion)
 *   3. DISTRIBUTOR PORTAL { Profile, Orders, Ledger, Liked, Downloads } (Expandable accordion)
 *   4. GALLERY (/#heritage)
 *   5. BLOGS & ARTICLES (/blog)
 *   6. CONTACT US (/contact)
 *   7. PRIVACY POLICY (/privacy)
 *   8. TERMS OF CONDITION (/terms)
 * - Bottom Actions:
 *   - DISTRIBUTOR PORTAL CTA button (/distributor)
 *   - SIGN OUT button (clearUserSession)
 * ============================================================================
 */
export default function MobileNavDrawer({
  isOpen,
  onClose,
  currentUser,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openDrawer, itemCount } = useOrderCart();
  const [mounted, setMounted] = useState(false);

  // Accordion state for expandable menu items ("brands" or "distributor")
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
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

  // Close drawer on route change
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

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-[visibility] ${
        isOpen ? "visible pointer-events-auto delay-0" : "invisible pointer-events-none delay-350"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* ── 1. Semi-Transparent Backdrop Overlay (Smooth Fade) ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-350 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── 2. Full-Screen Sliding Drawer Window with Silky Spring Motion ── */}
      <div
        className={`fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:max-w-md bg-white text-gray-900 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.25)] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] z-[10000] will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ colorScheme: "light" }}
      >
        {/* ── Header Bar: Logo + Name + Animated Close Button ── */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-xs shrink-0 select-none">
          {/* Official Brand Identity (Exact match to Website Header) */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Nafi Lock Industries Homepage"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:scale-105 will-change-transform">
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Lock Industries Official Logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(184,146,63,0.3)]"
              />
            </div>
            <span className="font-headline text-base sm:text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
              Nafi <span className="text-[#9A7228] font-serif font-normal">Lock Industries</span>
            </span>
          </Link>

          {/* Close 'X' Button with smooth spin and tap feedback */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:rotate-90 active:scale-90 transition-all duration-300 touch-manipulation cursor-pointer flex items-center justify-center -mr-1"
            aria-label="Close Navigation Menu"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* ── Scrollable Body Area with Cascading Staggered Items ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-1 bg-white">
          {/* 1. HOME */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? "translate-x-0 opacity-100 delay-[60ms]" : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname === "/"
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Home</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* 2. PRODUCTS CATALOG */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? "translate-x-0 opacity-100 delay-[60ms]" : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/products"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname === "/products"
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Products Catalog</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* 3. OUR BRANDS (Expandable Accordion: S-Nafi, Raksham, Greek) */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? "translate-x-0 opacity-100 delay-[90ms]" : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection("brands")}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.99] group ${
                pathname.startsWith("/brands")
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Our Brands</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  expandedSection === "brands" ? "rotate-180 text-[#9A7228]" : ""
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

            {/* Smooth CSS Grid Height Accordion Expansion */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                expandedSection === "brands"
                  ? "grid-rows-[1fr] opacity-100 mt-1"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden pl-14 pr-2 space-y-1">
                <Link
                  href="/brands/s-nafi"
                  onClick={onClose}
                  className="group block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9A7228] group-hover:scale-125 transition-transform duration-200" />
                      <span className="font-bold text-gray-900 group-hover:text-[#9A7228] transition-colors block">S-Nafi</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Architectural Mortise & Brass Masters
                  </span>
                </Link>
                <Link
                  href="/brands/raksham"
                  onClick={onClose}
                  className="group block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9A2F24] group-hover:scale-125 transition-transform duration-200" />
                      <span className="font-bold text-gray-900 group-hover:text-[#9A7228] transition-colors block">Raksham</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Hardened Shackle & Security Padlocks
                  </span>
                </Link>
                <Link
                  href="/brands/greek"
                  onClick={onClose}
                  className="group block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#235F8E] group-hover:scale-125 transition-transform duration-200" />
                      <span className="font-bold text-gray-900 group-hover:text-[#9A7228] transition-colors block">Greek</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Pin Cylinders & Classical Iron Locksets
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. DISTRIBUTOR PORTAL { ALL LINK } (Rendered ONLY IF Logged In) */}
          {currentUser && (
            <div
              className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
                isOpen ? "translate-x-0 opacity-100 delay-[120ms]" : "translate-x-6 opacity-0 delay-0"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("distributor")}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.99] group ${
                  pathname.startsWith("/distributor")
                    ? "bg-amber-50 text-[#9A7228] font-bold"
                    : "text-gray-900 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="font-serif text-sm font-semibold block">Distributor Portal</span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    expandedSection === "distributor" ? "rotate-180 text-[#9A7228]" : ""
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

              {/* Smooth CSS Grid Height Accordion Expansion */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  expandedSection === "distributor"
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden pl-14 pr-2 space-y-1">
                  <Link
                    href="/distributor"
                    onClick={onClose}
                    className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                  >
                    <span>B2B Company Profile</span>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                  <Link
                    href="/distributor/orders"
                    onClick={onClose}
                    className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                  >
                    <span>Track Purchase Orders</span>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openDrawer();
                    }}
                    className="w-full group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1 cursor-pointer text-left"
                  >
                    <span>Order Cart</span>
                    {itemCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#9A7228] text-white">
                        {itemCount}
                      </span>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </button>
                  <Link
                    href="/distributor/liked"
                    onClick={onClose}
                    className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                  >
                    <span>Liked Catalog Locks</span>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                  <Link
                    href="/distributor/downloads"
                    onClick={onClose}
                    className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 active:scale-[0.98] transition-all duration-150 hover:translate-x-1"
                  >
                    <span>Catalog Downloads & PDFs</span>
                    <svg className="w-3.5 h-3.5 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 4. GALLERY */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? (currentUser ? "translate-x-0 opacity-100 delay-[150ms]" : "translate-x-0 opacity-100 delay-[120ms]") : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/#heritage"
              onClick={onClose}
              className="group flex items-center justify-between p-2.5 rounded-2xl text-gray-900 hover:bg-amber-50/50 hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Gallery</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* 5. BLOGS & ARTICLES */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? (currentUser ? "translate-x-0 opacity-100 delay-[180ms]" : "translate-x-0 opacity-100 delay-[150ms]") : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/blog"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname.startsWith("/blog")
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Blogs & Articles</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* 6. CONTACT US */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? (currentUser ? "translate-x-0 opacity-100 delay-[210ms]" : "translate-x-0 opacity-100 delay-[180ms]") : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/contact"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname === "/contact"
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Contact Us</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* ── Subtle Dashed Divider ── */}
          <div className="pt-3 pb-1">
            <div className="border-t border-dashed border-gray-200" />
          </div>

          {/* 7. PRIVACY POLICY */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? (currentUser ? "translate-x-0 opacity-100 delay-[240ms]" : "translate-x-0 opacity-100 delay-[210ms]") : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/privacy"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname === "/privacy"
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Privacy Policy</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* 8. TERMS OF CONDITION */}
          <div
            className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
              isOpen ? (currentUser ? "translate-x-0 opacity-100 delay-[270ms]" : "translate-x-0 opacity-100 delay-[240ms]") : "translate-x-6 opacity-0 delay-0"
            }`}
          >
            <Link
              href="/terms"
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                pathname === "/terms"
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className="font-serif text-sm font-semibold">Terms of Condition</span>
              </div>
              <svg className="w-4 h-4 text-[#9A7228] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Bottom Sticky Action Buttons with Lift & Shimmer Motion ── */}
        <div
          className={`p-4 sm:p-5 border-t border-gray-100 bg-white/95 backdrop-blur-md shrink-0 space-y-2 transition-all duration-300 ease-out will-change-[transform,opacity] ${
            isOpen ? "translate-y-0 opacity-100 delay-[300ms]" : "translate-y-4 opacity-0 delay-0"
          }`}
        >
          {currentUser ? (
            <>
              {/* DISTRIBUTOR PORTAL CTA */}
              <Link
                href="/distributor"
                onClick={onClose}
                className="relative overflow-hidden group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#9A7228] via-[#B8923F] to-[#9A7228] bg-[length:200%_auto] hover:bg-right active:scale-[0.97] hover:shadow-xl text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
              >
                {/* Silky light sweep sheen on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10">Distributor Portal</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* SIGN OUT BUTTON (Styled just like Login) */}
              <button
                type="button"
                onClick={handleLogout}
                className="group w-full py-2.5 px-6 rounded-full border border-gray-200 hover:border-rose-300 bg-gray-50/80 hover:bg-rose-50/50 text-gray-800 hover:text-rose-600 active:scale-[0.97] font-serif font-semibold text-xs sm:text-sm tracking-wide text-center transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>Sign Out</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:rotate-12 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              {/* DIRECT 'BECOME A DISTRIBUTOR' PRIMARY CAPSULE BUTTON */}
              <Link
                href="/signup?role=distributor"
                onClick={onClose}
                className="relative overflow-hidden group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#9A7228] via-[#B8923F] to-[#9A7228] bg-[length:200%_auto] hover:bg-right active:scale-[0.97] hover:shadow-xl text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
              >
                {/* Silky light sweep sheen on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                <span className="relative z-10">Become a Distributor</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200 ml-0.5 opacity-80 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* LOGIN BUTTON */}
              <Link
                href="/login"
                onClick={onClose}
                className="group w-full py-2.5 px-6 rounded-full border border-gray-200 hover:border-[#9A7228] bg-gray-50/80 hover:bg-amber-50/50 text-gray-800 hover:text-[#9A7228] active:scale-[0.97] font-serif font-semibold text-xs sm:text-sm tracking-wide text-center transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>Login</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

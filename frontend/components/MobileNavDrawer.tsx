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
        className={`fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:max-w-md bg-white text-gray-900 flex flex-col shadow-2xl transition-transform duration-300 ease-out z-[10000] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ colorScheme: "light" }}
      >
        {/* ── Header Bar: Logo + Name + Close Button ── */}
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

          {/* Close 'X' Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition-all touch-manipulation cursor-pointer"
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

        {/* ── Scrollable Body Area ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-1 bg-white">
          {/* 1. HOME */}
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/"
                ? "bg-amber-50 text-[#9A7228] font-bold"
                : "text-gray-900 hover:bg-amber-50/50"
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

          {/* 2. OUR BRANDS (Expandable Accordion: S-Nafi, Raksham, Greek) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("brands")}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                pathname.startsWith("/brands")
                  ? "bg-amber-50 text-[#9A7228] font-bold"
                  : "text-gray-900 hover:bg-amber-50/50"
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
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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

            {expandedSection === "brands" && (
              <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/brands/s-nafi"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9A7228]" />
                    <span className="font-bold text-gray-900 block">S-Nafi</span>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Architectural Mortise & Brass Masters
                  </span>
                </Link>
                <Link
                  href="/brands/raksham"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9A2F24]" />
                    <span className="font-bold text-gray-900 block">Raksham</span>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Hardened Shackle & Security Padlocks
                  </span>
                </Link>
                <Link
                  href="/brands/greek"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#235F8E]" />
                    <span className="font-bold text-gray-900 block">Greek</span>
                  </div>
                  <span className="text-[11px] text-gray-500 pl-4 mt-0.5 block">
                    Pin Cylinders & Classical Iron Locksets
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. DISTRIBUTOR PORTAL { ALL LINK } (Rendered ONLY IF Logged In) */}
          {currentUser && (
            <div>
              <button
                type="button"
                onClick={() => toggleSection("distributor")}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                  pathname.startsWith("/distributor")
                    ? "bg-amber-50 text-[#9A7228] font-bold"
                    : "text-gray-900 hover:bg-amber-50/50"
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
                    <span className="font-serif text-sm font-semibold block">Distributor Portal</span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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

              {expandedSection === "distributor" && (
                <div className="pl-14 pr-2 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/distributor"
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                  >
                    B2B Company Profile
                  </Link>
                  <Link
                    href="/distributor/orders"
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                  >
                    Track Purchase Orders
                  </Link>
                  <Link
                    href="/distributor/ledger"
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                  >
                    Account Ledger & Invoices
                  </Link>
                  <Link
                    href="/distributor/liked"
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                  >
                    Liked Catalog Locks
                  </Link>
                  <Link
                    href="/distributor/downloads"
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-xl text-xs font-serif text-gray-600 hover:text-[#9A7228] hover:bg-amber-50/60 transition-colors"
                  >
                    Catalog Downloads & PDFs
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 4. GALLERY */}
          <Link
            href="/#heritage"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-2xl text-gray-900 hover:bg-amber-50/50 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold">Gallery</span>
            </div>
          </Link>

          {/* 5. BLOGS & ARTICLES */}
          <Link
            href="/blog"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname.startsWith("/blog")
                ? "bg-amber-50 text-[#9A7228] font-bold"
                : "text-gray-900 hover:bg-amber-50/50"
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

          {/* 6. CONTACT US */}
          <Link
            href="/contact"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/contact"
                ? "bg-amber-50 text-[#9A7228] font-bold"
                : "text-gray-900 hover:bg-amber-50/50"
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

          {/* ── Subtle Dashed Divider ── */}
          <div className="pt-3 pb-1">
            <div className="border-t border-dashed border-gray-200" />
          </div>

          {/* 7. PRIVACY POLICY */}
          <Link
            href="/privacy"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/privacy"
                ? "bg-amber-50 text-[#9A7228] font-bold"
                : "text-gray-900 hover:bg-amber-50/50"
            }`}
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

          {/* 8. TERMS OF CONDITION */}
          <Link
            href="/terms"
            onClick={onClose}
            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
              pathname === "/terms"
                ? "bg-amber-50 text-[#9A7228] font-bold"
                : "text-gray-900 hover:bg-amber-50/50"
            }`}
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
              <span className="font-serif text-sm font-semibold">Terms of Condition</span>
            </div>
          </Link>
        </div>

        {/* ── Bottom Sticky Action Buttons ── */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white/95 backdrop-blur-md shrink-0 space-y-2">
          {currentUser ? (
            <>
              {/* DISTRIBUTOR PORTAL CTA */}
              <Link
                href="/distributor"
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-full bg-[#9A7228] hover:bg-[#85601E] active:scale-[0.99] text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>Distributor Portal</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* SIGN OUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2 text-xs font-mono font-medium text-gray-500 hover:text-rose-600 transition-colors cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            /* LOGIN CTA */
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-full bg-[#9A7228] hover:bg-[#85601E] active:scale-[0.99] text-white font-serif font-bold text-sm tracking-wide text-center shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <span>Login</span>
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

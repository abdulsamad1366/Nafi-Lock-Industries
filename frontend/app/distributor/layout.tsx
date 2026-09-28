"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  getUser,
  isUserLoggedIn,
  clearUserSession,
  getDistributorStatus,
  setDistributorStatus,
  DistributorStatus,
  AuthUser,
} from "@/lib/userAuth";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import { useOrderCart } from "@/components/OrderCartProvider";

function CartBadgeButton() {
  const { openDrawer, itemCount, subtotal } = useOrderCart();
  return (
    <button
      onClick={openDrawer}
      className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent text-background font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm cursor-pointer shrink-0"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Order Cart ({itemCount})</span>
      <span className="sm:hidden font-mono font-bold">Cart ({itemCount})</span>
      {subtotal > 0 && (
        <span className="font-mono font-normal opacity-90 pl-1 border-l border-background/30 hidden xs:inline">
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      )}
    </button>
  );
}

function DistributorLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { openDrawer, itemCount } = useOrderCart();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [profileData, setProfileData] = useState<DistributorMeResponse | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/login?redirect=/distributor");
      return;
    }

    const currentUser = getUser();
    if (currentUser?.role !== "DISTRIBUTOR") {
      clearUserSession();
      router.push("/login?redirect=/distributor");
      return;
    }

    setUserState(currentUser);

    // Live status re-check: in case status was revoked after login
    getDistributorProfile()
      .then((data) => {
        const liveStatus = data.distributorProfile?.status || null;
        if (liveStatus !== "APPROVED") {
          clearUserSession();
          router.push("/login");
          return;
        }
        setProfileData(data);
        setDistributorStatus(liveStatus);
        setIsChecking(false);
      })
      .catch((err) => {
        console.error("Failed to validate distributor approval status", err);
        clearUserSession();
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearUserSession();
    router.push("/");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted">
            Validating B2B Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Navigation Links for approved distributors (Catalog is browsed on main web)
  const navLinks = [
    { href: "/distributor", label: "Company Profile", icon: "user" },
    { href: "/distributor/orders", label: "My Orders", icon: "box" },
    { href: "/distributor/ledger", label: "Account Ledger", icon: "file" },
    { href: "/distributor/downloads", label: "Catalog Downloads", icon: "download" },
    { href: "/distributor/liked", label: "Liked Locks", icon: "heart" },
  ];

  return (
    <div className="min-h-screen bg-background pt-2 sm:pt-6 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ── Desktop Top Header Console ── */}
        <div className="hidden lg:block sticky top-20 sm:top-24 z-30 bg-surface/95 backdrop-blur-md border border-divider rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 mb-5 sm:mb-8 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Company Initials Monogram Badge */}
              <div className="w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-serif font-bold text-lg shrink-0 shadow-2xs">
                {(profileData?.distributorProfile?.companyName || user?.name || "D").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-accent text-background">
                    Distributor Portal
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Active
                  </span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary mt-0.5 truncate">
                  {profileData?.distributorProfile?.companyName || user?.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <CartBadgeButton />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-serif font-semibold rounded-full bg-background border border-divider text-muted hover:text-rose-500 hover:border-rose-500/30 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0 touch-manipulation"
              >
                <span>Sign Out</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Body Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Navigation Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="bg-surface border border-divider rounded-3xl p-3 space-y-1 shadow-xs sticky top-48 sm:top-52">
              <div className="px-3 py-2 mb-2 border-b border-divider/60 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
                  Navigation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              {navLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/distributor" && pathname === "/distributor/profile") ||
                  (item.href === "/distributor/orders" && pathname?.startsWith("/distributor/orders")) ||
                  (item.href === "/distributor/downloads" && pathname?.startsWith("/distributor/downloads"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-serif transition-all ${
                      isActive
                        ? "bg-accent text-background font-bold shadow-xs scale-[1.01]"
                        : "text-muted hover:text-primary hover:bg-background/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon === "box" && (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      )}
                      {item.icon === "file" && (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      )}
                      {item.icon === "download" && (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      )}
                      {item.icon === "heart" && (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )}
                      {item.icon === "user" && (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-background" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main View Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>

      {/* ── Persistent Mobile Bottom App Bar (Ergonomic Touch Targets) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-divider px-2 py-1.5 shadow-2xl safe-area-pb">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* 1. Profile */}
          <Link
            href="/distributor"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-serif transition-colors touch-manipulation ${
              pathname === "/distributor" || pathname === "/distributor/profile"
                ? "text-accent font-bold"
                : "text-muted hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </Link>

          {/* 2. Orders */}
          <Link
            href="/distributor/orders"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-serif transition-colors touch-manipulation ${
              pathname?.startsWith("/distributor/orders") ? "text-accent font-bold" : "text-muted hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Orders</span>
          </Link>

          {/* 3. Ledger */}
          <Link
            href="/distributor/ledger"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-serif transition-colors touch-manipulation ${
              pathname === "/distributor/ledger" ? "text-accent font-bold" : "text-muted hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Ledger</span>
          </Link>

          {/* 4. Downloads */}
          <Link
            href="/distributor/downloads"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-serif transition-colors touch-manipulation ${
              pathname?.startsWith("/distributor/downloads")
                ? "text-accent font-bold"
                : "text-muted hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Downloads</span>
          </Link>

          {/* 5. Liked */}
          <Link
            href="/distributor/liked"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-serif transition-colors touch-manipulation ${
              pathname === "/distributor/liked" ? "text-accent font-bold" : "text-muted hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Liked</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DistributorLayoutInner>{children}</DistributorLayoutInner>;
}

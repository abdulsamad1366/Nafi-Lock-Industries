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
import { OrderCartProvider, useOrderCart } from "@/components/OrderCartProvider";
import OrderCartDrawer from "@/components/OrderCartDrawer";

function CartBadgeButton() {
  const { openDrawer, itemCount, subtotal } = useOrderCart();
  return (
    <button
      onClick={openDrawer}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent text-background font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span>Order Cart ({itemCount})</span>
      {subtotal > 0 && (
        <span className="font-mono font-normal opacity-90 pl-1 border-l border-background/30">
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      )}
    </button>
  );
}

function DistributorLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
      router.push("/account");
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

  // Navigation Links for approved distributors
  const navLinks = [
    { href: "/distributor", label: "Overview", icon: "dashboard" },
    { href: "/distributor/catalog", label: "Dealer Catalog", icon: "catalog" },
    { href: "/distributor/orders", label: "My Orders", icon: "box" },
    { href: "/distributor/ledger", label: "Account Ledger", icon: "file" },
    { href: "/distributor/downloads", label: "Catalog Downloads", icon: "download" },
    { href: "/distributor/liked", label: "Liked Locks", icon: "heart" },
    { href: "/distributor/profile", label: "Company Profile", icon: "user" },
  ];

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Distributor Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-divider gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-accent text-background">
                Authorized Distributor Hub
              </span>
              <span className="text-xs text-muted font-mono">
                {profileData?.distributorProfile?.companyName || user?.name}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
              {profileData?.distributorProfile?.companyName || user?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <CartBadgeButton />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-surface border border-divider text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="bg-surface border border-divider rounded-2xl p-3 space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-serif font-medium transition-all ${
                      isActive
                        ? "bg-accent text-background font-bold shadow-xs"
                        : "text-muted hover:text-primary hover:bg-background"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span>→</span>}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main View Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>

      {/* Global Slide-out Order Cart Drawer */}
      <OrderCartDrawer />
    </div>
  );
}

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderCartProvider>
      <DistributorLayoutInner>{children}</DistributorLayoutInner>
    </OrderCartProvider>
  );
}

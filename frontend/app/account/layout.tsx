"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getUser, isUserLoggedIn, clearUserSession, AuthUser } from "@/lib/userAuth";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/login?redirect=/account");
      return;
    }
    setUserState(getUser());
    setIsChecking(false);
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
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/account", label: "Overview", icon: "dashboard" },
    { href: "/account/liked", label: "Liked Locks", icon: "heart" },
    { href: "/account/inquiries", label: "Inquiry History", icon: "chat" },
    { href: "/account/profile", label: "Account Profile", icon: "user" },
  ];

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-divider gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-accent/15 text-accent">
                Customer Account
              </span>
              <span className="text-xs text-muted font-mono">{user?.email}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
              Welcome, {user?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "CUSTOMER" && (
              <Link
                href="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-background transition-colors shadow-xs"
              >
                Apply for Wholesale Distributorship →
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-surface border border-divider text-muted hover:text-primary hover:border-divider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Account Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
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

          {/* Main Content Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

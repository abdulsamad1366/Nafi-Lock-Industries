"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, AuthUser } from "@/lib/userAuth";

export default function AccountOverviewPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
            Personal Dashboard
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-3">
            Hardware Engineering & Specifications Desk
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
            Review your saved architectural lock models, explore the master product line, or submit direct engineering and quotation requests to the Nafi Lock Industries factory team.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/#catalog"
              className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
            >
              Explore Master Catalog →
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors"
            >
              Contact Engineering Desk
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Overview Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Liked Products */}
        <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-base text-primary mb-1">
              Liked Products
            </h3>
            <p className="text-xs text-muted mb-4">
              Access your bookmarked lock models across S-Nafi, Raksham, and Greek.
            </p>
          </div>
          <Link
            href="/account/liked"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>View Saved Locks</span>
            <span>→</span>
          </Link>
        </div>

        {/* Card 2: Inquiry History */}
        <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-base text-primary mb-1">
              Inquiries & Quotations
            </h3>
            <p className="text-xs text-muted mb-4">
              Track communication history and feedback from factory reps.
            </p>
          </div>
          <Link
            href="/account/inquiries"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>Check Inquiries</span>
            <span>→</span>
          </Link>
        </div>

        {/* Card 3: Wholesale Upgrade */}
        <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-base text-primary mb-1">
              Wholesale Dealership
            </h3>
            <p className="text-xs text-muted mb-4">
              Own a hardware shop? Apply for distributor pricing and bulk delivery.
            </p>
          </div>
          <Link
            href="/account/profile"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>Apply as Distributor</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import SalesRepCard from "@/components/SalesRepCard";

export default function DistributorOverviewAndProfilePage() {
  const [data, setData] = useState<DistributorMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDistributorProfile()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const profile = data?.distributorProfile;
  const isApproved = profile?.status === "APPROVED";
  const isRejected = profile?.status === "REJECTED";

  return (
    <div className="space-y-8">
      {/* ── 1. Editorial Welcome Card & Quick Actions ── */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              Factory Direct Wholesale Console
            </span>
            <span className="text-muted/40">·</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : isRejected
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {profile?.status || "PENDING VERIFICATION"}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
            {profile?.companyName || "Distributor Partner"}
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
            Welcome to your official Nafi Lock Industries B2B hub. Manage bulk purchase orders, access live dealer-tier price books, review verified commercial registration credentials, and coordinate directly with your regional factory representative.
          </p>

          {isApproved ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#catalog"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs touch-manipulation"
              >
                Browse Hardware Catalog & Order →
              </Link>
              <Link
                href="/distributor/orders"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors touch-manipulation"
              >
                Track Purchase Orders
              </Link>
              <Link
                href="/distributor/ledger"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors touch-manipulation"
              >
                View Account Ledger
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-background/80 border border-amber-500/30 rounded-xl text-xs text-muted flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-primary mb-0.5">Commercial Verification In Progress</p>
                <p>
                  Once verified by our factory dispatch team, wholesale ordering and dealer-tier pricing will activate across this portal.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Metric KPI Tiles ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-surface border border-divider rounded-2xl p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
            ACCOUNT VERIFICATION
          </span>
          <div className="flex items-center gap-2 my-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isApproved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="font-serif text-xl font-bold text-primary">
              {profile?.status || "PENDING"}
            </span>
          </div>
          <p className="text-xs text-muted">
            {isApproved
              ? "Full access to Tier-1 factory margins."
              : "Commercial review in progress."}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-divider rounded-2xl p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
            DISPATCH TERRITORY
          </span>
          <div className="my-2">
            <span className="font-serif text-xl font-bold text-primary">
              {profile?.city ? `${profile.city}, ${profile.state}` : "Pan-India Freight"}
            </span>
          </div>
          <p className="text-xs text-muted">Direct dispatch from Aligarh foundry.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-divider rounded-2xl p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1">
            COMMERCIAL PRICING TIER
          </span>
          <div className="my-2">
            <span className="font-serif text-xl font-bold text-primary">
              {isApproved ? "Tier-1 Wholesale" : "Standard Catalog"}
            </span>
          </div>
          <p className="text-xs text-muted">
            {isApproved
              ? "Minimum order quantities enforced at checkout."
              : "Dealer pricing unlocks upon approval."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center text-xs text-muted font-mono">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          Loading distributor records...
        </div>
      ) : (
        /* ── 3. Corporate Identification & Assigned Representative Section ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Corporate Identification Card (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-surface border border-divider rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-divider">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary">
                  Corporate Identification & Entity Records
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Official registered enterprise details verified by Nafi Lock Industries
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-accent text-background shrink-0">
                {profile?.status || "PENDING"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Enterprise / Firm Name
                </label>
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5 truncate">
                  {profile?.companyName || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  GST Identification Number (GSTIN)
                </label>
                <div className="text-sm font-mono font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5 uppercase">
                  {profile?.gstNumber || "Not Provided"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Registered Commercial Address
                </label>
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
                  {profile?.businessAddress || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Operating City & State
                </label>
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
                  {profile?.city ? `${profile.city}, ${profile.state}` : "—"}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Primary Authorized Representative
                </label>
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5 truncate">
                  {data?.name || "—"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Account Contact Coordinates
                </label>
                <div className="text-sm font-mono text-primary bg-background border border-divider rounded-xl px-4 py-2.5 truncate">
                  {data?.email} {data?.phone && `· ${data.phone}`}
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Sales Rep & Factory Support (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <SalesRepCard rep={profile?.assignedRep} />

            {/* Quick Factory Wholesale Support Card */}
            <div className="bg-surface border border-divider rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">
                  FACTORY DISPATCH & SUPPORT
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                For dispatch scheduling, custom keyed-alike master systems, or specialized foundry orders, connect directly with factory logistics.
              </p>
              <div className="pt-2 border-t border-divider flex items-center justify-between text-xs">
                <span className="text-muted">Factory Central Hotline</span>
                <a
                  href="tel:+919045582310"
                  className="font-mono font-bold text-accent hover:underline"
                >
                  +91 90455 82310
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

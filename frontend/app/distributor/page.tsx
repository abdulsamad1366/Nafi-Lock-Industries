"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import { clearUserSession } from "@/lib/userAuth";
import SalesRepCard from "@/components/SalesRepCard";

export default function DistributorOverviewAndProfilePage() {
  const router = useRouter();
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

  // Dedicated Sales Representative or Factory Support coordinates
  const rep = profile?.assignedRep;
  const repPhone = rep?.phone || "+91 98765 43210";

  const handleMobileLogout = () => {
    clearUserSession();
    router.push("/login");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── 1. Company Identity & Quick Action Card ── */}
      <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl">
          {/* Header Tagline & Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-accent font-semibold">
              Distributor Console
            </span>
            <span className="text-muted/40">·</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : isRejected
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {profile?.status || "PENDING"}
            </span>
          </div>

          {/* Distributor Company Name */}
          <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-primary mb-1.5 leading-snug">
            {profile?.companyName || "Distributor Partner"}
          </h2>

          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4">
            Tier-1 wholesale pricing, direct foundry consignments, and commercial account records.
          </p>

          {isApproved ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/#catalog"
                className="w-full sm:w-auto min-h-[42px] px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <span>Browse Catalog & Order</span>
                <span>→</span>
              </Link>
              <Link
                href="/distributor/orders"
                className="flex-1 sm:flex-none min-h-[42px] px-4 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors flex items-center justify-center touch-manipulation text-center"
              >
                My Orders
              </Link>
              <Link
                href="/distributor/ledger"
                className="flex-1 sm:flex-none min-h-[42px] px-4 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors flex items-center justify-center touch-manipulation text-center"
              >
                Ledger
              </Link>
            </div>
          ) : (
            <div className="p-3 bg-background/80 border border-amber-500/30 rounded-xl text-xs text-muted flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-primary mb-0.5">Verification Pending</p>
                <p>Wholesale ordering activates upon approval by our dispatch team.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Dedicated Sales Representative Card ── */}
      <div className="w-full">
        <SalesRepCard rep={profile?.assignedRep} />
      </div>

      {/* ── 3. Metric KPI Tiles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 transition-all">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-1">
            Status
          </span>
          <div className="flex items-center gap-2 my-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isApproved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="font-serif text-base sm:text-lg font-bold text-primary">
              {profile?.status || "PENDING"}
            </span>
          </div>
          <p className="text-[11px] text-muted">
            {isApproved ? "Tier-1 factory margins active." : "Review in progress."}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 transition-all">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-1">
            Dispatch Origin
          </span>
          <div className="my-1">
            <span className="font-serif text-base sm:text-lg font-bold text-primary truncate block">
              {profile?.city ? `${profile.city}, ${profile.state}` : "Pan-India Freight"}
            </span>
          </div>
          <p className="text-[11px] text-muted">Direct from Aligarh foundry.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 transition-all">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-1">
            Pricing Level
          </span>
          <div className="my-1">
            <span className="font-serif text-base sm:text-lg font-bold text-accent">
              {isApproved ? "Tier-1 Wholesale" : "Standard Catalog"}
            </span>
          </div>
          <p className="text-[11px] text-muted">Batch MOQ enforced at checkout.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-surface border border-divider rounded-2xl p-8 text-center text-xs text-muted font-mono">
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-2" />
          Loading distributor records...
        </div>
      ) : (
        /* ── 4. Enterprise Records & Factory Logistics ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Corporate Identification Card (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-surface border border-divider rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-primary">
                  Enterprise Information
                </h3>
                <p className="text-[11px] text-muted">
                  Registered wholesale partner credentials
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-accent text-background shrink-0">
                {profile?.status || "PENDING"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  Firm Name
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3 py-2 truncate">
                  {profile?.companyName || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  GSTIN
                </label>
                <div className="text-xs sm:text-sm font-mono font-semibold text-primary bg-background border border-divider rounded-xl px-3 py-2 uppercase">
                  {profile?.gstNumber || "Not Provided"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  Commercial Address
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3 py-2">
                  {profile?.businessAddress || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  Territory / City
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3 py-2">
                  {profile?.city ? `${profile.city}, ${profile.state}` : "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  Authorized Contact
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3 py-2 truncate">
                  {data?.name || "—"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  Contact Coordinates
                </label>
                <div className="text-xs sm:text-sm font-mono text-primary bg-background border border-divider rounded-xl px-3 py-2 truncate">
                  {data?.email} {data?.phone && `· ${data.phone}`}
                </div>
              </div>

              {/* Sign Out for Mobile */}
              <div className="sm:col-span-2 pt-2 border-t border-divider flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted">Session: Active</span>
                <button
                  type="button"
                  onClick={handleMobileLogout}
                  className="text-xs font-serif font-semibold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 touch-manipulation px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 cursor-pointer"
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

          {/* Plant Dispatch Desk Card (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-surface border border-divider rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-bold">
                  Factory Logistics
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
                Aligarh Plant Dispatch
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                For bulk pallet dispatch scheduling or keyed-alike master systems, reach the factory desk.
              </p>
            </div>

            <div className="pt-3 border-t border-divider space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Dispatch Desk</span>
                <span className="font-mono font-semibold text-primary">Aligarh, UP</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Plant Hotline</span>
                <a
                  href="tel:+919045582310"
                  className="font-mono font-bold text-accent hover:underline touch-manipulation"
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

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
    <div className="space-y-4 sm:space-y-6 lg:space-y-7">
      {/* ── 1. Company Name & B2B Console Card (Position 1 on screen from top) ── */}
      <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 lg:p-7 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl">
          {/* Header Tagline, Status & Mobile Logout */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
                B2B Wholesale Portal
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
                {profile?.status || "PENDING VERIFICATION"}
              </span>
            </div>

            {/* Mobile Sign Out Button */}
            <button
              type="button"
              onClick={handleMobileLogout}
              className="lg:hidden text-[11px] font-mono text-muted hover:text-red-500 transition-colors flex items-center gap-1 touch-manipulation py-1 px-2 rounded-lg hover:bg-background border border-transparent hover:border-divider"
              title="Sign Out of Distributor Account"
            >
              <span>Sign Out</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>

          {/* Distributor Company Name */}
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1.5 leading-snug">
            {profile?.companyName || "Distributor Partner"}
          </h2>

          {/* ── Sales Representative Number Immediately After Distributor Company Name ── */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5 sm:mb-4">
            <span className="text-[11px] sm:text-xs font-mono text-muted uppercase tracking-wider font-semibold">
              Sales Rep Number:
            </span>
            <a
              href={`tel:${repPhone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-background transition-all text-xs font-mono font-bold touch-manipulation group shadow-2xs"
              title="Call Assigned Sales Representative"
            >
              <svg
                className="w-3.5 h-3.5 shrink-0 text-accent group-hover:text-background transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{repPhone}</span>
              {rep?.name && (
                <span className="text-[10px] font-sans font-normal opacity-85">
                  · {rep.name}
                </span>
              )}
            </a>

            {rep?.phone && (
              <a
                href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                  rep.name || "Representative"
                )},%20inquiring%20about%20my%20Nafi%20Lock%20distributor%20account`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-xs font-mono font-bold touch-manipulation shadow-2xs"
                title="Direct WhatsApp with Sales Representative"
              >
                WhatsApp
              </a>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4 sm:mb-5">
            Official verified B2B wholesale console for Nafi Lock Industries. Order hardware inventory at Tier-1 factory unit costs, review registered commercial credentials, and coordinate consignments with your dedicated representative.
          </p>

          {isApproved ? (
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link
                href="/#catalog"
                className="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs touch-manipulation"
              >
                Browse Hardware Catalog & Order →
              </Link>
              <Link
                href="/distributor/orders"
                className="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors touch-manipulation"
              >
                Track Purchase Orders
              </Link>
              <Link
                href="/distributor/ledger"
                className="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors touch-manipulation"
              >
                View Account Ledger
              </Link>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 bg-background/80 border border-amber-500/30 rounded-xl text-xs text-muted flex items-start gap-2.5">
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

      {/* ── 2. Dedicated Sales Representative Card (Position 2 on screen from top) ── */}
      <div className="w-full">
        <SalesRepCard rep={profile?.assignedRep} />
      </div>

      {/* ── 3. Metric KPI Tiles (Compact on Mobile, 3 cols on tablet/desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Metric 1 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted block mb-1">
            ACCOUNT VERIFICATION
          </span>
          <div className="flex items-center gap-2 my-1.5 sm:my-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isApproved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="font-serif text-lg sm:text-xl font-bold text-primary">
              {profile?.status || "PENDING"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted">
            {isApproved
              ? "Full access to Tier-1 factory margins."
              : "Commercial review in progress."}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted block mb-1">
            DISPATCH TERRITORY
          </span>
          <div className="my-1.5 sm:my-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-primary truncate block">
              {profile?.city ? `${profile.city}, ${profile.state}` : "Pan-India Freight"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted">Direct dispatch from Aligarh foundry.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 transition-all hover:border-divider/80">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted block mb-1">
            COMMERCIAL PRICING TIER
          </span>
          <div className="my-1.5 sm:my-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-primary">
              {isApproved ? "Tier-1 Wholesale" : "Standard Catalog"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted">
            {isApproved
              ? "Minimum batch quantities enforced at checkout."
              : "Dealer pricing unlocks upon approval."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-surface border border-divider rounded-2xl p-8 sm:p-12 text-center text-xs text-muted font-mono">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          Loading distributor records...
        </div>
      ) : (
        /* ── 4. Corporate Identification & Factory Dispatch Logistics ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Corporate Identification Card (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-surface border border-divider rounded-2xl p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-divider">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-primary">
                  Corporate Identification & Entity Records
                </h3>
                <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                  Official registered enterprise details verified by Nafi Lock Industries
                </p>
              </div>
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase bg-accent text-background shrink-0">
                {profile?.status || "PENDING"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Enterprise / Firm Name
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 truncate">
                  {profile?.companyName || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  GST Identification Number (GSTIN)
                </label>
                <div className="text-xs sm:text-sm font-mono font-semibold text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 uppercase">
                  {profile?.gstNumber || "Not Provided"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Registered Commercial Address
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5">
                  {profile?.businessAddress || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Operating City & State
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5">
                  {profile?.city ? `${profile.city}, ${profile.state}` : "—"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Primary Authorized Representative
                </label>
                <div className="text-xs sm:text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 truncate">
                  {data?.name || "—"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Account Contact Coordinates
                </label>
                <div className="text-xs sm:text-sm font-mono text-primary bg-background border border-divider rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 truncate">
                  {data?.email} {data?.phone && `· ${data.phone}`}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Factory Wholesale Support Card (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-surface border border-divider rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted font-bold">
                  FACTORY DISPATCH & LOGISTICS
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
                Foundry Direct Freight
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                For bulk pallet dispatch scheduling, custom keyed-alike master systems, or specialized institutional foundry orders, connect with factory logistics.
              </p>
            </div>

            <div className="pt-3 border-t border-divider space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Dispatch Desk</span>
                <span className="font-mono font-semibold text-primary">Aligarh Foundry</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Central Hotline</span>
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

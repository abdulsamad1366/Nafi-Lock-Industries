"use client";

import { useEffect, useState } from "react";
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

    // Sync with updates from top console header or modal
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DistributorMeResponse>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };
    window.addEventListener("nafi:profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("nafi:profile-updated", handleProfileUpdate);
    };
  }, []);

  const profile = data?.distributorProfile;
  const isApproved = profile?.status === "APPROVED";

  if (isLoading) {
    return (
      <div className="bg-surface border border-divider rounded-2xl p-8 text-center text-xs text-muted font-mono">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-2" />
        Loading distributor profile...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── 1. Dedicated Sales Representative Card ── */}
      <div className="w-full">
        <SalesRepCard rep={profile?.assignedRep} />
      </div>

      {/* ── 2. Metric KPI Tiles (Compact 3-Column Mobile Deck) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-surface border border-divider rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center sm:text-left transition-all shadow-xs">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">
            Status
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 my-0.5 sm:my-1">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                isApproved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="font-serif text-xs sm:text-base lg:text-lg font-bold text-primary truncate">
              {profile?.status || "PENDING"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted hidden sm:block">
            {isApproved ? "Tier-1 factory margins active." : "Review in progress."}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-divider rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center sm:text-left transition-all shadow-xs">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">
            Origin
          </span>
          <div className="my-0.5 sm:my-1">
            <span className="font-serif text-xs sm:text-base lg:text-lg font-bold text-primary truncate block">
              {profile?.city || "Aligarh, UP"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted hidden sm:block">
            Direct from Aligarh foundry.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-divider rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center sm:text-left transition-all shadow-xs">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">
            Pricing
          </span>
          <div className="my-0.5 sm:my-1">
            <span className="font-serif text-xs sm:text-base lg:text-lg font-bold text-accent truncate block">
              <span className="sm:hidden">Tier-1</span>
              <span className="hidden sm:inline">
                {isApproved ? "Tier-1 Wholesale" : "Standard Catalog"}
              </span>
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted hidden sm:block">
            Direct factory pricing enabled.
          </p>
        </div>
      </div>

      {/* ── 3. Factory Logistics ── */}
      <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-bold">
              Factory Logistics & Dispatch Desk
            </span>
          </div>
          <h4 className="font-serif font-bold text-sm sm:text-base text-primary">
            Aligarh Plant Dispatch
          </h4>
          <p className="text-xs text-muted leading-relaxed mt-1 max-w-xl">
            For bulk container consignment scheduling, custom master-keying, or factory dispatch status, reach the plant logistics desk directly.
          </p>
        </div>

        <div className="pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-divider sm:pl-6 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
          <span className="text-xs text-muted hidden sm:inline">Plant Hotline:</span>
          <a
            href="tel:+919045582310"
            className="w-full sm:w-auto px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/25 text-accent font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] touch-manipulation shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>+91 90455 82310</span>
          </a>
        </div>
      </div>
    </div>
  );
}

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

      {/* ── 2. Metric KPI Tiles ── */}
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

      {/* ── 3. Factory Logistics ── */}
      <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-bold">
              Factory Logistics & Dispatch Desk
            </span>
          </div>
          <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
            Aligarh Plant Dispatch
          </h4>
          <p className="text-xs text-muted leading-relaxed max-w-xl">
            For bulk container consignment scheduling, custom master-keying, or factory dispatch status, reach the plant logistics desk directly.
          </p>
        </div>

        <div className="pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-divider sm:pl-6 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
          <span className="text-xs text-muted">Plant Hotline:</span>
          <a
            href="tel:+919045582310"
            className="font-mono font-bold text-accent hover:underline text-sm touch-manipulation"
          >
            +91 90455 82310
          </a>
        </div>
      </div>
    </div>
  );
}

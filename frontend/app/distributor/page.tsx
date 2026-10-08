"use client";

import { useEffect, useState } from "react";
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

  const handleMobileLogout = () => {
    clearUserSession();
    router.push("/login");
  };

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
      {/* ── 1. Company Name & Basic Details Card ── */}
      <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-5 relative shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-divider">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-serif font-bold text-lg sm:text-xl shrink-0 shadow-2xs">
              {(profile?.companyName || data?.name || "D").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-base sm:text-xl font-bold text-primary truncate leading-tight">
                {profile?.companyName || "Distributor Partner"}
              </h2>
              <p className="text-xs text-muted truncate mt-0.5">
                {data?.name || "Authorized Partner"} {profile?.city ? `· ${profile.city}, ${profile.state}` : ""}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider self-start sm:self-auto shrink-0 ${
              isApproved
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : isRejected
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}
          >
            ● {profile?.status || "PENDING"}
          </span>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3.5 text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Authorized Contact</span>
            <span className="font-semibold text-primary truncate block">
              {data?.name || "—"}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Phone Number</span>
            <a
              href={`tel:${data?.phone || ""}`}
              className="font-mono font-semibold text-accent hover:underline truncate block"
            >
              {data?.phone || "—"}
            </a>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Email Address</span>
            <span className="font-mono font-medium text-primary truncate block" title={data?.email}>
              {data?.email || "—"}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">GST Number</span>
            <span className="font-mono font-semibold text-primary uppercase truncate block">
              {profile?.gstNumber || "Not Provided"}
            </span>
          </div>

          <div className="col-span-2">
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Commercial Address</span>
            <span className="font-medium text-primary text-[11px] sm:text-xs leading-relaxed block truncate">
              {profile?.businessAddress || (profile?.city ? `${profile.city}, ${profile.state}` : "—")}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-muted block mb-0.5">Territory</span>
            <span className="font-semibold text-primary truncate block">
              {profile?.city ? `${profile.city}, ${profile.state}` : "—"}
            </span>
          </div>

          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={handleMobileLogout}
              className="text-xs font-serif font-semibold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 touch-manipulation px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 cursor-pointer"
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

      {/* ── 4. Factory Logistics ── */}
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import SalesRepCard from "@/components/SalesRepCard";

export default function DistributorOverviewPage() {
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

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Card */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
            Factory Direct Wholesale Console
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-3">
            {profile?.companyName || "Distributor Partner"}
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
            Welcome to the Nafi Lock Industries B2B hub. Manage bulk purchase orders, access live dealer-tier price books, download engineering technical catalogs, and coordinate with your regional factory representative.
          </p>

          {isApproved ? (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/distributor/catalog"
                className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
              >
                Browse Dealer Catalog & Order →
              </Link>
              <Link
                href="/distributor/orders"
                className="px-5 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors"
              >
                Track Purchase Orders
              </Link>
            </div>
          ) : (
            <div className="p-3 bg-background border border-amber-500/30 rounded-xl text-xs text-muted">
              Once verified by our factory dispatch team, wholesale ordering and dealer-tier pricing will activate across this portal.
            </div>
          )}
        </div>
      </div>

      {/* Grid: 3 Metric Tiles & Sales Rep Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-surface border border-divider rounded-2xl p-6">
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
        <div className="bg-surface border border-divider rounded-2xl p-6">
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
        <div className="bg-surface border border-divider rounded-2xl p-6">
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

      {/* Assigned Sales Rep Section */}
      <div>
        <SalesRepCard rep={profile?.assignedRep} />
      </div>
    </div>
  );
}

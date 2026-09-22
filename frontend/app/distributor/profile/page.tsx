"use client";

import { useEffect, useState } from "react";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import SalesRepCard from "@/components/SalesRepCard";

export default function DistributorProfilePage() {
  const [data, setData] = useState<DistributorMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDistributorProfile()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const profile = data?.distributorProfile;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-primary">
          Distributor Entity & Verification Profile
        </h2>
        <p className="text-xs text-muted">
          Official registered enterprise details verified by Nafi Lock Industries
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted font-mono">
          Loading distributor records...
        </div>
      ) : (
        <>
          {/* Company Details Grid */}
          <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-divider">
              <h3 className="font-serif font-bold text-lg text-primary">
                Corporate Identification
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-accent text-background">
                {profile?.status || "PENDING"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Enterprise / Firm Name
                </label>
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
                  {profile?.companyName || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  GST Identification Number
                </label>
                <div className="text-sm font-mono font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5 uppercase">
                  {profile?.gstNumber || "Not Provided"}
                </div>
              </div>

              <div>
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
                <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
                  {data?.name || "—"}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                  Account Contact Coordinates
                </label>
                <div className="text-sm font-mono text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
                  {data?.email} {data?.phone && `· ${data.phone}`}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Sales Representative */}
          <div>
            <SalesRepCard rep={profile?.assignedRep} />
          </div>
        </>
      )}
    </div>
  );
}

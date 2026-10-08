"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDistributorProfile, DistributorMeResponse } from "@/lib/api";
import { clearUserSession } from "@/lib/userAuth";
import SalesRepCard from "@/components/SalesRepCard";
import EditProfileModal from "@/components/EditProfileModal";

export default function DistributorOverviewAndProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<DistributorMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
  const isRejected = profile?.status === "REJECTED";

  const handleMobileLogout = () => {
    clearUserSession();
    router.push("/login");
  };

  const handleProfileUpdated = (updated: DistributorMeResponse) => {
    setData(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nafi:profile-updated", { detail: updated }));
    }
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
      {/* ── 1. Company Profile Header Card ── */}
      <div className="bg-surface border border-divider rounded-3xl p-5 sm:p-7 shadow-xs">
        {/* Top Row: Monogram, Title/Subtitle, Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-surface border border-divider flex items-center justify-center font-serif font-bold text-2xl text-accent shrink-0 shadow-2xs">
              {(profile?.companyName || data?.name || "D").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary truncate leading-tight">
                {profile?.companyName || "Distributor Partner"}
              </h2>
              <p className="text-xs sm:text-sm text-muted truncate mt-1">
                {data?.name || "Authorized Representative"} {profile?.city ? `· ${profile.city}, ${profile.state}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : isRejected
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {profile?.status || "PENDING"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-divider/60 my-5 sm:my-6" />

        {/* Details Grid */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Row 1: 4 metadata columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                AUTHORIZED CONTACT
              </span>
              <span className="font-sans font-bold text-primary truncate block text-xs sm:text-sm">
                {data?.name || "—"}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                PHONE NUMBER
              </span>
              <a
                href={`tel:${data?.phone || ""}`}
                className="font-mono font-bold text-accent hover:underline truncate block text-xs sm:text-sm"
              >
                {data?.phone || "—"}
              </a>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                EMAIL ADDRESS
              </span>
              <span className="font-mono font-medium text-primary truncate block text-xs sm:text-sm" title={data?.email}>
                {data?.email || "—"}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                GST NUMBER
              </span>
              <span className="font-mono font-bold text-primary uppercase truncate block text-xs sm:text-sm">
                {profile?.gstNumber || "Not Provided"}
              </span>
            </div>
          </div>

          {/* Row 2: Address, Territory, and Actions (Edit Profile + Sign Out) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end pt-2">
            <div className="md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                COMMERCIAL ADDRESS
              </span>
              <span className="font-medium text-primary text-xs sm:text-sm leading-relaxed block truncate">
                {profile?.businessAddress || (profile?.city ? `${profile.city}, ${profile.state}` : "—")}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
                TERRITORY
              </span>
              <span className="font-semibold text-primary truncate block text-xs sm:text-sm">
                {profile?.city ? `${profile.city}, ${profile.state}` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-serif font-semibold rounded-xl bg-background border border-divider text-primary hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs touch-manipulation"
              >
                <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleMobileLogout}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-serif font-semibold text-rose-500 bg-rose-50/60 border border-rose-200/80 hover:bg-rose-100/60 transition-colors flex items-center gap-1.5 rounded-xl cursor-pointer shadow-2xs touch-manipulation"
              >
                <span>Sign Out</span>
                <span className="text-sm leading-none">⇥</span>
              </button>
            </div>
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={{
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          companyName: profile?.companyName || "",
          gstNumber: profile?.gstNumber || "",
          businessAddress: profile?.businessAddress || "",
          city: profile?.city || "",
          state: profile?.state || "",
        }}
        onSuccess={handleProfileUpdated}
      />
    </div>
  );
}

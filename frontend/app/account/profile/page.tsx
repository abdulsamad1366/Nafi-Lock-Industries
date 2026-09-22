"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, AuthUser, setDistributorStatus, setUser } from "@/lib/userAuth";
import { applyForDistributor } from "@/lib/api";

export default function AccountProfilePage() {
  const router = useRouter();
  const [user, setUserState] = useState<AuthUser | null>(null);

  // Upgrade to Distributor form state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    setUserState(getUser());
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApplyError(null);

    try {
      const res = await applyForDistributor({
        companyName,
        gstNumber,
        businessAddress,
        city,
        state,
      });

      if (user) {
        const updatedUser: AuthUser = { ...user, role: "DISTRIBUTOR" };
        setUser(updatedUser);
      }
      setDistributorStatus("PENDING");
      router.push("/distributor");
    } catch (err: any) {
      setApplyError(err.message || "Failed to submit distributor application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Info Card */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8">
        <h2 className="font-serif text-xl font-bold text-primary mb-1">
          Account Profile
        </h2>
        <p className="text-xs text-muted mb-6">
          Your registered identity and contact details with Nafi Lock Industries
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
              Full Name
            </label>
            <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
              {user?.name || "—"}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
              Registered Email
            </label>
            <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
              {user?.email || "—"}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
              Contact Phone
            </label>
            <div className="text-sm font-semibold text-primary bg-background border border-divider rounded-xl px-4 py-2.5">
              {user?.phone || "Not specified"}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
              Account Role
            </label>
            <div className="flex items-center gap-2 bg-background border border-divider rounded-xl px-4 py-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                {user?.role || "CUSTOMER"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade to Wholesale Distributor Section */}
      {user?.role === "CUSTOMER" && (
        <div className="bg-surface border border-accent/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              Business Partnership
            </span>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">
              Apply for Factory Wholesale Distributorship
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Upgrade your account to access Tier-1 distributor prices, minimum order quantities (MOQ), official PDF catalog downloads, and financial ledger statements.
            </p>

            {!showApplyModal ? (
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-md"
              >
                Start Distributor Application →
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 pt-4 border-t border-divider">
                {applyError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
                    {applyError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      Hardware Company / Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Hardware Depot"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary focus:outline-hidden focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="09AAAAA0000A1Z5"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary font-mono uppercase focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Shop #4, Industrial Area Phase 1"
                    className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary focus:outline-hidden focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Agra"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary focus:outline-hidden focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-5 py-2 text-xs font-medium text-muted hover:text-primary rounded-full border border-divider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

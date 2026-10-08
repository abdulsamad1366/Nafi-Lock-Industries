"use client";

import { useState, useEffect } from "react";
import { updateDistributorProfile, DistributorMeResponse } from "@/lib/api";
import { setUser } from "@/lib/userAuth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string | null;
    companyName?: string;
    gstNumber?: string | null;
    businessAddress?: string;
    city?: string;
    state?: string;
  } | null;
  onSuccess: (updated: DistributorMeResponse) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: EditProfileModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || "");
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setGstNumber(initialData.gstNumber || "");
      setBusinessAddress(initialData.businessAddress || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setError(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Company Name is required");
      return;
    }
    if (!name.trim()) {
      setError("Authorized Contact Name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await updateDistributorProfile({
        companyName: companyName.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        gstNumber: gstNumber.trim().toUpperCase() || undefined,
        businessAddress: businessAddress.trim(),
        city: city.trim(),
        state: state.trim(),
      });

      // Update cached session user
      setUser({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: "DISTRIBUTOR",
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-surface border border-divider rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-divider">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-primary">
              Edit Distributor Profile
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Update wholesale firm records and authorized contact coordinates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background border border-divider flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
              Firm / Company Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm text-primary font-medium focus:outline-none focus:border-accent"
              placeholder="e.g. Royal Hardware & Lock Traders"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Contact Name */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                Authorized Contact *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm text-primary font-medium focus:outline-none focus:border-accent"
                placeholder="e.g. Rajesh Kumar"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm font-mono text-primary font-medium focus:outline-none focus:border-accent"
                placeholder="e.g. +91 98100 12345"
              />
            </div>

            {/* GSTIN */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm font-mono uppercase text-primary font-medium focus:outline-none focus:border-accent"
                placeholder="e.g. 07AAAAA0000A1Z5"
              />
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={initialData?.email || ""}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background/50 border border-divider/60 text-xs sm:text-sm font-mono text-muted cursor-not-allowed"
              />
            </div>
          </div>

          {/* Commercial Address */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
              Commercial Address
            </label>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm text-primary font-medium focus:outline-none focus:border-accent"
              placeholder="e.g. 42 Foundry Lane, Industrial Area"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* City */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                City / Territory
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm text-primary font-medium focus:outline-none focus:border-accent"
                placeholder="e.g. Aligarh"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-divider text-xs sm:text-sm text-primary font-medium focus:outline-none focus:border-accent"
                placeholder="e.g. Uttar Pradesh"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-divider">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-serif font-semibold text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[40px] px-6 py-2 rounded-xl bg-accent text-background text-xs font-serif font-bold hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-background border-t-transparent animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DealerApplyPage() {
  const { loginAs } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    gstin: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "hardware_store", // hardware_store | architect | contractor | wholesaler
    address: "",
    city: "",
    annualVolume: "5_10_lakhs",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-brass-600 uppercase tracking-widest block mb-2 font-semibold">
            B2B WHOLESALE ONBOARDING
          </span>
          <h1 className="font-space font-bold text-3xl sm:text-4xl text-graphite-900 mb-3">
            Apply for Wholesale Dealer Account
          </h1>
          <p className="font-inter text-steel-500 text-sm leading-relaxed">
            Gain direct access to tier-1 factory pricing, bulk quantity breaks, dedicated account management, and GST tax credit invoicing.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white hairline-border p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-brass-600/20 text-brass-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="font-mono text-xs text-brass-600 uppercase font-semibold block mb-1">
                APPLICATION SUBMITTED #DLR-99201
              </span>
              <h2 className="font-space font-bold text-2xl text-graphite-900">
                Dealer Application Under Verification
              </h2>
              <p className="text-xs text-steel-500 mt-2 leading-relaxed max-w-md mx-auto">
                Thank you, <span className="font-semibold text-graphite-900">{formData.companyName}</span>. Our sales verification desk is reviewing your GSTIN ({formData.gstin}). Approvals are processed within 4 business hours.
              </p>
            </div>

            <div className="pt-4 border-t border-steel-100 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => loginAs("dealer")}
                className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-6 py-3 rounded-sm text-xs flex items-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" /> Instantly Activate Demo Dealer Profile
              </button>

              <Link
                href="/"
                className="text-xs font-mono text-steel-500 hover:text-graphite-900 underline"
              >
                Return to home page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white hairline-border p-8 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">Registered Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardware Hub Pvt Ltd"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  placeholder="27AAACH1234F1Z9"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Vikram Mehta"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98111 22334"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="dealer@hardwarehub.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-steel-500 block mb-1">Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter bg-white"
                >
                  <option value="hardware_store">Retail Hardware Showroom / Store</option>
                  <option value="architect">Architectural & Interior Studio</option>
                  <option value="contractor">Building Contractor / Real Estate Developer</option>
                  <option value="wholesaler">Regional Hardware Distributor</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono font-semibold text-steel-500 block mb-1">Registered Business Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Industrial Area Phase 2, Mumbai, Maharashtra 400080"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-steel-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-steel-500">
                <ShieldCheck className="w-4 h-4 text-brass-600" /> GST Verification Handled Automatically
              </div>

              <button
                type="submit"
                className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-8 py-3.5 rounded-sm flex items-center gap-2 text-xs transition-colors"
              >
                Submit Dealer Application <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

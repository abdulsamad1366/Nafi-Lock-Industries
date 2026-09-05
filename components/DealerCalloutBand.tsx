"use client";

import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DealerCalloutBand() {
  const { isDealer, loginAs } = useAuth();

  return (
    <section className="py-16 bg-steel-100/60 border-b border-steel-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-graphite-900 text-white hairline-border p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brass-600"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brass-600/20 text-brass-500 text-xs font-mono rounded border border-brass-600/30 mb-4">
                <Building2 className="w-3.5 h-3.5" /> WHOLESALE & ARCHITECTURAL DEALERS
              </div>

              <h2 className="font-space font-bold text-2xl sm:text-4xl text-white mb-4">
                Are you a lock dealer, architect, or project contractor?
              </h2>

              <p className="font-inter text-steel-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
                Register your business GSTIN to unlock wholesale tiered pricing (up to 38% off retail MRP), priority factory dispatches, and custom master keying support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-steel-300 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brass-500 shrink-0" />
                  <span>GST Invoice & Tax Credit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brass-500 shrink-0" />
                  <span>Quantity Price Breaks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brass-500 shrink-0" />
                  <span>Direct PO WhatsApp Inquiries</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-stretch sm:items-start lg:items-end gap-3">
              <Link
                href="/dealer/apply"
                className="w-full sm:w-auto bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-6 py-3.5 rounded-sm flex items-center justify-center gap-2 text-sm transition-colors text-center"
              >
                Apply for Wholesale Account <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => loginAs("dealer")}
                className="w-full sm:w-auto text-xs text-steel-400 hover:text-white font-mono flex items-center justify-center gap-1.5 py-2 px-3 border border-graphite-700 hover:border-steel-500 rounded transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-brass-500" /> Demo: Toggle Dealer Mode Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

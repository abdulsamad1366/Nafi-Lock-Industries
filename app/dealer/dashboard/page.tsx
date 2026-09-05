"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileText,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function DealerDashboardPage() {
  const { user, isDealer, loginAs } = useAuth();
  const { addToCart } = useCart();
  const [poSubmitted, setPoSubmitted] = useState(false);

  if (!isDealer) {
    return (
      <div className="min-h-screen bg-paper-50 py-16">
        <div className="max-w-md mx-auto text-center bg-white hairline-border p-8 space-y-4">
          <Building2 className="w-12 h-12 text-steel-400 mx-auto" />
          <h1 className="font-space font-bold text-xl text-graphite-900">Dealer Authentication Required</h1>
          <p className="text-xs text-steel-500 leading-relaxed">
            You are currently viewing as a retail customer. Please switch persona or log in with an approved dealer account.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => loginAs("dealer")}
              className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold py-2.5 px-4 text-xs rounded transition-colors"
            >
              Switch to Demo Approved Dealer Account
            </button>
            <Link href="/dealer/apply" className="text-xs font-mono text-steel-500 underline">
              Apply for new dealer registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header Profile Info */}
        <div className="bg-graphite-900 text-white p-8 hairline-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brass-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                APPROVED DEALER TIER 1
              </span>
              <span className="text-xs font-mono text-steel-400">GSTIN: {user?.gstin}</span>
            </div>
            <h1 className="font-space font-bold text-3xl text-white">{user?.companyName}</h1>
            <p className="text-xs text-steel-400 mt-1">Account Manager: Vikram Mehta | Credit Term: Net 30</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-4 py-2.5 rounded-sm text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Browse Catalog at Dealer Rates
            </Link>
          </div>
        </div>

        {/* Tier Rate Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white hairline-border p-6 space-y-1">
            <span className="text-xs font-mono text-steel-500 uppercase">TIER DISCOUNT RATE</span>
            <div className="font-space font-bold text-3xl text-graphite-900 flex items-center justify-between">
              <span>32.5% OFF</span>
              <Percent className="w-6 h-6 text-brass-600" />
            </div>
            <p className="text-[11px] text-steel-400">Applied automatically to all catalog items</p>
          </div>

          <div className="bg-white hairline-border p-6 space-y-1">
            <span className="text-xs font-mono text-steel-500 uppercase">CREDIT LIMIT</span>
            <div className="font-space font-bold text-3xl text-graphite-900">
              ₹5,00,000
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold font-mono">Available Balance: ₹3,40,000</p>
          </div>

          <div className="bg-white hairline-border p-6 space-y-1">
            <span className="text-xs font-mono text-steel-500 uppercase">ACTIVE PO ORDERS</span>
            <div className="font-space font-bold text-3xl text-graphite-900">
              2 Orders
            </div>
            <p className="text-[11px] text-steel-400 font-mono">Last dispatch: 2 days ago</p>
          </div>
        </div>

        {/* Quick Bulk PO Request Builder */}
        <div className="bg-white hairline-border p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-steel-100">
            <div>
              <h2 className="font-space font-bold text-xl text-graphite-900">Bulk PO Direct Order Request</h2>
              <p className="text-xs text-steel-500 mt-0.5">Submit project requirements directly for priority factory queue scheduling.</p>
            </div>
            <button
              onClick={() => alert("Downloading NAFI Price Sheet 2026 (PDF)...")}
              className="text-xs font-mono text-brass-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Wholesale Price List PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="font-mono font-semibold text-steel-500 block mb-1">Project Site / Reference Code</label>
              <input
                type="text"
                placeholder="e.g. Skyline Towers Phase 3"
                className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
              />
            </div>

            <div>
              <label className="font-mono font-semibold text-steel-500 block mb-1">Target Delivery Date</label>
              <input
                type="date"
                defaultValue="2026-09-15"
                className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-mono font-semibold text-steel-500 block mb-1">Bulk Hardware SKU List & Quantities</label>
              <textarea
                rows={3}
                placeholder="NFL-LC-701: 50 Units (Brushed Brass)&#10;NFL-HD-302: 50 Pairs (Satin Chrome)&#10;NFL-AC-404: 150 Sets"
                className="w-full p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-steel-500">PO Subject to Standard NAFI Net 30 Terms</span>
            <button
              onClick={() => setPoSubmitted(true)}
              className="bg-graphite-900 hover:bg-graphite-800 text-white font-space font-semibold px-6 py-3 rounded-sm text-xs transition-colors"
            >
              Submit PO Request to Factory Desk
            </button>
          </div>

          {poSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PO Request #PO-2026-904 successfully routed to factory production planner.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

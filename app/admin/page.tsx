"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Package,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DealerAppItem {
  id: string;
  companyName: string;
  gstin: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminPage() {
  const { role, isAdmin, loginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<"dealers" | "products">("dealers");

  const [dealers, setDealers] = useState<DealerAppItem[]>([
    {
      id: "app-1",
      companyName: "Hardware Hub Pvt Ltd",
      gstin: "27AAACH1234F1Z9",
      phone: "+91 98111 22334",
      status: "approved",
    },
    {
      id: "app-2",
      companyName: "Apex Building Supplies",
      gstin: "07BBBCA9988G1Z2",
      phone: "+91 98777 66554",
      status: "pending",
    },
    {
      id: "app-3",
      companyName: "Metro Locks & Fitments",
      gstin: "29CCCCK5544H1Z1",
      phone: "+91 98222 33110",
      status: "pending",
    },
  ]);

  const toggleDealerStatus = (id: string, newStatus: "approved" | "rejected") => {
    setDealers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper-50 py-16">
        <div className="max-w-md mx-auto text-center bg-white hairline-border p-8 space-y-4">
          <ShieldCheck className="w-12 h-12 text-signal-red mx-auto" />
          <h1 className="font-space font-bold text-xl text-graphite-900">Admin Authentication Required</h1>
          <p className="text-xs text-steel-500 leading-relaxed">
            Store management portal is restricted to authorized personnel.
          </p>
          <button
            onClick={() => loginAs("admin")}
            className="bg-graphite-900 hover:bg-graphite-800 text-white font-space font-semibold py-2.5 px-4 text-xs rounded transition-colors"
          >
            Switch to Demo Admin Persona
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="bg-graphite-900 text-white p-8 hairline-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-space font-bold text-3xl text-white">NAFI Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-steel-400">Log in as: Nafi Master Admin</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-steel-100 pb-2 font-space text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dealers")}
            className={`px-4 py-2 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === "dealers"
                ? "bg-white hairline-border border-b-white text-brass-600"
                : "text-steel-500 hover:text-graphite-900"
            }`}
          >
            <Users className="w-4 h-4" /> Dealer Applications ({dealers.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === "products"
                ? "bg-white hairline-border border-b-white text-brass-600"
                : "text-steel-500 hover:text-graphite-900"
            }`}
          >
            <Package className="w-4 h-4" /> Product Catalog (15 SKUs)
          </button>
        </div>

        {/* Tab 1: Dealer Applications Approval Manager */}
        {activeTab === "dealers" && (
          <div className="bg-white hairline-border p-6 space-y-4">
            <h2 className="font-space font-bold text-lg text-graphite-900 pb-3 border-b border-steel-100">
              Dealer Verification Queue
            </h2>

            <div className="divide-y divide-steel-100 text-xs font-inter">
              {dealers.map((dlr) => (
                <div key={dlr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-space font-bold text-base text-graphite-900">{dlr.companyName}</div>
                    <div className="font-mono text-steel-500 mt-0.5">
                      GSTIN: <span className="text-graphite-900 font-semibold">{dlr.gstin}</span> • Phone: {dlr.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded ${
                        dlr.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : dlr.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {dlr.status}
                    </span>

                    {dlr.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleDealerStatus(dlr.id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-space px-3 py-1.5 rounded text-xs flex items-center gap-1 font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => toggleDealerStatus(dlr.id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white font-space px-3 py-1.5 rounded text-xs flex items-center gap-1 font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Product Manager */}
        {activeTab === "products" && (
          <div className="bg-white hairline-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-steel-100">
              <h2 className="font-space font-bold text-lg text-graphite-900">Inventory & SKU Manager</h2>
              <button
                onClick={() => alert("Product Addition Form Modal triggered")}
                className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-4 py-2 rounded text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New SKU
              </button>
            </div>

            <div className="text-xs font-mono text-steel-500">
              All 15 SKUs loaded into SQLite database. Instant edit of prices and stock quantities enabled for admin.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

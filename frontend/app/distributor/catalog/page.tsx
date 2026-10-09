import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Distributor Product Catalog & Wholesale Ordering | Nafi Lock Industries",
  description:
    "Authorized distributor product catalog. Browse Tier-1 wholesale prices and order direct from the factory queue.",
};

export default function DistributorCatalogPage() {
  return (
    <div className="space-y-6">
      {/* ── Top Catalog Banner for Authorized Dealers ── */}
      <div className="bg-gradient-to-r from-[#1C1917] to-[#292524] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-[#A98048]/20 to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#A98048]/20 border border-[#A98048]/40 text-[#C49B55] text-[10px] font-mono uppercase tracking-widest font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C49B55] animate-pulse" />
            Tier-1 Wholesale Margins Active
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
            Distributor Hardware Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Browse all certified hardware models with active dealer pricing and minimum batch quantities.
            Add items to your order cart for instant purchase order generation and freight dispatch.
          </p>
        </div>
      </div>

      {/* ── Master Product Grid with Distributor Wholesale Pricing ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E5E0] p-4 sm:p-6 lg:p-8 shadow-xs">
        <ProductGrid
          showHeader={false}
          isDistributorContext={true}
        />
      </div>
    </div>
  );
}

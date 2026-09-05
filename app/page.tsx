import React from "react";
import Hero from "@/components/Hero";
import CategoryShelf from "@/components/CategoryShelf";
import UseCasesGrid from "@/components/UseCasesGrid";
import ProductCard from "@/components/ProductCard";
import TrustStrip from "@/components/TrustStrip";
import DealerCalloutBand from "@/components/DealerCalloutBand";
import { getProducts } from "@/lib/products";
import { Shield } from "lucide-react";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-paper-50 text-graphite-900">
      {/* Hero Section */}
      <Hero />

      {/* Shop by Category Shelf (4 tiles with real product photos) */}
      <CategoryShelf />

      {/* Shop by Use Cases Grid (6 tiles) */}
      <UseCasesGrid />

      {/* Featured Products Grid */}
      <section className="py-16 bg-paper-50 border-b border-steel-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-space font-bold text-2xl sm:text-3xl text-graphite-900">
                Featured Hardware Range
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-steel-500 bg-steel-100 px-3 py-1.5 rounded">
              <Shield className="w-4 h-4 text-brass-600" /> All items tested to 250k cycles
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Dealer Wholesale CTA Band */}
      <DealerCalloutBand />
    </div>
  );
}

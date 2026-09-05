import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, FALLBACK_PRODUCTS } from "@/lib/products";
import { SlidersHorizontal, ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CATEGORY_NAMES: Record<string, { title: string; desc: string }> = {
  "door-locks": {
    title: "Door Locks & Cylinder Bodies",
    desc: "Heavy duty 6-pin brass euro mortise lock cylinders, smart biometric locks, and high security deadlock bodies.",
  },
  handles: {
    title: "Architectural Lever Handles",
    desc: "Solid forged brass and stainless steel door handles with ergonomic spring-loaded lever mechanisms.",
  },
  "bolts-latches": {
    title: "Bolts & Latches",
    desc: "Concealed flush tower bolts, quiet magnetic latches, and heavy duty door deadbolts.",
  },
  accessories: {
    title: "Hardware Accessories & Hinges",
    desc: "3D adjustable ball bearing concealed hinges, overhead hydraulic closers, and escutcheon plates.",
  },
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const catInfo = CATEGORY_NAMES[slug] || {
    title: slug.replace("-", " ").toUpperCase(),
    desc: "Precision locksmith and architectural hardware fittings.",
  };

  const products = await getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb & Navigation Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-steel-500 hover:text-graphite-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-mono text-steel-400">
            Catalog / Category / {slug}
          </span>
        </div>

        {/* Category Header */}
        <div className="bg-graphite-900 text-white p-8 sm:p-10 hairline-border mb-10 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs text-brass-500 uppercase tracking-widest block mb-2">
              CATEGORY CATALOG
            </span>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-3">
              {catInfo.title}
            </h1>
            <p className="font-inter text-steel-400 text-sm leading-relaxed">
              {catInfo.desc}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-steel-100 text-xs font-mono text-steel-500">
            <span>SHOWING {products.length} PRECISION ITEMS</span>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter: All Finishes & Specs
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 text-center hairline-border">
              <p className="text-steel-500 font-mono text-sm">No items found in this category.</p>
              <Link href="/" className="inline-block mt-4 text-xs font-space font-semibold text-brass-600 underline">
                Return to home catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

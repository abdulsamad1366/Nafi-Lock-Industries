import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProductsByUseCase } from "@/lib/products";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface UseCasePageProps {
  params: {
    slug: string;
  };
}

const USE_CASE_INFOS: Record<string, { title: string; subtitle: string; requirements: string[] }> = {
  "main-entrance": {
    title: "Main Entrance Hardware",
    subtitle: "High security mortise lock bodies, dimple key cylinders, and heavy duty entrance handles.",
    requirements: ["ANSI Grade 1 Security", "Anti-drill Hardened Pins", "5 Computerised Keys"],
  },
  bedroom: {
    title: "Bedroom Door Fittings",
    subtitle: "Privacy mortise lever handle sets providing smooth, reliable latching.",
    requirements: ["Keyed Both Sides / Thumbturn Option", "Ergonomic Spring Rosette", "Silent Operation"],
  },
  bathroom: {
    title: "Bathroom Privacy Latches",
    subtitle: "Moisture-resistant hardware with magnetic latches and external emergency release.",
    requirements: ["Stainless & Brass PVD Finish", "Emergency Coin Slot Release", "Silent Latching"],
  },
  kitchen: {
    title: "Kitchen Cabinet & Door Hardware",
    subtitle: "Heavy-use pull handles and anti-corrosive fittings engineered for high humidity.",
    requirements: ["Grade 304 Solid Brass", "PVD Fingerprint-Proof Coating", "High Load Capacity"],
  },
  wardrobe: {
    title: "Wardrobe & Furniture Pulls",
    subtitle: "Milled brass cabinet handles and concealed hinges for high-end carpentry.",
    requirements: ["Concealed Fixing Screws", "180 Degree Hinge Opening", "Precision Milled Bars"],
  },
  office: {
    title: "Commercial & Office Doors",
    subtitle: "Fire-rated overhead closers, biometric access locks, and high traffic hinges.",
    requirements: ["EN 1154 Fire Rated", "Biometric Access Control", "250,000 Cycle Tested"],
  },
};

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = params;
  const info = USE_CASE_INFOS[slug] || {
    title: slug.replace("-", " ").toUpperCase(),
    subtitle: "Architectural hardware application specification.",
    requirements: ["ISO 9001 Certified", "Precision Engineering"],
  };

  const products = await getProductsByUseCase(slug);

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-steel-500 hover:text-graphite-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-mono text-steel-400">
            Catalog / Shop by Use / {slug}
          </span>
        </div>

        {/* Use Case Header */}
        <div className="bg-graphite-900 text-white p-8 sm:p-10 hairline-border mb-10">
          <div className="max-w-3xl">
            <span className="font-mono text-xs text-brass-500 uppercase tracking-widest block mb-2">
              APPLICATION MATCH
            </span>
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-3">
              {info.title}
            </h1>
            <p className="font-inter text-steel-400 text-sm leading-relaxed mb-6">
              {info.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brass-500">
              {info.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-graphite-800 px-3 py-1.5 rounded border border-graphite-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brass-500" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <div className="mb-6 text-xs font-mono text-steel-500 uppercase">
            RECOMMENDED HARDWARE ({products.length} MATCHES)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

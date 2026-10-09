import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Architectural Lock Catalog & Security Systems | Nafi Lock Industries",
  description:
    "Explore the complete Nafi Lock Industries hardware catalog. Solid brass padlocks, commercial mortise systems, pin cylinders, and armored boron locks engineered in Aligarh since 1995.",
  openGraph: {
    title: "Nafi Lock Industries — Master Product Catalog",
    description:
      "Precision-forged solid brass padlocks, commercial mortise sets, and armored locks. Tier-1 wholesale and architectural hardware.",
  },
};

/**
 * ============================================================================
 * Page: Products Listing Page (/products)
 * ============================================================================
 * Dedicated Product Listing Page (PLP) featuring:
 * 1. Breadcrumbs & Architectural Hero Header
 * 2. 4 Foundry Quality Standard Badges
 * 3. Master Interactive Product Grid with dual-tier brand & category filtering
 * 4. Factory Wholesale & Dealership Consultation Banner
 */
export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* ── 1. Architectural Hero Header ── */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE7DF] bg-gradient-to-b from-[#F7F5EE] via-[#FAF9F5] to-[#FBFBFA] overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-[#A98048]/10 to-transparent pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-mono text-[#78716C] flex items-center gap-2">
            <Link href="/" className="hover:text-[#A98048] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1C1917] font-semibold">Products Catalog</span>
          </nav>

          <div className="max-w-3xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#A98048]" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#A98048] font-bold">
                DIRECT FROM ALIGARH FOUNDRY • EST. 1995
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1917] tracking-tight mb-4 leading-[1.15]">
              Master Security &amp; Lock Catalog
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed mb-6 max-w-2xl">
              Engineered with pure forged solid brass, case-hardened boron steel, and Swiss-grade tumbler cores.
              Explore our complete architectural hardware range spanning S-Nafi, Greek, and Raksham.
            </p>
          </div>

          {/* ── 2. Four Foundry Trust Strips ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-6 border-t border-[#EAE7DF]">
            {/* Pillar 1 */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E5E0] shadow-2xs">
              <div className="text-[#A98048] font-serif font-bold text-sm mb-0.5">100% Solid Brass</div>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Heavy forged brass bodies with anti-corrosion heritage finishes.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E5E0] shadow-2xs">
              <div className="text-[#A98048] font-serif font-bold text-sm mb-0.5">Boron Alloy Defense</div>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Hydraulic cutter-resistant shackles and anti-drill armored shields.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E5E0] shadow-2xs">
              <div className="text-[#A98048] font-serif font-bold text-sm mb-0.5">EN 1303 &amp; ISO Quality</div>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Certified for 100,000+ mechanical cycles with zero play tolerance.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E5E0] shadow-2xs">
              <div className="text-[#A98048] font-serif font-bold text-sm mb-0.5">Direct Factory Terms</div>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Tier-1 wholesale margins and direct insured dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Main Product Grid Section ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <ProductGrid showHeader={false} />
      </section>

      {/* ── 4. Factory Wholesale & Dealership Consultation Strip ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#1C1917] text-white">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C49B55] font-bold block">
            B2B DISTRIBUTION &amp; ARCHITECTURAL CONTRACTS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Interested in stocking Nafi locks in your territory?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            We partner with regional hardware distributors, builders, and export trading houses.
            Receive our master price list, sample dispatch, and dedicated account manager support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#A98048] hover:bg-[#C49B55] text-white text-xs font-serif font-bold transition-all shadow-md text-center cursor-pointer"
            >
              Apply for Distributor Dealership →
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-serif font-bold transition-all text-center"
            >
              Contact Sales Engineering Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

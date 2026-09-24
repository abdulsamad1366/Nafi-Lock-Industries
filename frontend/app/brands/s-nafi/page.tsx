import ProductGrid from "@/components/ProductGrid";

/**
 * ============================================================================
 * Brand Showcase Page: S-Nafi
 * ============================================================================
 * Dedicated product and heritage page for the flagship S-Nafi brand.
 *
 * Theme Association:
 * Operates on the primary brass/gold palette defined in globals.css (:root).
 * Does not require custom `data-theme` overrides as it aligns with the default.
 *
 * Page Sections:
 * 1. Brand Hero: S-Nafi brass heritage, craftsmanship story, and positioning.
 * 2. Brand Product Grid: Focused inventory filtered exclusively to S-Nafi locks.
 * 3. Why S-Nafi: Distinct material advantages (pure forged solid brass, anti-corrosion).
 * 4. Dealer CTA: Inquiry button pre-filtered for S-Nafi dealer inquiries.
 */
export default function SNafiBrandPage() {
  return (
    <div>
      {/* ── Section 1: Brand Hero & Positioning ── */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">S-Nafi</h1>
          <p className="text-accent text-lg mb-6 font-medium">
            Premium brass craftsmanship
          </p>
          <p className="text-muted max-w-prose leading-relaxed">
            S-Nafi represents the flagship line of Nafi Lock Industries — precision-engineered
            solid brass locks built to last generations, offering timeless elegance and
            unyielding security.
          </p>
        </div>
      </section>

      {/* ── Section 2: Filtered Product Grid ── */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">S-Nafi Products</h2>
        <ProductGrid brandFilter="s-nafi" hideFilters={true} />
      </section>

      {/* ── Section 3: Value Proposition / Brand Differentiators ── */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why S-Nafi</h2>
        <p className="text-muted max-w-prose leading-relaxed">
          Engineered from high-density solid forged brass, every S-Nafi cylinder is
          hand-inspected for microscopic tolerances, weather resistance, and maximum
          tamper defense.
        </p>
      </section>

      {/* ── Section 4: Dealer & Distribution Call to Action ── */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking S-Nafi?</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Contact our distributor relations team for dealership catalogues, MOQ details,
          and regional wholesale terms.
        </p>
        <a
          href="/contact?brand=s-nafi"
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

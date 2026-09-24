import "./theme.css";
import ProductGrid from "@/components/ProductGrid";

/**
 * ============================================================================
 * Brand Showcase Page: Raksham
 * ============================================================================
 * Dedicated product and heritage page for the Raksham heavy-duty lock brand.
 *
 * Theme Association:
 * Injects `data-theme="raksham"` on the wrapper container.
 * This automatically activates the guardian crimson / fortified steel
 * color tokens defined in globals.css for all child components and typography.
 *
 * Page Sections:
 * 1. Brand Hero: Fortress security, warehouse protection, and hardened steel.
 * 2. Brand Product Grid: Focused inventory filtered to Raksham locks.
 * 3. Why Raksham: Maximum tamper resistance, anti-drilling & anti-pick defense.
 * 4. Dealer CTA: Direct contact link pre-configured with query parameter ?brand=raksham.
 */
export default function RakshamBrandPage() {
  return (
    <div data-theme="raksham">
      {/* ── Section 1: Brand Hero & Heavy-Duty Security Positioning ── */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">Raksham</h1>
          <p className="text-accent text-lg mb-6 font-medium">
            Guardian-grade protection
          </p>
          <p className="text-muted max-w-prose leading-relaxed">
            Raksham — meaning protection — delivers fortified, hardened steel security
            solutions engineered for homes, industrial warehouses, and critical commercial premises.
          </p>
        </div>
      </section>

      {/* ── Section 2: Raksham Filtered Product Grid ── */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">Raksham Products</h2>
        <ProductGrid brandFilter="raksham" hideFilters={true} />
      </section>

      {/* ── Section 3: Brand Differentiator ── */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why Raksham</h2>
        <p className="text-muted max-w-prose leading-relaxed">
          Tested against physical force, lock-picking, and environmental corrosion.
          Raksham uses heat-treated boron steel shackles and armored keyways.
        </p>
      </section>

      {/* ── Section 4: Dealership & Distribution CTA ── */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking Raksham?</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Contact our distributor relations team for dealership catalogues, MOQ details,
          and regional wholesale terms.
        </p>
        <a
          href="/contact?brand=raksham"
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

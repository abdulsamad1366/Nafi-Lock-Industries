import "./theme.css";

/**
 * ============================================================================
 * Brand Showcase Page: Greek
 * ============================================================================
 * Dedicated product and heritage page for the Greek lock brand line.
 *
 * Theme Association:
 * Injects `data-theme="greek"` on the wrapper container.
 * This automatically activates the Aegean blue and marble color tokens
 * defined in globals.css for all child components and typography.
 *
 * Page Sections:
 * 1. Brand Hero: Classical aesthetics, architectural endurance, and iron strength.
 * 2. Brand Product Grid: Focused inventory filtered to Greek locks.
 * 3. Why Greek: Classical strength paired with modern hardened steel security.
 * 4. Dealer CTA: Direct contact link pre-configured with query parameter ?brand=greek.
 */
export default function GreekBrandPage() {
  return (
    <div data-theme="greek">
      {/* ── Section 1: Brand Hero & Classical Identity ── */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">Greek</h1>
          <p className="text-accent text-lg mb-6 font-medium">
            Classical strength, modern security
          </p>
          <p className="text-muted max-w-prose leading-relaxed">
            Inspired by the enduring architecture of the ancient world, Greek locks
            combine iron resilience with timeless aesthetic design for residential and
            commercial spaces.
          </p>
        </div>
      </section>

      {/* ── Section 2: Greek Filtered Product Grid ── */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">Greek Products</h2>
        {/* Product catalog will be loaded from backend API filtered by brand="greek" */}
        <p className="text-muted">Products loading…</p>
      </section>

      {/* ── Section 3: Brand Differentiator ── */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why Greek</h2>
        <p className="text-muted max-w-prose leading-relaxed">
          Crafted with architectural finesse and heavy-duty internal tumbler systems,
          Greek locks provide unshakeable peace of mind with classical elegance.
        </p>
      </section>

      {/* ── Section 4: Dealership & Distribution CTA ── */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking Greek?</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Contact our distributor relations team for dealership catalogues, MOQ details,
          and regional wholesale terms.
        </p>
        <a
          href="/contact?brand=greek"
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

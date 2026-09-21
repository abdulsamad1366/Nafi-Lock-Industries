import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import BrandCard from "@/components/BrandCard";

/**
 * ============================================================================
 * Page Component: HomePage
 * ============================================================================
 * Primary landing page for Nafi Lock Industries.
 *
 * Page Architecture (5 Core Sections):
 * 1. Hero Section: Company tagline, brand introduction, and primary explore CTA.
 * 2. Brand Strip: Equal-weight 3-column showcase of S-Nafi, Greek, and Raksham.
 * 3. Product Catalog Grid: Interactive product display with brand filtering tabs.
 * 4. Why Nafi (Trust Section): Heritage, precision engineering, and quality proofs.
 * 5. Bottom CTA Banner: Prompts prospective dealers and clients to get in touch.
 *
 * Theming:
 * Operates on the default Nafi/brass theme tokens defined in globals.css (:root)
 * with a white background and gold/brass accents.
 */
export default function HomePage() {
  return (
    <>
      {/* ── Section 1: Hero Banner ── */}
      <Hero />

      {/* ── Section 2: Brand Showcase Strip ── */}
      <section id="brands" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headline text-2xl mb-10">Our Brands</h2>
          {/* Responsive 3-column grid for the three sister brands */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrandCard
              slug="s-nafi"
              name="S-Nafi"
              tagline="Premium brass craftsmanship"
            />
            <BrandCard
              slug="greek"
              name="Greek"
              tagline="Classical strength, modern security"
            />
            <BrandCard
              slug="raksham"
              name="Raksham"
              tagline="Guardian-grade protection"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Full Product Catalog with Filter Tabs ── */}
      <section className="py-20 px-6 border-t border-divider">
        <ProductGrid />
      </section>

      {/* ── Section 4: Why Nafi — Heritage & Trust Proofs ── */}
      <section className="py-20 px-6 border-t border-divider">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headline text-2xl mb-6">Why Nafi Lock Industries</h2>
          <p className="text-muted max-w-prose leading-relaxed">
            Manufacturing heritage, precision engineering, and a commitment to quality
            that spans generations. Built with high-grade solid brass, hardened steel,
            and strict ISO 9001:2015 certified quality controls.
          </p>
        </div>
      </section>

      {/* ── Section 5: Direct Factory Inquiries / Wholesale CTA ── */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in our products?</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Connect with our sales team for bulk dealership inquiries, catalog requests,
          and custom OEM specifications.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}

import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import BrandShowcase from "@/components/BrandShowcase";
import ProductGrid from "@/components/ProductGrid";

/**
 * ============================================================================
 * Page Component: HomePage
 * ============================================================================
 * Primary landing page for Nafi Lock Industries.
 *
 * Page Architecture:
 * 1. Hero Section: Full-width pure image panoramic carousel.
 * 2. Signature Categories: Circular product category cards (Velisqa style).
 * 3. Flagship Brands Showcase: Architectural 3-card split showcase with trust strip.
 * 4. Product Catalog Grid: Interactive product display with brand filtering tabs.
 * 5. Why Nafi (Trust Section): Heritage, precision engineering, and quality proofs.
 * 6. Bottom CTA Banner: Prompts prospective dealers and clients to get in touch.
 *
 * Theming:
 * Operates on the default Nafi/brass theme tokens defined in globals.css (:root)
 * with a white background and gold/brass accents.
 */
export default function HomePage() {
  return (
    <>
      {/* ── Section 1: Pure Panoramic Image Hero Banner ── */}
      <Hero />

      {/* ── Section 2: Signature Categories Circular Showcase (Velisqa Style) ── */}
      <CategoryCarousel />

      {/* ── Section 3: Flagship Brands Showcase (Exact Reference Design) ── */}
      <BrandShowcase />

      {/* ── Section 4: Full Product Catalog with Filter Tabs ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FBFBFA]">
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

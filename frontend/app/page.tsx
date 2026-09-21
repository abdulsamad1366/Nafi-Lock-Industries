import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import BrandCard from "@/components/BrandCard";

/**
 * Home page — Nafi/brass palette (default theme).
 *
 * Sections per 05-SITE-MAP-AND-PAGES.md:
 * 1. Hero — company tagline
 * 2. Brand strip — 3 equal-weight cards (S-Nafi, Greek, Raksham)
 * 3. Full product catalog — all brands, with filter tabs
 * 4. Why Nafi — trust section (content TBD)
 * 5. CTA → Contact
 * 6. Footer (in layout)
 */
export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Brand strip */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-10">Our Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Brand cards will be populated from API */}
          <BrandCard slug="s-nafi" name="S-Nafi" tagline="Premium brass craftsmanship" />
          <BrandCard slug="greek" name="Greek" tagline="Classical strength, modern security" />
          <BrandCard slug="raksham" name="Raksham" tagline="Guardian-grade protection" />
        </div>
      </section>

      {/* 3. Full product catalog */}
      <section className="py-20 px-6 border-t border-divider">
        <ProductGrid />
      </section>

      {/* 4. Why Nafi — content TBD */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why Nafi Lock Industries</h2>
        <p className="text-muted max-w-prose">
          Manufacturing heritage, precision engineering, and a commitment to quality
          that spans generations. Content to be provided.
        </p>
      </section>

      {/* 5. CTA → Contact */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in our products?</h2>
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

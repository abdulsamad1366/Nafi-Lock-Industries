import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import BrandShowcase from "@/components/BrandShowcase";
import ProductGrid from "@/components/ProductGrid";
import WhyNafi from "@/components/WhyNafi";
import FactoryCTA from "@/components/FactoryCTA";

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
 * 4. Product Catalog Grid: Interactive product display with category pills & search.
 * 5. Why Nafi: 35+ years heritage, 4 pillars of excellence, interactive production floor.
 * 6. Factory Wholesale & Dealership Hub: B2B partnership engine & direct factory contact.
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

      {/* ── Section 4: Full Product Catalog with Filter Tabs (Reference Match) ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FBFBFA]">
        <ProductGrid />
      </section>

      {/* ── Section 5: Why Nafi — Heritage, Metrics & 4 Pillars of Excellence ── */}
      <WhyNafi />

      {/* ── Section 6: Direct Factory Inquiries / Wholesale Dealership Hub ── */}
      <FactoryCTA />
    </>
  );
}

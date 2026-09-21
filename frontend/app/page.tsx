import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandCard from "@/components/BrandCard";

/**
 * ============================================================================
 * Page Component: HomePage
 * ============================================================================
 * Primary landing page for Nafi Lock Industries.
 *
 * Page Architecture:
 * 1. Hero Section: Full-width pure image panoramic carousel.
 * 2. Signature Categories: Circular product category cards (Velisqa style).
 * 3. Brand Strip: Equal-weight 3-column showcase of S-Nafi, Greek, and Raksham.
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

      {/* ── Section 3: Flagship Brands Showcase Strip ── */}
      <section id="brands" className="py-20 sm:py-24 px-6 bg-surface-subtle/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading & Positioning */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-xs font-semibold text-accent block mb-3">
              Three Houses of Engineering Excellence
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">
              Our Flagship Brands
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Three specialized manufacturing traditions united under Nafi Lock Industries’
              heritage of metallurgical integrity, Swiss pin-tumbler precision, and unyielding fortress defense.
            </p>
          </div>

          {/* Responsive 3-column architectural grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            <BrandCard
              slug="s-nafi"
              name="S-Nafi"
              badge="Royal Flagship • 100% Solid Brass"
              tagline="Artisanal Solid Brass Masterpieces"
              description="Hand-forged mortise cylinders and engraved royal brass padlocks built with solid metallurgical cores for prestigious architectural estates."
              imageSrc="/images/hero-s-nafi.jpg"
              altText="S-Nafi Solid Forged Brass Royal Emblem Padlock"
              accentColor="#B8923F"
              spec1Label="Core Metallurgy"
              spec1Value="100% Solid Brass"
              spec2Label="Corrosion Rating"
              spec2Value="Zero-Tarnish Anti-Rust"
              ctaText="Explore S-Nafi Brass"
            />
            <BrandCard
              slug="greek"
              name="Greek"
              badge="Architectural • Swiss-Precision"
              tagline="Classical Strength & Mortise Systems"
              description="High-security 6-pin brass tumbler mechanisms encased within heavy brushed architectural chrome, built for silent and flawless door operation."
              imageSrc="/images/hero-greek.jpg"
              altText="Greek Architectural Mortise Lock Cylinder Mechanism"
              accentColor="#2A6F97"
              spec1Label="Tumbler Pin System"
              spec1Value="6-Pin Anti-Pick Core"
              spec2Label="Finish Grade"
              spec2Value="Brushed Chrome Satin"
              ctaText="Explore Greek Series"
            />
            <BrandCard
              slug="raksham"
              name="Raksham"
              badge="Fortress • Grade-6 Security"
              tagline="Guardian-Grade Industrial Defense"
              description="Ultra-hardened boron steel alloy shackles and armored bodies engineered to resist hydraulic shears, angle grinders, and forced entry."
              imageSrc="/images/hero-raksham.jpg"
              altText="Raksham Grade-6 Heavy-Duty Armored Padlock"
              accentColor="#B91C1C"
              spec1Label="Security Standard"
              spec1Value="Grade-6 Anti-Cut Steel"
              spec2Label="Shackle Alloy"
              spec2Value="Hardened Boron Core"
              ctaText="Explore Raksham Armor"
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

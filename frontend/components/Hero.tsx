/**
 * ============================================================================
 * Component: Hero
 * ============================================================================
 * Primary visual introduction displayed on the homepage.
 *
 * Structure:
 * - Brand Headline: Large Fraunces serif typography establishing brand presence.
 * - Subtitle / Tagline: Summarizes the 3-brand multi-segment strategy.
 * - Call-to-Action (CTA): Anchor button navigating to the brands showcase.
 *
 * Styling Notes:
 * - Uses border-b border-divider for clean architectural separation.
 * - The CTA button uses bg-accent with crisp text-white and subtle shadow-sm.
 */
export default function Hero() {
  return (
    <section className="py-32 px-6 border-b border-divider">
      <div className="max-w-4xl">
        {/* ── Main Company Heading ── */}
        <h1 className="font-headline text-5xl md:text-6xl mb-6">
          Nafi Lock Industries
        </h1>

        {/* ── Company Tagline & Value Proposition ── */}
        <p className="text-muted text-lg md:text-xl max-w-prose mb-8">
          Three brands — S-Nafi, Greek, Raksham — one legacy of
          precision-engineered locks for every need.
        </p>

        {/* ── Call to Action: Scroll to Brand Showcase ── */}
        <a
          href="#brands"
          className="inline-block px-6 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Explore Our Brands
        </a>
      </div>
    </section>
  );
}

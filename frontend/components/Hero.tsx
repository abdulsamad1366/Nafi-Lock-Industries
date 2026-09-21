/**
 * Hero section — Nafi Lock Industries intro + company tagline.
 * One deliberate motion moment (hero reveal) per design system guidelines.
 */
export default function Hero() {
  return (
    <section className="py-32 px-6 border-b border-divider">
      <div className="max-w-4xl">
        <h1 className="font-headline text-5xl md:text-6xl mb-6">
          Nafi Lock Industries
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-prose mb-8">
          Three brands — S-Nafi, Greek, Raksham — one legacy of
          precision-engineered locks for every need.
        </p>
        <a
          href="#brands"
          className="inline-block px-6 py-3 bg-accent text-background font-medium rounded hover:bg-accent-hover transition-colors"
        >
          Explore Our Brands
        </a>
      </div>
    </section>
  );
}

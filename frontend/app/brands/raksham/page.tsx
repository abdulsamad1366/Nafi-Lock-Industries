import "./theme.css";

/**
 * Raksham brand page — guardian red/gunmetal palette applied via theme.css.
 */
export default function RakshamBrandPage() {
  return (
    <div data-theme="raksham">
      {/* Brand Hero */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">Raksham</h1>
          <p className="text-accent text-lg mb-6">Guardian-grade protection</p>
          <p className="text-muted max-w-prose">
            Raksham — meaning protection — delivers hardened steel security for
            homes, warehouses, and commercial premises.
          </p>
        </div>
      </section>

      {/* Product grid — filtered to Raksham only */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">Raksham Products</h2>
        <p className="text-muted">Products loading…</p>
      </section>

      {/* Why This Brand — content TBD */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why Raksham</h2>
        <p className="text-muted max-w-prose">Brand differentiator content to be provided.</p>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking Raksham?</h2>
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

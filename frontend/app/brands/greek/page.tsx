import "./theme.css";

/**
 * Greek brand page — Aegean blue/marble palette applied via theme.css.
 */
export default function GreekBrandPage() {
  return (
    <div data-theme="greek">
      {/* Brand Hero */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">Greek</h1>
          <p className="text-accent text-lg mb-6">Classical strength, modern security</p>
          <p className="text-muted max-w-prose">
            Inspired by the enduring architecture of the ancient world, Greek locks
            combine iron resilience with timeless design.
          </p>
        </div>
      </section>

      {/* Product grid — filtered to Greek only */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">Greek Products</h2>
        <p className="text-muted">Products loading…</p>
      </section>

      {/* Why This Brand — content TBD */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why Greek</h2>
        <p className="text-muted max-w-prose">Brand differentiator content to be provided.</p>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking Greek?</h2>
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

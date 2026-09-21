/**
 * S-Nafi brand page — uses the default Nafi/brass palette (no theme.css needed,
 * since it matches the :root defaults).
 */
export default function SNafiBrandPage() {
  return (
    <div>
      {/* Brand Hero */}
      <section className="py-24 px-6 border-b border-divider">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl md:text-5xl mb-4">S-Nafi</h1>
          <p className="text-accent text-lg mb-6">Premium brass craftsmanship</p>
          <p className="text-muted max-w-prose">
            S-Nafi represents the flagship line of Nafi Lock Industries — precision-engineered
            brass locks built to last generations.
          </p>
        </div>
      </section>

      {/* Product grid — filtered to S-Nafi only */}
      <section className="py-20 px-6">
        <h2 className="font-headline text-2xl mb-8">S-Nafi Products</h2>
        {/* ProductGrid component will be rendered here with brand filter */}
        <p className="text-muted">Products loading…</p>
      </section>

      {/* Why This Brand — content TBD */}
      <section className="py-20 px-6 border-t border-divider">
        <h2 className="font-headline text-2xl mb-6">Why S-Nafi</h2>
        <p className="text-muted max-w-prose">Brand differentiator content to be provided.</p>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-divider text-center">
        <h2 className="font-headline text-xl mb-4">Interested in stocking S-Nafi?</h2>
        <a
          href="/contact?brand=s-nafi"
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover transition-colors shadow-sm"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

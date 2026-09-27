import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-divider rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-divider pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              Commercial Dealership Agreement
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-primary">
              Terms of Service & Dealership Terms
            </h1>
            <p className="text-xs font-mono text-muted mt-2">
              Effective Date: September 2026 · Aligarh Foundry Division
            </p>
          </div>

          <div className="prose prose-sm text-muted space-y-4 leading-relaxed text-xs sm:text-sm">
            <p>
              Welcome to the commercial portal of Nafi Lock Industries. By submitting wholesale procurement orders, accessing distributor pricing tiers, or operating as an authorized trade partner, you agree to these Terms of Dealership and Wholesale Supply.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              1. Minimum Order Quantities & Batching
            </h3>
            <p>
              Wholesale pricing is subject to factory carton batching minimums. Orders placed below specified master carton counts may be adjusted or invoiced under standard retail rates at our discretion.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              2. Consignment Dispatch & Freight Risk
            </h3>
            <p>
              All hardware orders are inspected, packaged, and dispatched ex-foundry from Aligarh, Uttar Pradesh. Risk in transit transfers upon handoff to registered carrier logistics unless transit insurance is explicitly specified.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              3. Commercial Warranty & Factory Standards
            </h3>
            <p>
              Nafi Lock Industries guarantees all brass, hardened shackle, and mortise hardware against metallurgical defects and manufacturing flaws under standard installation conditions.
            </p>
          </div>

          <div className="pt-6 border-t border-divider flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-serif font-bold text-accent hover:underline inline-flex items-center gap-1.5"
            >
              ← Return to Main Portal
            </Link>
            <Link
              href="/contact"
              className="text-xs font-serif text-muted hover:text-primary transition-colors"
            >
              Factory Commercial Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

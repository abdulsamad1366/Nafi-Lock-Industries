import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-divider rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-divider pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              Legal & Compliance
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-primary">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-muted mt-2">
              Last updated: September 2026 · Nafi Lock Industries
            </p>
          </div>

          <div className="prose prose-sm text-muted space-y-4 leading-relaxed text-xs sm:text-sm">
            <p>
              At Nafi Lock Industries, safeguarding your commercial privacy and proprietary dealer data is foundational to our enterprise partnerships. This Privacy Policy outlines how commercial entity records, distributor GST credentials, contact communications, and procurement transactions are managed.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              1. Commercial & Entity Data Collection
            </h3>
            <p>
              We collect enterprise information necessary to verify wholesale accounts, including registered firm names, GSTIN identification, delivery warehouse coordinates, and authorized representative contact details.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              2. B2B Transaction & Ledger Records
            </h3>
            <p>
              All wholesale purchase orders, invoice dispatches, freight consignment tracking, and commercial ledger settlements are retained securely for accounting compliance and factory logistics coordination.
            </p>
            <h3 className="font-serif font-bold text-base text-primary pt-2">
              3. Data Protection & Confidentiality
            </h3>
            <p>
              We do not sell, rent, or lease dealer commercial records to third-party marketing entities. Information is shared strictly with authorized logistics partners and factory dispatch personnel to fulfill hardware consignments.
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
              Contact Compliance Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

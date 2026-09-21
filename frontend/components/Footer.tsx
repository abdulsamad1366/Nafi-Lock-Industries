import Link from "next/link";

/**
 * ============================================================================
 * Component: Footer
 * ============================================================================
 * Global site footer rendered across all pages at the bottom of the layout.
 *
 * Structure (3 Columns + Bottom Copyright Bar):
 * - Column 1: Company identity, brand statement, and manufacturing legacy.
 * - Column 2: Quick navigation links to sister brand showcases and contact.
 * - Column 3: Contact information, customer care, and website domain.
 * - Bottom Bar: Dynamic copyright notice with current year.
 */
export default function Footer() {
  return (
    <footer className="border-t border-divider bg-surface py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Column 1: Company Profile ── */}
        <div>
          <h3 className="font-headline text-lg text-accent mb-3">
            Nafi Lock Industries
          </h3>
          <p className="text-muted text-sm max-w-prose leading-relaxed">
            Three brands, one legacy of precision-engineered locks. Trusted by
            dealers and distributors nationwide since 1995.
          </p>
        </div>

        {/* ── Column 2: Quick Links ── */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/brands/s-nafi" className="hover:text-primary transition-colors">
                S-Nafi (Brass Craftsmanship)
              </Link>
            </li>
            <li>
              <Link href="/brands/greek" className="hover:text-primary transition-colors">
                Greek (Classical Security)
              </Link>
            </li>
            <li>
              <Link href="/brands/raksham" className="hover:text-primary transition-colors">
                Raksham (Guardian-Grade Defense)
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact & Dealership Inquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Column 3: Contact & Distribution Information ── */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-primary">Contact</h4>
          <p className="text-muted text-sm">
            Industrial Area, Aligarh, Uttar Pradesh, India
          </p>
          <p className="text-muted text-sm mt-1">
            Email & Wholesale desk to be provided
          </p>
          <p className="text-muted text-sm mt-1">
            www.nafilockindustries.com
          </p>
        </div>
      </div>

      {/* ── Bottom Bar: Copyright & Legal ── */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-divider text-center text-xs text-muted">
        © {new Date().getFullYear()} Nafi Lock Industries. All rights reserved.
      </div>
    </footer>
  );
}

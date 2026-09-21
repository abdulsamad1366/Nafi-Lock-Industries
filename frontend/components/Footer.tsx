import Link from "next/link";

/**
 * Site footer — company info, quick links.
 */
export default function Footer() {
  return (
    <footer className="border-t border-divider py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company */}
        <div>
          <h3 className="font-headline text-lg text-accent mb-3">Nafi Lock Industries</h3>
          <p className="text-muted text-sm max-w-prose">
            Three brands, one legacy of precision-engineered locks.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/brands/s-nafi" className="hover:text-primary">S-Nafi</Link></li>
            <li><Link href="/brands/greek" className="hover:text-primary">Greek</Link></li>
            <li><Link href="/brands/raksham" className="hover:text-primary">Raksham</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        {/* Contact info — TBD */}
        <div>
          <h4 className="text-sm font-medium mb-3">Contact</h4>
          <p className="text-muted text-sm">
            Email and phone to be provided.
          </p>
          <p className="text-muted text-sm mt-1">
            www.nafilockindustries.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-divider text-center text-xs text-muted">
        © {new Date().getFullYear()} Nafi Lock Industries. All rights reserved.
      </div>
    </footer>
  );
}

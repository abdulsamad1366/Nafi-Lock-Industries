import Link from "next/link";

/**
 * ============================================================================
 * Component: Header
 * ============================================================================
 * Main navigation header displayed across the application below the top marquee.
 *
 * Architecture & Decision Log Compliance:
 * - Decision #3: Each of the three flagship brands (S-Nafi, Greek, Raksham)
 *   is elevated as a first-class top-level navigation item.
 * - Semantic Structure: Uses <header> and <nav> with max-w-6xl container.
 * - Dynamic Styling: Links transition from text-muted to text-primary on hover.
 */
export default function Header() {
  // Navigation route configuration
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/brands/s-nafi", label: "S-Nafi" },
    { href: "/brands/greek", label: "Greek" },
    { href: "/brands/raksham", label: "Raksham" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-divider bg-background">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* ── Brand Wordmark / Home Link ── */}
        <Link href="/" className="font-headline text-xl text-accent tracking-wide">
          Nafi Lock Industries
        </Link>

        {/* ── Primary Navigation Links List ── */}
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

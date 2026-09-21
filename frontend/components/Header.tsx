import Link from "next/link";

/**
 * Site header — navigation: Home | S-Nafi | Greek | Raksham | Contact
 * Per 06-DECISIONS-LOG.md decision #3: each brand is a top-level nav item.
 */
export default function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/brands/s-nafi", label: "S-Nafi" },
    { href: "/brands/greek", label: "Greek" },
    { href: "/brands/raksham", label: "Raksham" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-divider">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-headline text-xl text-accent">
          Nafi Lock Industries
        </Link>
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

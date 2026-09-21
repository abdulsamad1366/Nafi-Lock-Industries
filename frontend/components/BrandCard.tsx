import Link from "next/link";

interface BrandCardProps {
  slug: string;
  name: string;
  tagline: string;
}

/**
 * Brand card — displayed in the Home page brand strip.
 * Equal-weight presentation, no tier badges (per decision #2).
 */
export default function BrandCard({ slug, name, tagline }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${slug}`}
      className="block bg-surface border border-divider rounded-lg p-8 hover:border-accent hover:shadow-md transition-all"
    >
      <h3 className="font-headline text-xl mb-2">{name}</h3>
      <p className="text-muted text-sm mb-4">{tagline}</p>
      <span className="text-accent text-sm font-medium">View →</span>
    </Link>
  );
}

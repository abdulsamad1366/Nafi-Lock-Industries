import Link from "next/link";

/**
 * ============================================================================
 * Props Interface: BrandCardProps
 * ============================================================================
 * - slug: URL path segment for the brand (e.g. "s-nafi", "greek", "raksham")
 * - name: Display title of the brand line
 * - tagline: Core market positioning summary for the brand
 */
interface BrandCardProps {
  slug: string;
  name: string;
  tagline: string;
}

/**
 * ============================================================================
 * Component: BrandCard
 * ============================================================================
 * Interactive navigation card displayed in the homepage brand strip.
 *
 * Design Guidelines:
 * - Equal-Weight Presentation: All three brands (S-Nafi, Greek, Raksham) receive
 *   identical visual prominence without hierarchical tier labels.
 * - Interactive Elevation: Features soft hover borders (hover:border-accent)
 *   and smooth card elevation (hover:shadow-md) over the white page backdrop.
 */
export default function BrandCard({ slug, name, tagline }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${slug}`}
      className="block bg-surface border border-divider rounded-lg p-8 hover:border-accent hover:shadow-md transition-all"
    >
      {/* ── Brand Title ── */}
      <h3 className="font-headline text-xl mb-2">{name}</h3>

      {/* ── Brand Description / Tagline ── */}
      <p className="text-muted text-sm mb-4">{tagline}</p>

      {/* ── Action Link Indicator ── */}
      <span className="text-accent text-sm font-medium">View →</span>
    </Link>
  );
}

import Link from "next/link";

/**
 * ============================================================================
 * Type Definition: MarqueeItem
 * ============================================================================
 * Represents a single message or trust badge displayed in the scrolling banner.
 * - icon: Optional emoji or symbol displayed before the text (e.g. ★, 🔒, ⚙️)
 * - badge: Optional styled pill badge (e.g. "ISO 9001:2015", "PAN-INDIA")
 * - label: Main descriptive text for the credential or message
 * - highlight: Accent-colored text callout for extra emphasis
 * - href: Optional internal link URL if the item is clickable (e.g. to /contact)
 */
interface MarqueeItem {
  icon?: string;
  badge?: string;
  label: string;
  highlight?: string;
  href?: string;
}

/**
 * ============================================================================
 * Data Source: ITEMS
 * ============================================================================
 * Curated list of manufacturer credentials, industry certifications,
 * brand portfolio highlights, and distributor call-to-actions.
 */
const ITEMS: MarqueeItem[] = [
  {
    icon: "★",
    label: "India's Best Lock Manufacturer",
    highlight: "Precision Engineering Since 1995",
  },
  {
    badge: "ISO 9001:2015",
    label: "Certified Quality Management & Safety Standards",
  },
  {
    icon: "🔒",
    label: "Three Flagship Brands:",
    highlight: "S-Nafi • Greek • Raksham",
  },
  {
    icon: "🛡️",
    label: "100% High-Grade Solid Brass & Hardened Steel Security",
  },
  {
    badge: "PAN-INDIA",
    label: "Trusted by 10,000+ Authorized Dealers & Distributors",
  },
  {
    icon: "⚙️",
    label: "Anti-Pick & Rust-Proof Cylinders Built for Generations",
  },
  {
    icon: "📦",
    label: "Direct Factory Wholesale & Custom OEM Inquiries",
    highlight: "Get in Touch →",
    href: "/contact",
  },
];

/**
 * ============================================================================
 * Component: Marquee
 * ============================================================================
 * Top-of-page announcement ribbon positioned above the site navigation header.
 *
 * Key Architecture & Styling Decisions:
 * 1. Dark Theme Isolation:
 *    The website body uses a clean white background, but this top marquee
 *    intentionally retains an exclusive dark industrial theme (#15130F)
 *    with gold brass highlights (#D4AF6A / #E6BF70) for premium aesthetic contrast.
 *
 * 2. Seamless Infinite Loop Animation:
 *    Renders two identical side-by-side tracks (Track 1 & Track 2).
 *    Both translate -100% via CSS keyframes. When Track 1 finishes translating,
 *    Track 2 seamlessly replaces it with zero visible jump or blank gap.
 *
 * 3. Pause on Hover:
 *    Configured via CSS (.marquee-bar:hover .animate-marquee) so users can
 *    pause the animation to comfortably read details or click links.
 *
 * 4. Gradient Edge Masks:
 *    Subtle left & right linear gradient overlays fade items softly into the
 *    edges rather than abruptly clipping against screen borders.
 */
export default function Marquee() {
  return (
    <div
      className="marquee-bar relative w-full overflow-hidden bg-[#15130F] border-b border-[#2D2820] text-xs py-2 select-none z-20"
      aria-label="Announcements & Certifications"
    >
      {/* ── Left Edge Fade Mask: Softens entry of scrolling items ── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#15130F] to-transparent z-10"
        aria-hidden="true"
      />

      {/* ── Right Edge Fade Mask: Softens exit of scrolling items ── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#15130F] to-transparent z-10"
        aria-hidden="true"
      />

      {/* ── Continuous Scrolling Track Container ── */}
      <div className="flex w-max marquee-track">
        {/*
          Track 1 (Primary):
          Moves smoothly from translateX(0) to translateX(-100%).
        */}
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-marquee">
          {ITEMS.map((item, idx) => (
            <MarqueeItemContent key={`item-1-${idx}`} item={item} />
          ))}
        </div>

        {/*
          Track 2 (Duplicate for Seamless Loop):
          Identical clone placed immediately after Track 1 to eliminate any gap.
          Marked with aria-hidden="true" to prevent screen readers from reading duplicates.
        */}
        <div
          className="flex shrink-0 items-center gap-8 pr-8 animate-marquee"
          aria-hidden="true"
        >
          {ITEMS.map((item, idx) => (
            <MarqueeItemContent key={`item-2-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * Helper Component: MarqueeItemContent
 * ============================================================================
 * Formats and renders an individual marquee credential.
 * - If the item provides a 'href', wraps the badge in Next.js <Link>.
 * - Displays pill badges (e.g. ISO) or icons (e.g. stars, locks).
 * - Appends a subtle diamond divider (✦) between credentials.
 */
function MarqueeItemContent({ item }: { item: MarqueeItem }) {
  const content = (
    <span className="inline-flex items-center gap-2 tracking-wide whitespace-nowrap">
      {/* Render stylized pill badge (if defined) */}
      {item.badge ? (
        <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border border-[#C59B47]/60 bg-[#C59B47]/15 text-[#E6BF70] shadow-sm">
          {item.badge}
        </span>
      ) : item.icon ? (
        /* Render gold icon (if defined) */
        <span className="text-[#D4AF6A] text-sm" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}

      {/* Primary descriptive text */}
      <span className="text-[#F2EDE2]/90 font-medium">{item.label}</span>

      {/* Highlighted text callout in warm brass tone */}
      {item.highlight && (
        <span className="text-[#E6BF70] font-semibold ml-1">
          {item.highlight}
        </span>
      )}

      {/* Decorative separator between consecutive items */}
      <span className="text-[#453F32] ml-6 select-none" aria-hidden="true">
        ✦
      </span>
    </span>
  );

  // If item has a link URL, make it clickable with hover transitions
  if (item.href) {
    return (
      <Link
        href={item.href}
        className="hover:text-[#F7D899] transition-colors inline-block cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  // Otherwise return static content
  return content;
}

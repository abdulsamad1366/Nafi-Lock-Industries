import Link from "next/link";

interface MarqueeItem {
  icon?: string;
  badge?: string;
  label: string;
  highlight?: string;
  href?: string;
}

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

export default function Marquee() {
  return (
    <div
      className="marquee-bar relative w-full overflow-hidden bg-[#15130F] border-b border-[#2D2820] text-xs py-2 select-none z-20"
      aria-label="Announcements & Certifications"
    >
      {/* Edge gradient fade masks for sleek entry and exit */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#15130F] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#15130F] to-transparent z-10" />

      <div className="flex w-max marquee-track">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-marquee">
          {ITEMS.map((item, idx) => (
            <MarqueeItemContent key={`item-1-${idx}`} item={item} />
          ))}
        </div>

        {/* Track 2 (identical duplicate for seamless infinite loop) */}
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

function MarqueeItemContent({ item }: { item: MarqueeItem }) {
  const content = (
    <span className="inline-flex items-center gap-2 tracking-wide whitespace-nowrap">
      {item.badge ? (
        <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border border-[#C59B47]/60 bg-[#C59B47]/15 text-[#E6BF70] shadow-sm">
          {item.badge}
        </span>
      ) : item.icon ? (
        <span className="text-[#D4AF6A] text-sm" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}

      <span className="text-[#F2EDE2]/90 font-medium">{item.label}</span>

      {item.highlight && (
        <span className="text-[#E6BF70] font-semibold ml-1">
          {item.highlight}
        </span>
      )}

      <span className="text-[#453F32] ml-6 select-none" aria-hidden="true">
        ✦
      </span>
    </span>
  );

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

  return content;
}

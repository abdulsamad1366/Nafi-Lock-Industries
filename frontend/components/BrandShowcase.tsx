"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Type Definition: BrandShowcaseData
 * ============================================================================
 * Defines the structural and aesthetic properties for each of the 3 flagship cards
 * directly matching the provided architectural reference design.
 */
interface BrandShowcaseData {
  id: string;
  slug: string;
  number: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  imageSrc: string;
  altText: string;
  bgClass: string;
  borderClass: string;
  eyebrowColor: string;
  taglineColor: string;
  textColor: string;
  descColor: string;
  numberColor: string;
  specBgClass: string;
  btnBgClass: string;
  btnHoverClass: string;
  sloganColor: string;
  slogan: string;
  spec1: {
    label: string;
    icon: "layers" | "cylinder" | "shield-cut";
  };
  spec2: {
    label: string;
    icon: "shield-rust" | "chrome" | "boron";
  };
}

/**
 * ============================================================================
 * 3 Flagship Brands Dataset (Directly matching reference mockup)
 * ============================================================================
 */
const BRANDS_DATA: BrandShowcaseData[] = [
  {
    id: "s-nafi",
    slug: "s-nafi",
    number: "01",
    name: "S-Nafi",
    eyebrow: "ROYAL CRAFTSMANSHIP",
    tagline: "Artisanal Solid Brass Masterpieces",
    description:
      "Hand-forged mortise cylinders and engraved royal brass padlocks built with solid metallurgical cores for prestigious architectural estates.",
    imageSrc: "/images/card-s-nafi.jpg",
    altText: "S-Nafi Royal Solid Brass Engraved Padlock on Marble",
    bgClass: "bg-[#FAF6EE]",
    borderClass: "border-[#E8DFCF]",
    eyebrowColor: "text-[#A67C2E]",
    taglineColor: "text-[#A67C2E]",
    textColor: "text-[#1C1A17]",
    descColor: "text-[#635E55]",
    numberColor: "text-[#A67C2E]/60",
    specBgClass: "text-[#1C1A17]",
    btnBgClass: "bg-[#A67C2E]",
    btnHoverClass: "hover:bg-[#8E6720]",
    sloganColor: "text-[#9E917D]",
    slogan: "TRADITION\nMEETS TIMELESS\nSECURITY",
    spec1: {
      label: "100%\nSolid Brass",
      icon: "layers",
    },
    spec2: {
      label: "Zero-Tarnish\nAnti-Rust",
      icon: "shield-rust",
    },
  },
  {
    id: "greek",
    slug: "greek",
    number: "02",
    name: "Greek",
    eyebrow: "PRECISION HERITAGE",
    tagline: "Classical Strength & Mortise Systems",
    description:
      "High-security 6-pin brass tumbler mechanisms encased within heavy brushed architectural chrome, built for silent and flawless door operation.",
    imageSrc: "/images/card-greek.jpg",
    altText: "Greek Architectural Mortise Lock Cylinder Mechanism",
    bgClass: "bg-[#EEF4F8]",
    borderClass: "border-[#D6E3EC]",
    eyebrowColor: "text-[#2A6F97]",
    taglineColor: "text-[#2A6F97]",
    textColor: "text-[#0F1E2E]",
    descColor: "text-[#536577]",
    numberColor: "text-[#2A6F97]/60",
    specBgClass: "text-[#0F1E2E]",
    btnBgClass: "bg-[#0E2038]",
    btnHoverClass: "hover:bg-[#071324]",
    sloganColor: "text-[#7B92A8]",
    slogan: "ENGINEERED\nFOR EVERY\nENTRANCE",
    spec1: {
      label: "6-Pin\nAnti-Pick Core",
      icon: "cylinder",
    },
    spec2: {
      label: "Brushed\nChrome Satin",
      icon: "chrome",
    },
  },
  {
    id: "raksham",
    slug: "raksham",
    number: "03",
    name: "Raksham",
    eyebrow: "BUILT TO DEFEND",
    tagline: "Guardian-Grade Industrial Defense",
    description:
      "Ultra-hardened boron steel alloy shackles and armored bodies engineered to resist hydraulic shears, angle grinders, and forced entry.",
    imageSrc: "/images/card-raksham.jpg",
    altText: "Raksham Grade-6 Heavy-Duty Armored Padlock",
    bgClass: "bg-[#111111]",
    borderClass: "border-white/10",
    eyebrowColor: "text-white/70",
    taglineColor: "text-[#E63946]",
    textColor: "text-white",
    descColor: "text-[#9E9E9E]",
    numberColor: "text-white/40",
    specBgClass: "text-white",
    btnBgClass: "bg-[#8B1A1A]",
    btnHoverClass: "hover:bg-[#721515]",
    sloganColor: "text-white/40",
    slogan: "STRENGTH\nWITHOUT\nCOMPROMISE",
    spec1: {
      label: "Grade-6\nAnti-Cut Steel",
      icon: "shield-cut",
    },
    spec2: {
      label: "Hardened\nBoron Core",
      icon: "boron",
    },
  },
];

/**
 * Helper component: renders crisp vector iconography tailored to each spec
 */
function SpecIcon({
  icon,
  accentColor,
}: {
  icon: string;
  accentColor?: string;
}) {
  switch (icon) {
    case "layers":
      // Stacked metallurgical plates/ingot icon
      return (
        <svg
          className="w-4 h-4 shrink-0 text-[#A67C2E]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "shield-rust":
      // Shield checkmark corrosion-proof icon
      return (
        <svg
          className="w-4 h-4 shrink-0 text-[#A67C2E]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "cylinder":
      // 6-pin tumbler cylinder icon
      return (
        <svg
          className="w-4 h-4 shrink-0 text-[#2A6F97]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      );
    case "chrome":
      // Brushed chrome / diamond geometric finish icon
      return (
        <svg
          className="w-4 h-4 shrink-0 text-[#2A6F97]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
      );
    case "shield-cut":
      // Armored fortress grade-6 shield
      return (
        <svg
          className="w-4 h-4 shrink-0 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "boron":
      // Hardened chain / boron alloy shackle link
      return (
        <svg
          className="w-4 h-4 shrink-0 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * ============================================================================
 * Component: BrandShowcase ("Our Flagship Brands" — Exact Mockup Replication)
 * ============================================================================
 */
export default function BrandShowcase() {
  return (
    <section
      id="brands"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden select-none"
      aria-label="Our Flagship Brands"
    >
      {/* ── Background Subtle Watermark Laurel / Ambient Crest ── */}
      <div
        className="absolute -top-12 -right-12 w-96 h-96 opacity-[0.03] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="4" fill="none" />
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="100"
            fontFamily="serif"
          >
            N
          </text>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ====================================================================
            1. SECTION HEADER (Gold Lines & Editorial Dual-Tone Headline)
            ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          {/* Eyebrow with gold horizontal dividing lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
            <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
            <span className="font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold text-[#8C7A5B]">
              Three Houses of Engineering Excellence
            </span>
            <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
          </div>

          {/* Editorial Title: Our Flagship Brands */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold text-primary tracking-tight leading-tight mb-4">
            Our Flagship <span className="text-[#C49A45]">Brands</span>
          </h2>

          {/* Positioning Narrative */}
          <p className="text-muted text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Three specialized manufacturing traditions united under Nafi Lock Industries’
            heritage of metallurgical integrity, Swiss pin-tumbler precision, and unyielding fortress defense.
          </p>
        </div>

        {/* ====================================================================
            2. THE 3 SPLIT-CARDS GRID (Side-by-Side Architectural Cards)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {BRANDS_DATA.map((brand) => {
            return (
              <article
                key={brand.id}
                className={`relative ${brand.bgClass} border ${brand.borderClass} rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group`}
              >
                {/* Number in Top Right Corner (e.g. 01, 02, 03) */}
                <span
                  className={`absolute top-5 sm:top-6 right-6 font-mono text-xs sm:text-sm font-semibold ${brand.numberColor}`}
                >
                  {brand.number}
                </span>

                {/* Top Section: Split into Left Content & Right Lock Image */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                  {/* ── Left Content Column (approx 62% width) ── */}
                  <div className="col-span-7 flex flex-col justify-between">
                    {/* Eyebrow */}
                    <span
                      className={`font-sans font-bold text-[9px] sm:text-[10px] tracking-[0.2em] uppercase block mb-1.5 ${brand.eyebrowColor}`}
                    >
                      {brand.eyebrow}
                    </span>

                    {/* Brand Name */}
                    <h3
                      className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-1 ${brand.textColor}`}
                    >
                      {brand.name}
                    </h3>

                    {/* Tagline */}
                    <p
                      className={`font-serif text-xs sm:text-sm font-medium leading-snug mb-3 ${brand.taglineColor}`}
                    >
                      {brand.tagline}
                    </p>

                    {/* Narrative Description */}
                    <p
                      className={`text-[11px] sm:text-xs leading-relaxed mb-4 line-clamp-4 font-normal ${brand.descColor}`}
                    >
                      {brand.description}
                    </p>

                    {/* Divider Accent Line */}
                    <div
                      className="w-6 h-0.5 mb-4 opacity-40 rounded-full"
                      style={{
                        backgroundColor:
                          brand.id === "s-nafi"
                            ? "#A67C2E"
                            : brand.id === "greek"
                            ? "#2A6F97"
                            : "#E63946",
                      }}
                    />

                    {/* 2 Specification Chips with Icons */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {/* Spec 1 */}
                      <div className="flex items-start gap-1.5">
                        <SpecIcon icon={brand.spec1.icon} />
                        <span
                          className={`text-[10px] font-bold leading-tight whitespace-pre-line ${brand.specBgClass}`}
                        >
                          {brand.spec1.label}
                        </span>
                      </div>

                      {/* Spec 2 */}
                      <div className="flex items-start gap-1.5">
                        <SpecIcon icon={brand.spec2.icon} />
                        <span
                          className={`text-[10px] font-bold leading-tight whitespace-pre-line ${brand.specBgClass}`}
                        >
                          {brand.spec2.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Right Lock Photo Frame (approx 38% width) ── */}
                  <div className="col-span-5 flex items-center justify-center">
                    <div className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-black/5">
                      <Image
                        src={brand.imageSrc}
                        alt={brand.altText}
                        fill
                        sizes="(max-width: 768px) 40vw, 200px"
                        className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Bottom Row: Button (Left) & Micro Slogan (Right) ── */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/[0.06] mt-2">
                  {/* Explore Pill Button */}
                  <Link
                    href={`/brands/${brand.slug}`}
                    className={`inline-flex items-center gap-1.5 text-white ${brand.btnBgClass} ${brand.btnHoverClass} text-[11px] sm:text-xs font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md active:scale-95 transition-all duration-200`}
                  >
                    <span>Explore {brand.name}</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>

                  {/* Micro-Slogan Stacked on Right */}
                  <span
                    className={`text-[8px] sm:text-[9px] tracking-widest uppercase font-semibold text-right leading-tight whitespace-pre-line ${brand.sloganColor}`}
                  >
                    {brand.slogan}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* ====================================================================
            3. BOTTOM TRUST STRIP ("DIFFERENT IDENTITIES. A SHARED PROMISE.")
            ==================================================================== */}
        <div className="mt-14 sm:mt-18 pt-4">
          {/* Centered Divider Text */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-10">
            <div className="h-px w-16 sm:w-28 bg-divider" />
            <span className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] sm:text-[11px] font-semibold text-muted">
              Different Identities. A Shared Promise.
            </span>
            <div className="h-px w-16 sm:w-28 bg-divider" />
          </div>

          {/* 3 Trust Pillars with Icons */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20 text-primary">
            {/* Pillar 1: Superior Quality */}
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="6 3 18 3 22 9 12 22 2 9" />
                <polyline points="12 22 7 9" />
                <polyline points="12 22 17 9" />
                <line x1="2" y1="9" x2="22" y2="9" />
              </svg>
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
                Superior Quality
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-divider hidden sm:block" />

            {/* Pillar 2: Precision Manufacturing */}
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
                Precision Manufacturing
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-divider hidden sm:block" />

            {/* Pillar 3: Trusted Worldwide */}
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
                Trusted Worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

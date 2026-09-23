"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * ============================================================================
 * Type Definition: BrandShowcaseData
 * ============================================================================
 */
interface BrandShowcaseData {
  id: string;
  slug: string;
  number: string;
  name: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  imageSrc: string;
  altText: string;
  badge: string;
  bgColor: string;
  borderClass: string;
  eyebrowColor: string;
  taglineColor: string;
  textColor: string;
  descColor: string;
  specBgClass: string;
  btnBgClass: string;
  btnHoverClass: string;
  accentHex: string;
  glowColor: string;
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
 * 3 Flagship Brands Dataset (Ordered: 01 S-Nafi -> 02 Raksham -> 03 Greek)
 * Concise, relevant information only.
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
    shortDescription:
      "Hand-forged mortise cylinders and royal engraved padlocks forged with solid metallurgical cores for architectural estates.",
    imageSrc: "/images/card-s-nafi.jpg",
    altText: "S-Nafi Solid Brass Lock",
    badge: "100% Extruded Brass",
    bgColor: "#FAF6EE",
    borderClass: "border-[#E8DFCF]",
    eyebrowColor: "text-[#A67C2E]",
    taglineColor: "text-[#A67C2E]",
    textColor: "text-[#1C1A17]",
    descColor: "text-[#635E55]",
    specBgClass: "text-[#1C1A17]",
    btnBgClass: "bg-[#A67C2E]",
    btnHoverClass: "hover:bg-[#8E6720]",
    accentHex: "#A67C2E",
    glowColor: "rgba(184, 146, 63, 0.12)",
    spec1: {
      label: "100% Solid Brass",
      icon: "layers",
    },
    spec2: {
      label: "Zero-Tarnish Rustproof",
      icon: "shield-rust",
    },
  },
  {
    id: "raksham",
    slug: "raksham",
    number: "02",
    name: "Raksham",
    eyebrow: "BUILT TO DEFEND",
    tagline: "Guardian-Grade Industrial Defense",
    shortDescription:
      "Ultra-hardened boron steel alloy shackles and armored bodies engineered to resist hydraulic shears, angle grinders, and breach.",
    imageSrc: "/images/card-raksham.jpg",
    altText: "Raksham Armored Defense Padlock",
    badge: "60+ HRC Boron Alloy",
    bgColor: "#0B1120",
    borderClass: "border-white/15",
    eyebrowColor: "text-[#F87171]",
    taglineColor: "text-[#EF4444]",
    textColor: "text-white",
    descColor: "text-gray-300",
    specBgClass: "text-white",
    btnBgClass: "bg-[#DC2626]",
    btnHoverClass: "hover:bg-[#B91C1C]",
    accentHex: "#EF4444",
    glowColor: "rgba(239, 68, 68, 0.12)",
    spec1: {
      label: "Grade-6 Anti-Cut Steel",
      icon: "shield-cut",
    },
    spec2: {
      label: "Armored Boron Core",
      icon: "boron",
    },
  },
  {
    id: "greek",
    slug: "greek",
    number: "03",
    name: "Greek",
    eyebrow: "PRECISION HERITAGE",
    tagline: "Classical Strength & Mortise Systems",
    shortDescription:
      "High-security 6-pin brass tumbler mechanisms encased in brushed architectural chrome for silent, flawless door operation.",
    imageSrc: "/images/card-greek.jpg",
    altText: "Greek Architectural Mortise Lock",
    badge: "±0.02mm Micron Broaching",
    bgColor: "#EEF4F8",
    borderClass: "border-[#D6E3EC]",
    eyebrowColor: "text-[#2A6F97]",
    taglineColor: "text-[#2A6F97]",
    textColor: "text-[#0F1E2E]",
    descColor: "text-[#536577]",
    specBgClass: "text-[#0F1E2E]",
    btnBgClass: "bg-[#0E2038]",
    btnHoverClass: "hover:bg-[#1E3A5F]",
    accentHex: "#2A6F97",
    glowColor: "rgba(42, 111, 151, 0.12)",
    spec1: {
      label: "6-Pin Anti-Pick Core",
      icon: "cylinder",
    },
    spec2: {
      label: "Brushed Chrome Satin",
      icon: "chrome",
    },
  },
];

/**
 * SpecIcon: Helper to render vector icons matching card theme
 */
function SpecIcon({ icon, accentColor }: { icon: string; accentColor: string }) {
  switch (icon) {
    case "layers":
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
      return (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
 * Component: BrandShowcase (Static 3-Card Grid with Minimal, Beautiful Motion)
 * ============================================================================
 */
export default function BrandShowcase() {
  return (
    <section
      id="brands"
      className="py-16 sm:py-24 bg-white relative overflow-hidden select-none"
      aria-label="Our Flagship Brands"
    >
      {/* Subtle Background Watermark Crest */}
      <div
        className="absolute top-10 right-4 sm:right-16 w-64 sm:w-[420px] aspect-[1024/759] opacity-[0.10] pointer-events-none select-none -z-0"
        aria-hidden="true"
      >
        <Image
          src="/images/nafi-crest-watermark.png"
          alt="Nafi Lock Industries Crest"
          fill
          className="object-contain object-top-right"
          priority={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ====================================================================
            1. SECTION EDITORIAL HEADER
            ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 sm:w-12 bg-[#B8923F]/60" />
            <span className="font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold text-[#8C7A5B]">
              Three Houses of Engineering Excellence
            </span>
            <div className="h-px w-8 sm:w-12 bg-[#B8923F]/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-primary tracking-tight leading-tight mb-3">
            Our Flagship <span className="text-[#C49A45]">Brands</span>
          </h2>

          <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal">
            Three specialized manufacturing houses united under Nafi Lock Industries’
            heritage of metallurgical integrity, Swiss precision, and fortress defense.
          </p>
        </motion.div>

        {/* ====================================================================
            2. STATIC 3-CARD SHOWCASE GRID WITH CLEAN MICRO-ANIMATION
            ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {BRANDS_DATA.map((brand, index) => {
            return (
              <motion.article
                key={brand.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.12,
                  ease: [0.25, 1, 0.5, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                style={{ backgroundColor: brand.bgColor }}
                className={`relative border ${brand.borderClass} rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-300 flex flex-col justify-between overflow-hidden group`}
              >
                {/* Subtle Ambient Radial Glow */}
                <div
                  className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                  style={{ backgroundColor: brand.accentHex }}
                />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/10 mb-4 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: brand.accentHex }}
                    />
                    <span
                      className={`font-sans font-bold text-[9px] sm:text-[10px] tracking-[0.18em] uppercase ${brand.eyebrowColor}`}
                    >
                      {brand.eyebrow}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold tracking-wider ${brand.taglineColor}`}
                  >
                    HOUSE {brand.number}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="flex-1 flex flex-col relative z-10 mb-4">
                  {/* Brand Title & Tagline */}
                  <div className="mb-3">
                    <h3
                      className={`font-serif text-2xl sm:text-[26px] font-bold tracking-tight leading-tight mb-1 ${brand.textColor}`}
                    >
                      {brand.name}
                    </h3>
                    <p
                      className={`text-xs font-medium leading-normal ${brand.taglineColor}`}
                    >
                      {brand.tagline}
                    </p>
                  </div>

                  {/* Studio Product Photograph Frame */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden shadow-xs border border-black/10 dark:border-white/10 mb-4 bg-black/5">
                    <Image
                      src={brand.imageSrc}
                      alt={brand.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Image corner badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90 font-medium">
                      {brand.badge}
                    </div>
                  </div>

                  {/* Punchy Concise Description */}
                  <p
                    className={`text-xs leading-relaxed mb-4 line-clamp-2 ${brand.descColor}`}
                  >
                    {brand.shortDescription}
                  </p>

                  {/* 2 Specification Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/[0.04] dark:bg-white/10 border border-black/5 dark:border-white/10">
                      <SpecIcon
                        icon={brand.spec1.icon}
                        accentColor={brand.accentHex}
                      />
                      <span
                        className={`text-[11px] font-semibold leading-none ${brand.specBgClass}`}
                      >
                        {brand.spec1.label}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/[0.04] dark:bg-white/10 border border-black/5 dark:border-white/10">
                      <SpecIcon
                        icon={brand.spec2.icon}
                        accentColor={brand.accentHex}
                      />
                      <span
                        className={`text-[11px] font-semibold leading-none ${brand.specBgClass}`}
                      >
                        {brand.spec2.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3.5 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between gap-3 relative z-10">
                  <Link
                    href={`/brands/${brand.slug}`}
                    className={`inline-flex items-center gap-2 text-white ${brand.btnBgClass} ${brand.btnHoverClass} text-xs font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow active:scale-95 transition-all duration-200 group/btn`}
                  >
                    <span>Explore {brand.name}</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1"
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

                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest uppercase opacity-60 ${brand.textColor}`}
                  >
                    {brand.id}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ====================================================================
            3. BOTTOM TRUST STRIP ("DIFFERENT IDENTITIES. A SHARED PROMISE.")
            ==================================================================== */}
        <div className="mt-16 sm:mt-20 pt-4 border-t border-divider/40">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8">
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

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
  description: string;
  imageSrc: string;
  altText: string;
  imageBadge: string;
  bgColor: string;
  borderClass: string;
  eyebrowColor: string;
  taglineColor: string;
  textColor: string;
  descColor: string;
  numberColor: string;
  specBgClass: string;
  btnBgClass: string;
  sloganColor: string;
  slogan: string;
  accentHex: string;
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
    imageBadge: "100% Solid Extruded Brass",
    bgColor: "#FAF6EE",
    borderClass: "border-[#E8DFCF]",
    eyebrowColor: "text-[#A67C2E]",
    taglineColor: "text-[#A67C2E]",
    textColor: "text-[#1C1A17]",
    descColor: "text-[#635E55]",
    numberColor: "text-[#A67C2E]/70",
    specBgClass: "text-[#1C1A17]",
    btnBgClass: "bg-[#A67C2E] hover:bg-[#8E6720]",
    sloganColor: "text-[#9E917D]",
    slogan: "TRADITION\nMEETS TIMELESS\nSECURITY",
    accentHex: "#A67C2E",
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
    id: "raksham",
    slug: "raksham",
    number: "02",
    name: "Raksham",
    eyebrow: "BUILT TO DEFEND",
    tagline: "Guardian-Grade Industrial Defense",
    description:
      "Ultra-hardened boron steel alloy shackles and armored bodies engineered to resist hydraulic shears, angle grinders, and forced entry.",
    imageSrc: "/images/card-raksham.jpg",
    altText: "Raksham Grade-6 Heavy-Duty Armored Padlock",
    imageBadge: "60+ HRC Hardened Boron Alloy",
    bgColor: "#0B1120",
    borderClass: "border-white/15",
    eyebrowColor: "text-[#F87171]",
    taglineColor: "text-[#EF4444]",
    textColor: "text-white",
    descColor: "text-gray-300",
    numberColor: "text-white/50",
    specBgClass: "text-white",
    btnBgClass: "bg-[#DC2626] hover:bg-[#B91C1C]",
    sloganColor: "text-gray-400",
    slogan: "STRENGTH\nWITHOUT\nCOMPROMISE",
    accentHex: "#EF4444",
    spec1: {
      label: "Grade-6\nAnti-Cut Steel",
      icon: "shield-cut",
    },
    spec2: {
      label: "Hardened\nBoron Core",
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
    description:
      "High-security 6-pin brass tumbler mechanisms encased within heavy brushed architectural chrome, built for silent and flawless door operation.",
    imageSrc: "/images/card-greek.jpg",
    altText: "Greek Architectural Mortise Lock Cylinder Mechanism",
    imageBadge: "±0.02mm Micron Broaching",
    bgColor: "#EEF4F8",
    borderClass: "border-[#D6E3EC]",
    eyebrowColor: "text-[#2A6F97]",
    taglineColor: "text-[#2A6F97]",
    textColor: "text-[#0F1E2E]",
    descColor: "text-[#536577]",
    numberColor: "text-[#2A6F97]/70",
    specBgClass: "text-[#0F1E2E]",
    btnBgClass: "bg-[#0E2038] hover:bg-[#1E3A5F]",
    sloganColor: "text-[#7B92A8]",
    slogan: "ENGINEERED\nFOR EVERY\nENTRANCE",
    accentHex: "#2A6F97",
    spec1: {
      label: "6-Pin\nAnti-Pick Core",
      icon: "cylinder",
    },
    spec2: {
      label: "Brushed\nChrome Satin",
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
          className="w-4 h-4 shrink-0"
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
          className="w-4 h-4 shrink-0"
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
          className="w-4 h-4 shrink-0"
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
          className="w-4 h-4 shrink-0"
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
          className="w-4 h-4 shrink-0"
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
          className="w-4 h-4 shrink-0"
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
 * AnimatedCardFace: Render single 100% solid opaque card matching luxury editorial specs
 * ============================================================================
 */
interface AnimatedCardFaceProps {
  brand: BrandShowcaseData;
}

function AnimatedCardFace({ brand }: AnimatedCardFaceProps) {
  return (
    <article
      style={{ backgroundColor: brand.bgColor }}
      className={`w-full h-full relative border ${brand.borderClass} rounded-3xl p-5 sm:p-7 lg:p-9 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] transition-colors duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Ambient Card Background Glow for Depth */}
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: brand.accentHex }}
      />

      {/* Top Header Row inside Card: Brand Eyebrow Tag + Sequence Counter */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.08] dark:border-white/10 mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xs">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: brand.accentHex }}
          />
          <span
            className={`font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase ${brand.eyebrowColor}`}
          >
            {brand.eyebrow}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-mono text-xs sm:text-sm font-bold tracking-widest ${brand.numberColor}`}>
            HOUSE {brand.number} / 03
          </span>
        </div>
      </div>

      {/* Main Split Body: Left Narrative Column (60%) & Right Studio Photograph (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            {/* Brand Name */}
            <h3
              className={`font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight mb-1.5 leading-tight ${brand.textColor}`}
            >
              {brand.name}
            </h3>

            {/* Tagline */}
            <p
              className={`font-serif text-xs sm:text-sm lg:text-base font-medium leading-snug mb-2.5 ${brand.taglineColor}`}
            >
              {brand.tagline}
            </p>

            {/* Narrative Description */}
            <p
              className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-normal line-clamp-2 sm:line-clamp-3 ${brand.descColor}`}
            >
              {brand.description}
            </p>

            {/* Divider Accent Line */}
            <div
              className="w-12 h-0.5 mb-3 sm:mb-4 rounded-full"
              style={{ backgroundColor: brand.accentHex }}
            />

            {/* 2 Specification Chips */}
            <div className="grid grid-cols-2 gap-2.5 mb-3 sm:mb-4">
              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10">
                <SpecIcon icon={brand.spec1.icon} accentColor={brand.accentHex} />
                <span
                  className={`text-[11px] sm:text-xs font-bold leading-tight whitespace-pre-line ${brand.specBgClass}`}
                >
                  {brand.spec1.label}
                </span>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10">
                <SpecIcon icon={brand.spec2.icon} accentColor={brand.accentHex} />
                <span
                  className={`text-[11px] sm:text-xs font-bold leading-tight whitespace-pre-line ${brand.specBgClass}`}
                >
                  {brand.spec2.label}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-black/[0.08] dark:border-white/10">
            <Link
              href={`/brands/${brand.slug}`}
              className={`inline-flex items-center gap-2 text-white ${brand.btnBgClass} text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 group/btn`}
            >
              <span>Explore {brand.name} Collection</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
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
              className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-right leading-tight whitespace-pre-line ${brand.sloganColor}`}
            >
              {brand.slogan}
            </span>
          </div>
        </div>

        {/* Right Column: Studio Photo Showcase */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1/1] max-h-[250px] sm:max-h-[290px] lg:max-h-[310px] rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 group/img">
            <Image
              src={brand.imageSrc}
              alt={brand.altText}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover object-center w-full h-full group-hover/img:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Floating Technical Badge on Image */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <span className="inline-block text-[10px] sm:text-[10.5px] font-mono font-bold tracking-wider px-3 py-1 sm:py-1.5 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-md">
                {brand.imageBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * ============================================================================
 * Component: BrandShowcase (Pinned Scroll Stacking Showcase)
 * ============================================================================
 * Pinned Scroll Experience:
 * 1. As the user reaches this section, the section stops/pins on screen.
 * 2. As the user scrolls, Card 1 (S-Nafi) stays, Card 2 (Raksham) animates up & stacks,
 *    then Card 3 (Greek) animates up & stacks.
 * 3. After all cards have moved and stacked, the section unpins and page scroll resumes.
 */
export default function BrandShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHouseIndex, setActiveHouseIndex] = useState<number>(0);

  // Track scroll position across the full height of the 320vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Keep track of active house for the navigation pills
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveHouseIndex(0);
    } else if (latest < 0.72) {
      setActiveHouseIndex(1);
    } else {
      setActiveHouseIndex(2);
    }
  });

  // Smooth click navigation to jump to a specific house card
  const scrollToHouse = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const containerTop = currentScroll + rect.top;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;

    let targetProgress = 0.05;
    if (index === 1) targetProgress = 0.52;
    if (index === 2) targetProgress = 0.92;

    const targetY = containerTop + scrollableDistance * targetProgress;
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  /**
   * ==========================================================================
   * Framer Motion Scroll Transforms for 3 Cards
   * Cards are 100% solid and opaque. They slide up from below the viewport.
   * ==========================================================================
   */

  // ── Card 0 (S-Nafi): Starts in place, recedes as Card 1 & 2 stack on top ──
  const card0Y = useTransform(
    scrollYProgress,
    [0, 0.22, 0.52, 0.70, 0.92, 1.0],
    ["0px", "0px", "-20px", "-20px", "-38px", "-38px"]
  );
  const card0Scale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.52, 0.70, 0.92, 1.0],
    [1, 1, 0.94, 0.94, 0.89, 0.89]
  );
  const card0Brightness = useTransform(
    scrollYProgress,
    [0, 0.22, 0.52, 0.70, 0.92, 1.0],
    [1, 1, 0.90, 0.90, 0.82, 0.82]
  );
  const card0Filter = useTransform(card0Brightness, (b) => `brightness(${b})`);

  // ── Card 1 (Raksham): 100% solid, glides up between 0.22 and 0.52 ──
  const card1Y = useTransform(
    scrollYProgress,
    [0, 0.20, 0.52, 0.70, 0.92, 1.0],
    ["110vh", "100vh", "0px", "0px", "-19px", "-19px"]
  );
  const card1Scale = useTransform(
    scrollYProgress,
    [0, 0.20, 0.52, 0.70, 0.92, 1.0],
    [0.96, 0.96, 1.0, 1.0, 0.95, 0.95]
  );
  const card1Brightness = useTransform(
    scrollYProgress,
    [0, 0.20, 0.52, 0.70, 0.92, 1.0],
    [1, 1, 1, 1, 0.92, 0.92]
  );
  const card1Filter = useTransform(card1Brightness, (b) => `brightness(${b})`);
  const card1PointerEvents = useTransform(
    scrollYProgress,
    (p) => (p >= 0.22 ? "auto" : "none")
  );

  // ── Card 2 (Greek): 100% solid, glides up between 0.62 and 0.92 ──
  const card2Y = useTransform(
    scrollYProgress,
    [0, 0.62, 0.92, 1.0],
    ["110vh", "100vh", "0px", "0px"]
  );
  const card2Scale = useTransform(
    scrollYProgress,
    [0, 0.62, 0.92, 1.0],
    [0.96, 0.96, 1.0, 1.0]
  );
  const card2PointerEvents = useTransform(
    scrollYProgress,
    (p) => (p >= 0.62 ? "auto" : "none")
  );

  return (
    <section
      id="brands"
      ref={containerRef}
      className="relative w-full bg-white select-none overflow-visible"
      aria-label="Our Flagship Brands"
    >
      {/*
        ========================================================================
        PINNED SCROLL CONTAINER (Height: 320vh)
        The viewport stops / locks in place here while user scrolls through the 3 cards.
        Once the 3 cards have moved and stacked, the section naturally unpins!
        ========================================================================
      */}
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-start sm:justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-4">
          {/* Subtle Watermark Crest (Official Nafi Emblem in Background) */}
          <div
            className="absolute top-6 sm:top-10 right-4 sm:right-10 w-72 sm:w-[420px] lg:w-[540px] aspect-[1024/759] opacity-[0.20] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <Image
              src="/images/nafi-crest-watermark.png"
              alt="Nafi Lock Industries Watermark Crest"
              fill
              className="object-contain object-top-right"
              priority={false}
            />
          </div>

          <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
            {/* ==================================================================
                1. SECTION EDITORIAL HEADER
                ================================================================== */}
            <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1.5">
                <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
                <span className="font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold text-[#8C7A5B]">
                  Three Houses of Engineering Excellence
                </span>
                <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[40px] font-bold text-primary tracking-tight leading-tight mb-2">
                Our Flagship <span className="text-[#C49A45]">Brands</span>
              </h2>

              <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
                Three specialized manufacturing houses united under Nafi Lock Industries’
                heritage of metallurgical integrity, Swiss pin-tumbler precision, and unyielding fortress defense.
              </p>
            </div>

            {/* ==================================================================
                2. INTERACTIVE 3-HOUSE STEP SELECTOR
                ================================================================== */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {BRANDS_DATA.map((brand, i) => {
                const isActive = activeHouseIndex === i;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => scrollToHouse(i)}
                    className={`relative px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                      isActive
                        ? "bg-white text-primary shadow-sm border-black/15 scale-105"
                        : "bg-black/[0.03] text-muted border-transparent hover:text-primary hover:bg-black/5"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                        isActive ? "scale-125" : "opacity-40"
                      }`}
                      style={{ backgroundColor: brand.accentHex }}
                    />
                    <span className="tracking-wider uppercase text-[10px] sm:text-[11px]">
                      {brand.number} {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ==================================================================
                3. THE 3 STACKING CARDS VIEWPORT
                All 3 cards occupy this coordinate space.
                Card 1 slides up over Card 0, then Card 2 slides up over Card 1.
                ================================================================== */}
            <div className="relative w-full max-w-5xl h-[460px] sm:h-[480px] lg:h-[490px] flex items-center justify-center">
              {/* Card 0: 01 S-Nafi */}
              <motion.div
                style={{
                  y: card0Y,
                  scale: card0Scale,
                  filter: card0Filter,
                  zIndex: 10,
                  transformOrigin: "top center",
                }}
                className="absolute inset-0 w-full pointer-events-auto"
              >
                <AnimatedCardFace brand={BRANDS_DATA[0]} />
              </motion.div>

              {/* Card 1: 02 Raksham */}
              <motion.div
                style={{
                  y: card1Y,
                  scale: card1Scale,
                  filter: card1Filter,
                  pointerEvents: card1PointerEvents,
                  zIndex: 20,
                  transformOrigin: "top center",
                }}
                className="absolute inset-0 w-full"
              >
                <AnimatedCardFace brand={BRANDS_DATA[1]} />
              </motion.div>

              {/* Card 2: 03 Greek */}
              <motion.div
                style={{
                  y: card2Y,
                  scale: card2Scale,
                  pointerEvents: card2PointerEvents,
                  zIndex: 30,
                  transformOrigin: "top center",
                }}
                className="absolute inset-0 w-full"
              >
                <AnimatedCardFace brand={BRANDS_DATA[2]} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. BOTTOM TRUST STRIP ("DIFFERENT IDENTITIES. A SHARED PROMISE.")
          Positioned below the pinned container so it is revealed as user scrolls down.
          ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-divider/40">
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
    </section>
  );
}

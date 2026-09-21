"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Type Definition: LockCategoryItem
 * ============================================================================
 * Represents each circular category card in the signature collections showcase.
 * Replicates the "EVERYDAY SIGNATURE JEWELLERY" circular design pattern from Velisqa.
 */
interface LockCategoryItem {
  id: string;
  name: string;
  brand: string;
  imageSrc: string;
  altText: string;
  href: string;
}

/**
 * ============================================================================
 * Signature Lock Categories Data
 * ============================================================================
 * 6 curated architectural lock categories highlighting craftsmanship,
 * cylinder precision, and armored metallurgy across Nafi Lock Industries.
 */
const CATEGORIES: LockCategoryItem[] = [
  {
    id: "brass-padlocks",
    name: "Brass Padlocks",
    brand: "S-Nafi",
    imageSrc: "/images/categories/cat-brass-padlocks.jpg",
    altText: "Solid Forged Brass Padlock with Royal Emblem",
    href: "/brands/s-nafi",
  },
  {
    id: "mortise-locks",
    name: "Mortise Locks",
    brand: "Greek",
    imageSrc: "/images/categories/cat-mortise-locks.jpg",
    altText: "Architectural Mortise Lock Cylinder Mechanism",
    href: "/brands/greek",
  },
  {
    id: "armored-series",
    name: "Armored Series",
    brand: "Raksham",
    imageSrc: "/images/categories/cat-armored-locks.jpg",
    altText: "Grade-6 Fortress Ultra-Hardened Security Padlock",
    href: "/brands/raksham",
  },
  {
    id: "pin-cylinders",
    name: "Pin Cylinders",
    brand: "Greek Precision",
    imageSrc: "/images/categories/cat-pin-cylinders.jpg",
    altText: "High-Security 6-Pin Anti-Pick Tumbler Mechanism",
    href: "/brands/greek",
  },
  {
    id: "royal-engraved",
    name: "Royal Engraved",
    brand: "S-Nafi Artisanal",
    imageSrc: "/images/categories/cat-royal-crest.jpg",
    altText: "Hand-Finished Royal Crest Seal on Solid Brass",
    href: "/brands/s-nafi",
  },
  {
    id: "hardened-shackles",
    name: "Hardened Shackles",
    brand: "Raksham Defense",
    imageSrc: "/images/categories/cat-hardened-shackle.jpg",
    altText: "Hardened Boron Steel Anti-Cut Shackle",
    href: "/brands/raksham",
  },
];

/**
 * ============================================================================
 * Component: CategoryCarousel
 * ============================================================================
 * Renders the circular category showcase strip inspired directly by Velisqa's
 * "EVERYDAY SIGNATURE JEWELLERY" circular bubbles:
 * - Spaced uppercase heading with refined luxury tracking.
 * - 6 circular photographic category cards (rounded-full).
 * - Smooth hover scale and subtle shadow bloom.
 * - Elegant italic serif typography captions underneath.
 * - Horizontal scroll on mobile screens, symmetric flex grid on desktop.
 */
export default function CategoryCarousel() {
  return (
    <section
      className="w-full bg-white py-12 sm:py-16 md:py-20 border-b border-divider/60 select-none"
      aria-label="Signature Lock Collections"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Heading: Refined Spaced Uppercase Typography ── */}
        <h2 className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-xs sm:text-sm font-semibold text-primary text-center mb-8 sm:mb-12">
          Signature Lock Collections
        </h2>

        {/* ── Circular Categories Row / Carousel ── */}
        <div className="flex items-center justify-start lg:justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4 px-2">
          {CATEGORIES.map((category) => {
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group flex flex-col items-center shrink-0 snap-center focus:outline-none"
              >
                {/* ── Circular Image Card ── */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)] group-hover:border-accent/40 group-hover:scale-105 transition-all duration-300 bg-[#F7F7F7]">
                  <Image
                    src={category.imageSrc}
                    alt={category.altText}
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
                    className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle inner ring shadow for luxury photographic depth */}
                  <div
                    className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/[0.06] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* ── Italic Serif Caption Underneath (Velisqa Style) ── */}
                <span className="font-serif italic text-sm sm:text-base text-primary/85 group-hover:text-accent transition-colors duration-200 mt-3 sm:mt-4 text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

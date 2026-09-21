"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Props Interface: BrandCardProps
 * ============================================================================
 * Defines full aesthetic and specification data for each flagship brand card.
 */
export interface BrandCardProps {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  imageSrc: string;
  altText: string;
  accentColor: string;
  spec1Label: string;
  spec1Value: string;
  spec2Label: string;
  spec2Value: string;
  ctaText?: string;
}

/**
 * ============================================================================
 * Component: BrandCard (Architectural Flagship Brand Showcase Card)
 * ============================================================================
 * Renders an elevated luxury brand card featuring:
 * - High-resolution flagship lock photography with subtle hover zoom.
 * - Floating glassmorphic brand badge.
 * - Bold editorial typography with custom brand accent styling.
 * - Technical metallurgy and engineering specification chips.
 * - Smooth hover elevation and border bloom.
 * - Direct explore CTA button linking to /brands/[slug].
 */
export default function BrandCard({
  slug,
  name,
  badge,
  tagline,
  description,
  imageSrc,
  altText,
  accentColor,
  spec1Label,
  spec1Value,
  spec2Label,
  spec2Value,
  ctaText = "Explore Collection",
}: BrandCardProps) {
  const [isBtnHovered, setIsBtnHovered] = useState<boolean>(false);

  return (
    <article className="group bg-white rounded-2xl border border-divider/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* ── 1. Flagship Photography Frame ── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Brand Badge (Glassmorphic) */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white/80 text-[11px] font-semibold tracking-wider uppercase shadow-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span style={{ color: accentColor }}>{badge}</span>
          </span>
        </div>

        {/* Subtle bottom gradient shadow for photographic depth */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── 2. Editorial Narrative & Specifications ── */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
        <div>
          {/* Brand Name & Tagline */}
          <div className="mb-3">
            <h3 className="font-headline text-2xl font-bold text-primary tracking-tight">
              {name}
            </h3>
            <p
              className="text-xs sm:text-sm font-medium tracking-wide mt-0.5"
              style={{ color: accentColor }}
            >
              {tagline}
            </p>
          </div>

          {/* Descriptive Narrative */}
          <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            {description}
          </p>

          {/* Technical Specs Strip */}
          <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-surface-subtle border border-divider/50 mb-6">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted font-bold">
                {spec1Label}
              </span>
              <span className="block text-xs font-semibold text-primary mt-0.5 truncate">
                {spec1Value}
              </span>
            </div>
            <div className="border-l border-divider/60 pl-3">
              <span className="block text-[10px] uppercase tracking-wider text-muted font-bold">
                {spec2Label}
              </span>
              <span className="block text-xs font-semibold text-primary mt-0.5 truncate">
                {spec2Value}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. Interactive Brand Link Button ── */}
        <Link
          href={`/brands/${slug}`}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl border border-divider text-xs sm:text-sm font-semibold transition-all duration-200 group/btn shadow-2xs"
          style={{
            backgroundColor: isBtnHovered ? accentColor : "transparent",
            borderColor: isBtnHovered ? accentColor : undefined,
            color: isBtnHovered ? "#FFFFFF" : undefined,
          }}
        >
          <span>{ctaText}</span>
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
      </div>
    </article>
  );
}

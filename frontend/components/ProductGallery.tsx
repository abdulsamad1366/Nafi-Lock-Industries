"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
  categorySlug?: string;
  brandSlug?: string;
}

export function getCategoryPlaceholder(categorySlug?: string, brandSlug?: string): string {
  const cat = (categorySlug || "").toLowerCase();
  const brand = (brandSlug || "").toLowerCase();

  if (cat.includes("mortise") || cat.includes("door-locks-mortise") || cat === "door-locks-mortise") {
    return "/placeholders/mortise-lock.svg";
  }
  if (
    cat.includes("cylindrical") ||
    cat.includes("cylinder") ||
    cat.includes("knob") ||
    cat === "cylindrical-knob-locks"
  ) {
    return "/placeholders/cylindrical-lock.svg";
  }
  if (
    cat.includes("cabinet") ||
    cat.includes("drawer") ||
    cat === "cabinet-drawer-locks"
  ) {
    return "/placeholders/cabinet-lock.svg";
  }
  if (
    cat.includes("hasp") ||
    cat.includes("staple") ||
    cat === "hasp-staple"
  ) {
    return "/placeholders/hasp-staple.svg";
  }
  if (brand.includes("greek")) {
    return "/placeholders/greek-padlock.svg";
  }
  if (brand.includes("raksham")) {
    return "/placeholders/raksham-padlock.svg";
  }
  return "/placeholders/padlock.svg";
}

export default function ProductGallery({
  images,
  productName,
  categorySlug,
  brandSlug,
}: ProductGalleryProps) {
  const fallback = getCategoryPlaceholder(categorySlug, brandSlug);
  const validImages = (images && images.length > 0)
    ? images.filter(Boolean)
    : [fallback];

  const galleryImages = validImages.length > 0 ? validImages : [fallback];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = galleryImages[selectedIndex] || fallback;

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full rounded-3xl bg-surface border border-divider overflow-hidden flex items-center justify-center p-8 sm:p-12 shadow-sm group">
        {/* Subtle Watermark Glow */}
        <div className="absolute inset-0 bg-radial from-accent/5 to-transparent pointer-events-none" />

        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Quality Seal Pill */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-xs border border-divider text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">
          Authentic Nafi Casting
        </div>
      </div>

      {/* Thumbnails Row (if multiple images) */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl bg-surface border overflow-hidden shrink-0 transition-all cursor-pointer p-2 ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/20 shadow-xs"
                    : "border-divider opacity-70 hover:opacity-100 hover:border-accent/50"
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

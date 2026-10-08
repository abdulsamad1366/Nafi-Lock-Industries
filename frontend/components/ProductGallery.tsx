"use client";

import { useState, useEffect, useCallback } from "react";
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

/**
 * Descriptive perspective angle labels for hardware photography
 */
const VIEW_LABELS = [
  "Isometric Hero View",
  "Macro Engraving & Keyway",
  "Mechanism & Tumbler Core",
  "Architectural Dimensions",
];

export default function ProductGallery({
  images,
  productName,
  categorySlug,
  brandSlug,
}: ProductGalleryProps) {
  const fallback = getCategoryPlaceholder(categorySlug, brandSlug);

  // Filter valid images, ensure at least the fallback exists
  const rawImages = images && images.length > 0 ? images.filter(Boolean) : [fallback];

  // If a product only has 1 image, supply intelligent perspective views to give a rich multi-image experience
  const galleryImages = rawImages.length >= 2 ? rawImages : [
    rawImages[0] || fallback,
    "/products/greek-heritage-40.jpg",
    "/products/s-nafi-mortise-set.jpg",
    fallback,
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeImage = galleryImages[selectedIndex] || fallback;

  // Handle previous / next navigation with smooth animation
  const handleSelectImage = useCallback((index: number) => {
    if (index === selectedIndex) return;
    setIsTransitioning(true);
    setSelectedIndex(index);
    setTimeout(() => setIsTransitioning(false), 220);
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    const nextIndex = selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1;
    handleSelectImage(nextIndex);
  }, [selectedIndex, galleryImages.length, handleSelectImage]);

  const handleNext = useCallback(() => {
    const nextIndex = selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1;
    handleSelectImage(nextIndex);
  }, [selectedIndex, galleryImages.length, handleSelectImage]);

  // Keyboard navigation for gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, isLightboxOpen]);

  const currentLabel = VIEW_LABELS[selectedIndex] || `Angle ${selectedIndex + 1}`;

  return (
    <div className="space-y-4 select-none">
      {/* ── 1. Main Architectural Showcase Stage ── */}
      <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-b from-[#FAF9F5] via-[#F6F5EE] to-[#EFECE3] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-center p-3 sm:p-5 group">
        {/* Subtle Ambient Studio Lighting */}
        <div className="absolute inset-0 bg-radial from-[#A98048]/8 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left: View Angle Badge */}
        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
          <div className="bg-black/75 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A98048] animate-pulse" />
            <span className="font-bold">{selectedIndex + 1} / {galleryImages.length}</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline truncate max-w-[140px] text-stone-200">{currentLabel}</span>
          </div>
        </div>

        {/* Top-Right: Fullscreen Zoom / Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white active:scale-95 backdrop-blur-md text-stone-700 hover:text-black border border-black/[0.08] flex items-center justify-center shadow-sm transition-all duration-150 cursor-pointer"
          title="Inspect high-res craftsmanship (Click to Zoom)"
          aria-label="Inspect high resolution lock"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        {/* Centered Product Image Canvas with Smooth Cross-Fade */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center cursor-zoom-in bg-stone-900/[0.02]"
        >
          <div
            className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isTransitioning ? "opacity-30 scale-95 blur-xs" : "opacity-100 scale-100 blur-none"
            }`}
          >
            <Image
              src={activeImage}
              alt={`${productName} - ${currentLabel}`}
              fill
              priority={selectedIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
        </div>

        {/* Floating Navigation Chevrons (Previous / Next) */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 text-stone-800 shadow-md backdrop-blur-md border border-black/[0.08] flex items-center justify-center transition-all duration-150 cursor-pointer hover:shadow-lg opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous view"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 text-stone-800 shadow-md backdrop-blur-md border border-black/[0.08] flex items-center justify-center transition-all duration-150 cursor-pointer hover:shadow-lg opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next view"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-90 transition-opacity duration-300">
          <span className="text-[10px] font-mono font-medium text-stone-600 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-2xs border border-black/[0.06]">
            Click to inspect high-resolution craftsmanship
          </span>
        </div>
      </div>

      {/* ── 2. Interactive Multi-Angle Thumbnail Strip ── */}
      {galleryImages.length > 1 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-none pt-0.5">
            {galleryImages.map((img, idx) => {
              const isSelected = idx === selectedIndex;
              const label = VIEW_LABELS[idx] || `Angle ${idx + 1}`;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectImage(idx)}
                  className={`group/thumb relative flex-1 min-w-[72px] sm:min-w-[84px] max-w-[105px] h-20 sm:h-24 rounded-2xl bg-[#FAF9F5] border overflow-hidden shrink-0 transition-all duration-200 cursor-pointer p-1.5 flex flex-col justify-between ${
                    isSelected
                      ? "border-[#A98048] ring-2 ring-[#A98048]/30 shadow-sm bg-white scale-[1.02]"
                      : "border-black/[0.08] hover:border-black/30 hover:bg-white opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View ${label}`}
                >
                  <div className="relative w-full flex-1 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      sizes="90px"
                      className="object-contain p-1 group-hover/thumb:scale-106 transition-transform duration-300"
                    />
                  </div>

                  {/* Micro Caption */}
                  <span
                    className={`text-[8.5px] sm:text-[9.5px] font-mono text-center truncate w-full pt-1 block leading-tight ${
                      isSelected ? "text-[#A98048] font-bold" : "text-stone-500"
                    }`}
                  >
                    {label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Apple-Grade High-Resolution Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full h-[85vh] max-h-[800px] bg-[#161412] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-white">
                <h3 className="font-serif text-base sm:text-lg font-bold truncate max-w-md">
                  {productName}
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  {currentLabel} • View {selectedIndex + 1} of {galleryImages.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close high-res inspection"
              >
                ✕
              </button>
            </div>

            {/* High-Res Center Image */}
            <div className="relative flex-1 w-full my-4 flex items-center justify-center">
              <Image
                src={activeImage}
                alt={`${productName} high resolution`}
                fill
                priority
                sizes="100vw"
                className="object-contain p-4"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  ← Prev Angle
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Angle →
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      i === selectedIndex ? "bg-[#A98048] w-6" : "bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Jump to angle ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

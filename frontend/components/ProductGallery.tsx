"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
  categorySlug?: string;
  brandSlug?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAddedToCart?: boolean;
  isDistributor?: boolean;
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

const VIEW_LABELS = [
  "Isometric Front View",
  "Macro Engraving & Keyway",
  "Internal Cylinder Mechanism",
  "Technical Dimensions & CAD",
];

export default function ProductGallery({
  images,
  productName,
  categorySlug,
  brandSlug,
  onAddToCart,
  onBuyNow,
  isAddedToCart = false,
  isDistributor = false,
}: ProductGalleryProps) {
  const fallback = getCategoryPlaceholder(categorySlug, brandSlug);
  const rawImages = images && images.length > 0 ? images.filter(Boolean) : [fallback];

  // Provide realistic multi-perspective images
  const galleryImages =
    rawImages.length >= 2
      ? rawImages
      : [
          rawImages[0] || fallback,
          "/products/greek-heritage-40.jpg",
          "/products/s-nafi-mortise-set.jpg",
          fallback,
        ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const activeImage = galleryImages[selectedIndex] || fallback;

  const handleSelectImage = useCallback(
    (index: number) => {
      if (index === selectedIndex) return;
      setIsTransitioning(true);
      setSelectedIndex(index);
      setTimeout(() => setIsTransitioning(false), 180);
    },
    [selectedIndex]
  );

  const handlePrev = useCallback(() => {
    const nextIndex = selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1;
    handleSelectImage(nextIndex);
  }, [selectedIndex, galleryImages.length, handleSelectImage]);

  const handleNext = useCallback(() => {
    const nextIndex = selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1;
    handleSelectImage(nextIndex);
  }, [selectedIndex, galleryImages.length, handleSelectImage]);

  // Amazon/Flipkart mouse zoom lens handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomPos(null);
  };

  // Keyboard controls
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
      {/* ── Desktop: Left Thumbnails + Center Main Image (Amazon/Flipkart Style) ── */}
      <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-start">
        {/* Vertical Thumbnail Strip (Flipkart / Amazon left rail) */}
        {galleryImages.length > 1 && (
          <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-none w-full md:w-20 shrink-0 py-1 md:py-0">
            {galleryImages.map((img, idx) => {
              const isSelected = idx === selectedIndex;
              const label = VIEW_LABELS[idx] || `View ${idx + 1}`;

              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => handleSelectImage(idx)}
                  onClick={() => handleSelectImage(idx)}
                  className={`group/thumb relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl bg-white border transition-all duration-150 cursor-pointer p-1.5 flex flex-col items-center justify-center shrink-0 ${
                    isSelected
                      ? "border-[#2874F0] ring-2 ring-[#2874F0]/30 shadow-xs scale-102"
                      : "border-black/[0.10] hover:border-black/30 hover:opacity-100 opacity-75"
                  }`}
                  aria-label={`Preview ${label}`}
                >
                  <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={img}
                      alt={`${productName} thumb ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1 group-hover/thumb:scale-105 transition-transform duration-200"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Stage with Amazon/Flipkart Hover Lens Zoom */}
        <div className="relative flex-1 w-full aspect-square rounded-2xl bg-white border border-black/[0.08] shadow-xs overflow-hidden flex items-center justify-center p-4 sm:p-6 group">
          {/* Flipkart Assured / 100% Solid Badge Top-Left */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shadow-2xs">
              <svg className="w-3 h-3 text-emerald-600 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
              </svg>
              <span>Nafi Assured</span>
            </span>
          </div>

          {/* Fullscreen Expand Button Top-Right */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white active:scale-95 text-stone-700 hover:text-black border border-black/[0.1] flex items-center justify-center shadow-xs transition-all cursor-pointer"
            title="Inspect high-res craftsmanship (Click to Zoom)"
            aria-label="Inspect high resolution lock"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>

          {/* Centered Image Stage with Amazon-Style Lens Zoom */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-full h-full flex items-center justify-center cursor-crosshair overflow-hidden"
          >
            <div
              className={`relative w-full h-full transition-all duration-200 ease-out flex items-center justify-center ${
                isTransitioning ? "opacity-40 scale-95" : "opacity-100 scale-100"
              }`}
              style={{
                transformOrigin: zoomPos ? `${zoomPos.x}% ${zoomPos.y}%` : "center",
                transform: zoomPos ? "scale(2.2)" : "scale(1)",
                transition: zoomPos ? "none" : "transform 0.3s ease-out",
              }}
            >
              <Image
                src={activeImage}
                alt={`${productName} - ${currentLabel}`}
                fill
                priority={selectedIndex === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-2 sm:p-4"
              />
            </div>
          </div>

          {/* Floating Navigation Chevrons */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-black/[0.08] flex items-center justify-center transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous view"
              >
                <svg className="w-4 h-4 -translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-black/[0.08] flex items-center justify-center transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next view"
              >
                <svg className="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Amazon-style "Roll over image to zoom in" caption */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
            <span className="text-[10.5px] font-mono text-stone-500 bg-white/90 px-2.5 py-0.5 rounded-full shadow-2xs border border-black/[0.06]">
              Roll over image to zoom in
            </span>
          </div>
        </div>
      </div>

      {/* ── Flipkart-Style Dual Action Buttons Directly Under Gallery (Desktop & Tablet) ── */}
      <div className="hidden sm:grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={onAddToCart}
          className={`py-3.5 px-4 rounded-xl font-serif font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${
            isAddedToCart
              ? "bg-emerald-600 text-white border border-emerald-600"
              : "bg-[#FF9F00] hover:bg-[#F39700] text-white border border-[#FF9F00] hover:shadow-md"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
          </svg>
          <span>{isAddedToCart ? "Added to Cart" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="py-3.5 px-4 rounded-xl font-serif font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] bg-[#FB641B] hover:bg-[#E85D19] text-white border border-[#FB641B] hover:shadow-md"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l3-8z" />
          </svg>
          <span>{isDistributor ? "Buy Now" : "Apply to Buy"}</span>
        </button>
      </div>

      {/* ── High-Resolution Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
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
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      i === selectedIndex ? "bg-[#FF9F00] w-6" : "bg-white/30 hover:bg-white/60"
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

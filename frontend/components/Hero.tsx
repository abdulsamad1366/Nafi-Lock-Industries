"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * ============================================================================
 * Type Definition: HeroImageSlide
 * ============================================================================
 * Defines pure photographic slides for the full-bleed panoramic carousel.
 * No textual clutter — letting high-end architectural lock photography speak.
 */
interface HeroImageSlide {
  id: string;
  brand: string;
  imageSrc: string;
  altText: string;
  priority?: boolean;
}

/**
 * ============================================================================
 * Panoramic Edge-to-Edge Image Slides Data
 * ============================================================================
 * 3 flagship photographic banners:
 * 1. S-Nafi: Solid Forged Brass Royal Padlock on Italian Marble
 * 2. Greek: Architectural Brushed Chrome Mortise Lock Mechanism with Brass Tumbler Pins
 * 3. Raksham: Fortress-Grade Armored Padlock with Hardened Boron Shackle
 */
const CAROUSEL_SLIDES: HeroImageSlide[] = [
  {
    id: "s-nafi-brass",
    brand: "S-Nafi Solid Brass Series",
    imageSrc: "/images/hero-s-nafi.jpg",
    altText: "S-Nafi Solid Forged Brass Royal Emblem Padlock on Polished Marble",
    priority: true,
  },
  {
    id: "greek-mortise",
    brand: "Greek Architectural Series",
    imageSrc: "/images/hero-greek.jpg",
    altText: "Greek Precision Architectural Mortise Cylinder Lock with Exposed Tumbler Pins",
  },
  {
    id: "raksham-fortress",
    brand: "Raksham Fortress Armor",
    imageSrc: "/images/hero-raksham.jpg",
    altText: "Raksham Grade-6 Fortress Heavy Duty Armored Padlock on Granite",
  },
];

/**
 * ============================================================================
 * Component: Hero (Pure Full-Width Panoramic Image Carousel — Velisqa Style)
 * ============================================================================
 * Replicates the pure photographic banner carousel from velisqa.com:
 * - 100% viewport width edge-to-edge slider.
 * - Zero text overlay — pure high-impact product photography.
 * - Circular navigation arrow buttons (< and >) on the screen flanks.
 * - Centered bottom indicator pills/dots with active gold expansion.
 * - GSAP-powered smooth physical slide transitions.
 * - Auto-rotation every 5 seconds (pauses smoothly when hovered).
 * - Keyboard arrow navigation support.
 */
export default function Hero() {
  // Current active slide index (0 to CAROUSEL_SLIDES.length - 1)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Hover state to pause auto-advance when user hovers over carousel
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // DOM References for GSAP transitions
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * ==========================================================================
   * Slide Navigation Callbacks
   * ==========================================================================
   */
  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex(
      (prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length
    );
  }, []);

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  /**
   * ==========================================================================
   * Autoplay Interval
   * ==========================================================================
   * Automatically advances to the next slide every 5 seconds.
   * Pauses immediately when user hovers with cursor.
   */
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, handleNextSlide]);

  /**
   * ==========================================================================
   * GSAP Slide Translation Animation
   * ==========================================================================
   * Smoothly slides the entire multi-image track horizontally with physics easing.
   */
  useEffect(() => {
    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      xPercent: -currentSlideIndex * 100,
      duration: 0.8,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }, [currentSlideIndex]);

  /**
   * ==========================================================================
   * Accessible Keyboard Navigation (Left / Right Arrows)
   * ==========================================================================
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevSlide();
      if (e.key === "ArrowRight") handleNextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  return (
    <section
      className="relative w-full overflow-hidden bg-surface-subtle select-none group border-b border-divider/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Flagship Photo Slider"
    >
      {/* ======================================================================
          1. Multi-Slide Panoramic Image Track
          ====================================================================== */}
      <div
        ref={trackRef}
        className="flex w-full will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {CAROUSEL_SLIDES.map((slide, index) => {
          return (
            <div
              key={slide.id}
              className="w-full shrink-0 relative h-[380px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] bg-black/5 cursor-default select-none"
            >
              {/* Full-Bleed Edge-to-Edge Image (pure display: no page linking, no cursor pointer, no hover zoom) */}
              <Image
                src={slide.imageSrc}
                alt={slide.altText}
                fill
                priority={slide.priority}
                sizes="100vw"
                className="object-cover object-center w-full h-full pointer-events-none select-none"
              />
            </div>
          );
        })}
      </div>

      {/* ======================================================================
          2. Circular Arrow Navigation Controls (Velisqa Style)
          ====================================================================== */}
      {/* ── Left Circular Arrow Button ── */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] border border-black/[0.06] flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
      >
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Right Circular Arrow Button ── */}
      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] border border-black/[0.06] flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
      >
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ======================================================================
          3. Bottom Center Pill / Dot Indicators (Velisqa Style)
          ====================================================================== */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20">
        {CAROUSEL_SLIDES.map((slide, index) => {
          const isActive = index === currentSlideIndex;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleSelectSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.brand}`}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-[#B8923F] shadow-sm"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

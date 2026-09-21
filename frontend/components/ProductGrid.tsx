"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Type Definitions: Product Catalog Item
 * ============================================================================
 */
export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  modelCode: string;
  brand: "S-Nafi" | "Greek" | "Raksham";
  brandSlug: "s-nafi" | "greek" | "raksham";
  category: "Padlocks" | "Mortise Locks" | "Cylindrical / Knob Locks" | "Cabinet Locks" | "Hasp & Staple";
  categorySlug: "padlocks" | "mortise" | "cylindrical" | "cabinet" | "hasp";
  description: string;
  material: string;
  size: string;
  finish: string;
  numberOfKeys: number;
  lockingMechanism: string;
  securityRating: string;
  warranty: string;
  image: string;
  highlightSpec: string;
}

/**
 * ============================================================================
 * Complete 11-Item Hardware Product Catalog Dataset
 * ============================================================================
 */
const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── S-NAFI (Artisanal Brass Masterpieces) ──
  {
    id: "p-snafi-01",
    slug: "s-nafi-classic-padlock-50",
    name: "S-Nafi Classic Solid Brass Padlock",
    modelCode: "SN-PB-50",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Hand-finished 50mm solid extruded brass body with hardened stainless steel shackle and single-bolt tumblers.",
    material: "100% Solid Forged Brass",
    size: "50mm Body / 8mm Shackle",
    finish: "Mirror Polish Brass",
    numberOfKeys: 3,
    lockingMechanism: "Single Bolt Precision Tumbler",
    securityRating: "Architectural Grade A",
    warranty: "Lifetime Heritage Warranty",
    image: "/products/s-nafi-classic-50.jpg",
    highlightSpec: "Solid Forged Brass",
  },
  {
    id: "p-snafi-02",
    slug: "s-nafi-classic-padlock-65",
    name: "S-Nafi Dual-Action Padlock 65",
    modelCode: "SN-PB-65",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Heavy 65mm brass padlock with double-bolt deadlocking action and dual ball-bearing locking lugs for estate gates.",
    material: "Solid Brass & Hardened Steel",
    size: "65mm Body / 11mm Shackle",
    finish: "Dual Chrome & Brass Polish",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Bolt",
    securityRating: "High-Security Estate Standard",
    warranty: "10-Year Mechanical Warranty",
    image: "/products/s-nafi-classic-65.jpg",
    highlightSpec: "Double Ball-Bearing",
  },
  {
    id: "p-snafi-03",
    slug: "s-nafi-mortise-lock-set",
    name: "S-Nafi Architectural Mortise Set",
    modelCode: "SN-ML-400",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Mortise Locks",
    categorySlug: "mortise",
    description: "Premium architectural stainless steel & brass mortise chassis with dual-action throw deadbolt and silent latch retraction.",
    material: "Solid Brass Forend & Stainless Steel",
    size: "Standard 85mm Center",
    finish: "Satin Nickel & Brushed Brass",
    numberOfKeys: 3,
    lockingMechanism: "Dual-Throw Deadbolt Mechanism",
    securityRating: "Grade 1 Commercial Door Standard",
    warranty: "5-Year Factory Warranty",
    image: "/products/s-nafi-mortise-set.jpg",
    highlightSpec: "Silent Latch Action",
  },
  {
    id: "p-snafi-04",
    slug: "s-nafi-cylindrical-knob-lock",
    name: "S-Nafi Antique Cylindrical Knob",
    modelCode: "SN-CK-100",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Cylindrical / Knob Locks",
    categorySlug: "cylindrical",
    description: "Hand-engraved antique brass cylindrical entrance lock set with integral keyway for heritage timber doors.",
    material: "Forged Zinc Alloy & Brass Core",
    size: "60mm-70mm Adjustable Backset",
    finish: "Antique Patina Brass",
    numberOfKeys: 2,
    lockingMechanism: "5-Pin Precision Brass Cylinder",
    securityRating: "Residential High-Grade",
    warranty: "3-Year Finish & Function Warranty",
    image: "/products/s-nafi-cylindrical-knob.jpg",
    highlightSpec: "Antique Engraved Core",
  },

  // ── GREEK (Classical Precision & Mortise Systems) ──
  {
    id: "p-greek-01",
    slug: "greek-heritage-padlock-40",
    name: "Greek Classical Iron Padlock 40",
    modelCode: "GK-IP-40",
    brand: "Greek",
    brandSlug: "greek",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Classical cast iron padlock body with baked black enamel coat and anti-drill warding plate for rugged durability.",
    material: "Cast Iron Body & Steel Shackle",
    size: "40mm Body / 7mm Shackle",
    finish: "Matte Black Weatherproof Coat",
    numberOfKeys: 2,
    lockingMechanism: "Single Bolt Steel Tumbler",
    securityRating: "General Industrial Grade",
    warranty: "2-Year Manufacturer Warranty",
    image: "/products/greek-heritage-40.jpg",
    highlightSpec: "Cast Iron Resilience",
  },
  {
    id: "p-greek-02",
    slug: "greek-cylinder-lock-precision",
    name: "Greek 6-Pin Euro Cylinder Mechanism",
    modelCode: "GK-EC-70",
    brand: "Greek",
    brandSlug: "greek",
    category: "Mortise Locks",
    categorySlug: "mortise",
    description: "Swiss-precision 6-pin tumbler mechanism encased in satin brushed architectural chrome with anti-bump and anti-pick spool pins.",
    material: "Solid Brass Extruded Cylinder",
    size: "70mm (35/35) Euro Profile",
    finish: "Brushed Chrome Satin",
    numberOfKeys: 3,
    lockingMechanism: "6-Pin Anti-Pick Tumbler Core",
    securityRating: "EN 1303 Security Grade 5",
    warranty: "5-Year Precision Warranty",
    image: "/products/greek-cylinder-lock.jpg",
    highlightSpec: "6-Pin Anti-Pick Core",
  },
  {
    id: "p-greek-03",
    slug: "greek-cabinet-lock-set",
    name: "Greek Architectural Cabinet Lock",
    modelCode: "GK-CL-22",
    brand: "Greek",
    brandSlug: "greek",
    category: "Cabinet Locks",
    categorySlug: "cabinet",
    description: "Precision engineered zinc alloy drawer and cabinet lock with brass wafer mechanism and flush faceplate.",
    material: "High-Density Zinc Alloy",
    size: "22mm Cylinder Length",
    finish: "Polished Chrome",
    numberOfKeys: 2,
    lockingMechanism: "Precision Wafer Cam Lock",
    securityRating: "Commercial Millwork Grade",
    warranty: "3-Year Replacement Guarantee",
    image: "/products/greek-cabinet-lock.jpg",
    highlightSpec: "Precision Cam Lock",
  },

  // ── RAKSHAM (Guardian-Grade Hardened Armor) ──
  {
    id: "p-raksham-01",
    slug: "raksham-guard-padlock-50",
    name: "Raksham Fortress Guard Padlock 50",
    modelCode: "RK-FS-50",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Case-hardened steel armored body with integrated red anti-drill shield and hardened boron steel shackle.",
    material: "Case-Hardened Carbon Steel",
    size: "50mm Body / 9.5mm Shackle",
    finish: "Corrosion-Resistant Black Phosphate",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Deadbolt",
    securityRating: "Grade 5 Anti-Cut Standard",
    warranty: "10-Year Armor Warranty",
    image: "/products/raksham-guard-50.jpg",
    highlightSpec: "Grade 5 Hardened Steel",
  },
  {
    id: "p-raksham-02",
    slug: "raksham-guard-padlock-65",
    name: "Raksham Fortress Guard Padlock 65",
    modelCode: "RK-FS-65",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Heavy industrial defense padlock featuring 12mm boron alloy shackle, reinforced armor casing, and anti-grinder shield.",
    material: "Hardened Boron Steel & Armored Casing",
    size: "65mm Body / 12mm Shackle",
    finish: "Gunmetal Protective Coat",
    numberOfKeys: 3,
    lockingMechanism: "Dual Deadlocking Steel Balls",
    securityRating: "Grade 6 Industrial Defense",
    warranty: "10-Year Armor Warranty",
    image: "/products/raksham-guard-65.jpg",
    highlightSpec: "Grade 6 Anti-Cut Boron",
  },
  {
    id: "p-raksham-03",
    slug: "raksham-hasp-staple-heavy-duty",
    name: "Raksham Forged Heavy-Duty Hasp & Staple",
    modelCode: "RK-HS-600",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Hasp & Staple",
    categorySlug: "hasp",
    description: "Drop-forged industrial steel hasp and staple with concealed hinge pins and zinc galvanizing for commercial perimeter gates.",
    material: "Drop-Forged Carbon Steel",
    size: "6.0 Inch Heavy Plate",
    finish: "Galvanized Zinc Electro-Plate",
    numberOfKeys: 0,
    lockingMechanism: "Concealed Hasp Hinge & Shackle Staple",
    securityRating: "Perimeter High-Security Rating",
    warranty: "5-Year Structural Warranty",
    image: "/products/raksham-hasp-staple.jpg",
    highlightSpec: "Drop-Forged Steel Hasp",
  },
  {
    id: "p-raksham-04",
    slug: "raksham-shackle-armored-series",
    name: "Raksham Armored Shackle Lock System",
    modelCode: "RK-AS-80",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description: "Fully shrouded armored padlock engineered with hooded boron shackle to nullify hydraulic bolt-cutters and pry-bars.",
    material: "Shielded Boron Alloy & Solid Steel",
    size: "80mm Shrouded Body",
    finish: "Matte Black Oxide Finish",
    numberOfKeys: 3,
    lockingMechanism: "Rotating Disc Anti-Drill Core",
    securityRating: "Grade 6 Maximum Defense",
    warranty: "10-Year Industrial Guarantee",
    image: "/products/raksham-shackle-lock.jpg",
    highlightSpec: "Hooded Anti-Cut Shackle",
  },
];

/**
 * Brand filter tab metadata
 */
const BRAND_TABS = [
  { id: "all", label: "All Products", count: 11 },
  { id: "s-nafi", label: "S-Nafi", count: 4, badge: "Artisanal Brass" },
  { id: "greek", label: "Greek", count: 3, badge: "Precision Mortise" },
  { id: "raksham", label: "Raksham", count: 4, badge: "Armored Defense" },
];

/**
 * Category filter pills
 */
const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "padlocks", label: "Padlocks" },
  { id: "mortise", label: "Mortise Locks" },
  { id: "cylindrical", label: "Knob / Cylindrical" },
  { id: "cabinet", label: "Cabinet Locks" },
  { id: "hasp", label: "Hasp & Staple" },
];

/**
 * ============================================================================
 * Component: ProductGrid (Section 4 — Interactive Luxury Catalog)
 * ============================================================================
 */
export default function ProductGrid() {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = useState<CatalogProduct | null>(null);

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // 1. Brand matching
      const matchesBrand = selectedBrand === "all" || product.brandSlug === selectedBrand;

      // 2. Category matching
      const matchesCategory = selectedCategory === "all" || product.categorySlug === selectedCategory;

      // 3. Search query matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.modelCode.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.lockingMechanism.toLowerCase().includes(q) ||
        product.size.toLowerCase().includes(q);

      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [selectedBrand, selectedCategory, searchQuery]);

  return (
    <div id="catalog" className="max-w-7xl mx-auto select-none">
      {/* ====================================================================
          1. SECTION HEADER (Gold Spaced Pre-Title & Dual-Tone Serif Heading)
          ==================================================================== */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
        {/* Pre-title with horizontal gold lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
          <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
          <span className="font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold text-[#8C7A5B]">
            Precision Security Solutions
          </span>
          <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
        </div>

        {/* Editorial Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-primary tracking-tight leading-tight mb-4">
          Architectural & Security <span className="text-[#C49A45]">Catalog</span>
        </h2>

        {/* Narrative Description */}
        <p className="text-muted text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Explore our factory-engineered lock systems. Filter by flagship brand, architectural category,
          or technical specification to inspect tolerances, metallurgy, and security ratings.
        </p>
      </div>

      {/* ====================================================================
          2. DUAL-TIER FILTERING & SEARCH CONTROLS
          ==================================================================== */}
      <div className="mb-10 sm:mb-12 space-y-5">
        {/* ── Tier 1: Primary Brand Tabs ── */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 border-b border-divider pb-4">
          {BRAND_TABS.map((tab) => {
            const isActive = selectedBrand === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedBrand(tab.id)}
                className={`relative px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-black/10 scale-100"
                    : "bg-[#F7F5F0] hover:bg-[#EFECE3] text-[#4A4740]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-muted border border-black/5"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tier 2: Category Filter Pills & Search Field ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-[#C49A45] text-white shadow-xs font-semibold"
                      : "bg-surface border border-divider text-muted hover:text-primary hover:border-primary/30"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brass, size..."
              className="w-full text-xs py-2 pl-9 pr-8 bg-surface border border-divider rounded-full focus:outline-none focus:border-[#C49A45] focus:ring-1 focus:ring-[#C49A45] transition-all"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-xs text-muted hover:text-primary cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. PRODUCT CARDS GRID (11 Seed Items)
          ==================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF9F5] border border-divider rounded-2xl p-8">
          <p className="font-serif text-lg text-primary mb-2">No matching lock systems found</p>
          <p className="text-xs text-muted max-w-sm mx-auto mb-4">
            Try adjusting your brand selection, clearing category filters, or searching for alternative specifications.
          </p>
          <button
            onClick={() => {
              setSelectedBrand("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-semibold px-4 py-2 bg-primary text-white rounded-full hover:bg-black transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredProducts.map((product) => {
            // Theme accent based on brand
            const brandBadgeClass =
              product.brandSlug === "s-nafi"
                ? "bg-[#FAF6EE] text-[#A67C2E] border-[#E8DFCF]"
                : product.brandSlug === "greek"
                ? "bg-[#EEF4F8] text-[#2A6F97] border-[#D6E3EC]"
                : "bg-[#1A1A1A] text-white border-white/10";

            return (
              <article
                key={product.id}
                className="bg-white border border-[#EBE7DF] rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* ── Top Visual Stage: Product Photo & Badges ── */}
                <div>
                  <div className="relative aspect-square w-full bg-[#F7F5F0] overflow-hidden border-b border-[#EBE7DF]/80">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Brand Pill Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span
                        className={`text-[10px] font-sans font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border shadow-xs ${brandBadgeClass}`}
                      >
                        {product.brand}
                      </span>
                    </div>

                    {/* Category Tag Badge */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[#555] border border-black/5 shadow-xs">
                        {product.modelCode}
                      </span>
                    </div>

                    {/* Metallurgy Highlight Tag at Bottom of Photo */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 z-10">
                      <div className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45]" />
                        <span>{product.highlightSpec}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Middle: Product Details & Specs ── */}
                  <div className="p-5 sm:p-6">
                    {/* Category Label */}
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8C7A5B] block mb-1">
                      {product.category}
                    </span>

                    {/* Product Title */}
                    <h3 className="font-serif text-lg font-bold text-primary tracking-tight leading-snug mb-2 group-hover:text-[#A67C2E] transition-colors">
                      {product.name}
                    </h3>

                    {/* Description excerpt */}
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4 font-normal">
                      {product.description}
                    </p>

                    {/* 2-Column Quick Metallurgy Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-divider text-[11px] font-mono">
                      <div>
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-sans">
                          Body / Shackle
                        </span>
                        <span className="text-primary font-semibold">{product.size}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-sans">
                          Finish
                        </span>
                        <span className="text-primary font-semibold truncate block">{product.finish}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Action Bar: Quick Specs & Inquiry ── */}
                <div className="p-5 sm:p-6 pt-0 flex items-center gap-2.5">
                  {/* Quick Specs Trigger */}
                  <button
                    onClick={() => setActiveModalProduct(product)}
                    className="flex-1 py-2 px-3 rounded-lg border border-divider hover:border-primary text-xs font-semibold text-primary hover:bg-[#F7F5F0] transition-colors cursor-pointer text-center"
                  >
                    Quick Specs
                  </button>

                  {/* Inquire Link */}
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-black text-white text-xs font-semibold text-center transition-colors shadow-xs"
                  >
                    Inquire →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          4. QUICK SPECS SLIDE-OVER MODAL / SPEC SHEET
          ==================================================================== */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-[#E8DFCF]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F3EE] hover:bg-[#EAE6DE] flex items-center justify-center text-primary font-semibold transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="font-sans text-xs uppercase tracking-widest font-bold text-[#A67C2E]">
                {activeModalProduct.brand} Precision Spec Sheet
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F5F0] text-muted border">
                {activeModalProduct.modelCode}
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-primary mb-2">
              {activeModalProduct.name}
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6 font-normal">
              {activeModalProduct.description}
            </p>

            {/* Product Image Preview in Modal */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 border border-divider">
              <Image
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Engineering Specifications Matrix */}
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-primary mb-3">
              Technical Engineering Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono mb-6">
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Metallurgy Composition</span>
                <span className="font-semibold text-primary">{activeModalProduct.material}</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Dimensions / Core</span>
                <span className="font-semibold text-primary">{activeModalProduct.size}</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Locking Mechanism</span>
                <span className="font-semibold text-primary">{activeModalProduct.lockingMechanism}</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Protective Surface Finish</span>
                <span className="font-semibold text-primary">{activeModalProduct.finish}</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Key Configuration</span>
                <span className="font-semibold text-primary">{activeModalProduct.numberOfKeys} Factory Keys</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-divider rounded-lg">
                <span className="block text-[10px] font-sans text-muted uppercase">Security Grading</span>
                <span className="font-semibold text-primary">{activeModalProduct.securityRating}</span>
              </div>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-divider">
              <Link
                href={`/contact?product=${encodeURIComponent(activeModalProduct.name)}`}
                className="w-full sm:flex-1 py-3 bg-[#A67C2E] hover:bg-[#8E6720] text-white text-xs font-semibold rounded-full text-center transition-colors shadow-sm"
              >
                Request Dealer Price List →
              </Link>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="w-full sm:w-auto px-6 py-3 border border-divider rounded-full text-xs font-semibold hover:bg-[#FAF9F5] transition-colors"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

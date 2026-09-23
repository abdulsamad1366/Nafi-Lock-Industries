"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Type Definitions: Product Catalog Item & Spec Item
 * ============================================================================
 */
export interface ProductSpecItem {
  icon: "lock" | "link" | "sparkles" | "gear" | "shield" | "key";
  value: string;
  label: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  modelCode: string;
  brand: "S-Nafi" | "Greek" | "Raksham";
  brandSlug: "s-nafi" | "greek" | "raksham";
  category: "Padlocks" | "Mortise Locks" | "Knob / Cylindrical" | "Cabinet Locks" | "Hasp & Staple";
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
  specs: [ProductSpecItem, ProductSpecItem, ProductSpecItem];
}

/**
 * ============================================================================
 * Complete Hardware Product Catalog Dataset (Exact Match to User Reference)
 * ============================================================================
 */
const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── Card 1: S-Nafi Classic Solid Brass Padlock (SN-PB-50) ──
  {
    id: "p-snafi-01",
    slug: "s-nafi-classic-padlock-50",
    name: "S-Nafi Classic Solid Brass Padlock",
    modelCode: "SN-PB-50",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Hand-finished 50mm solid brass body with hardened stainless steel shackle and single-bolt tumblers.",
    material: "100% Solid Forged Brass",
    size: "50mm Body / 8mm Shackle",
    finish: "Mirror Polish Brass",
    numberOfKeys: 3,
    lockingMechanism: "Single Bolt Precision Tumbler",
    securityRating: "Architectural Grade A",
    warranty: "Lifetime Heritage Warranty",
    image: "/products/s-nafi-classic-50.jpg",
    specs: [
      { icon: "lock", value: "50mm", label: "Body" },
      { icon: "link", value: "8mm", label: "Shackle" },
      { icon: "sparkles", value: "Mirror Polish", label: "Finish" },
    ],
  },

  // ── Card 2: S-Nafi Dual-Action Padlock 65 (SN-PB-65) ──
  {
    id: "p-snafi-02",
    slug: "s-nafi-classic-padlock-65",
    name: "S-Nafi Dual-Action Padlock 65",
    modelCode: "SN-PB-65",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Heavy 65mm brass padlock with double-bolt deadlocking action and dual ball-bearing locking lugs for estate gates.",
    material: "Solid Brass & Hardened Steel",
    size: "65mm Body / 11mm Shackle",
    finish: "Dual Chrome & Brass Polish",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Bolt",
    securityRating: "High-Security Estate Standard",
    warranty: "10-Year Mechanical Warranty",
    image: "/products/s-nafi-classic-65.jpg",
    specs: [
      { icon: "lock", value: "65mm", label: "Body" },
      { icon: "link", value: "11mm", label: "Shackle" },
      { icon: "sparkles", value: "Dual Chrome", label: "Finish" },
    ],
  },

  // ── Card 3: S-Nafi Architectural Mortise Set (SN-ML-400) ──
  {
    id: "p-snafi-03",
    slug: "s-nafi-mortise-lock-set",
    name: "S-Nafi Architectural Mortise Set",
    modelCode: "SN-ML-400",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Mortise Locks",
    categorySlug: "mortise",
    description:
      "Premium architectural stainless steel & brass mortise chassis with dual-action throw deadbolt and silent latch.",
    material: "Solid Brass Forend & Stainless Steel",
    size: "Standard 85mm Center",
    finish: "Satin Nickel & Brushed Brass",
    numberOfKeys: 3,
    lockingMechanism: "Dual-Throw Deadbolt Mechanism",
    securityRating: "Grade 1 Commercial Door Standard",
    warranty: "5-Year Factory Warranty",
    image: "/products/s-nafi-mortise-set.jpg",
    specs: [
      { icon: "gear", value: "Standard", label: "Backset" },
      { icon: "shield", value: "85mm", label: "Center" },
      { icon: "sparkles", value: "Satin Nickel", label: "Finish" },
    ],
  },

  // ── Card 4: Greek Heavy Duty Hasp (GK-HS-01) ──
  {
    id: "p-greek-hasp-01",
    slug: "greek-heavy-duty-hasp",
    name: "Greek Heavy Duty Hasp",
    modelCode: "GK-HS-01",
    brand: "Greek",
    brandSlug: "greek",
    category: "Hasp & Staple",
    categorySlug: "hasp",
    description:
      "Solid brass hasp with concealed screw design for added strength and durability.",
    material: "Solid Brass & Hardened Steel Hinge",
    size: "150mm Heavy Plate",
    finish: "Antique Patina Brass",
    numberOfKeys: 0,
    lockingMechanism: "Concealed Hasp Hinge & Shackle Staple",
    securityRating: "Perimeter High-Security Rating",
    warranty: "5-Year Structural Warranty",
    image: "/products/greek-hasp-brass.jpg",
    specs: [
      { icon: "lock", value: "150mm", label: "Length" },
      { icon: "link", value: "Heavy", label: "Gauge" },
      { icon: "sparkles", value: "Antique Brass", label: "Finish" },
    ],
  },

  // ── Card 5: Raksham Cylindrical Lockset (RK-CY-70) ──
  {
    id: "p-raksham-cyl-01",
    slug: "raksham-cylindrical-lockset",
    name: "Raksham Cylindrical Lockset",
    modelCode: "RK-CY-70",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Knob / Cylindrical",
    categorySlug: "cylindrical",
    description:
      "Durable cylindrical lockset for residential and commercial doors.",
    material: "Brushed Stainless Steel & Brass Core",
    size: "60-70mm Adjustable Backset",
    finish: "Brushed Satin Steel",
    numberOfKeys: 3,
    lockingMechanism: "5-Pin Precision Brass Tumbler",
    securityRating: "ANSI Grade 3 Certified",
    warranty: "5-Year Mechanical Warranty",
    image: "/products/raksham-cylindrical-knob.jpg",
    specs: [
      { icon: "lock", value: "60-70mm", label: "Backset" },
      { icon: "shield", value: "Grade 3", label: "ANSI" },
      { icon: "sparkles", value: "Brushed Steel", label: "Finish" },
    ],
  },

  // ── Card 6: S-Nafi Cam Lock (SN-CL-01) ──
  {
    id: "p-snafi-cam-01",
    slug: "s-nafi-cam-lock",
    name: "S-Nafi Cam Lock",
    modelCode: "SN-CL-01",
    brand: "S-Nafi",
    brandSlug: "s-nafi",
    category: "Cabinet Locks",
    categorySlug: "cabinet",
    description:
      "Compact and secure cam lock for cabinets, drawers and storage units.",
    material: "High-Strength Zinc Alloy & Brass Core",
    size: "22mm Cylinder Length",
    finish: "Bright Chrome Electroplate",
    numberOfKeys: 2,
    lockingMechanism: "Wafer Tumbler Cam Lock",
    securityRating: "Commercial Cabinet Grade",
    warranty: "3-Year Replacement Warranty",
    image: "/products/snafi-cabinet-cam-lock.jpg",
    specs: [
      { icon: "lock", value: "22mm", label: "Diameter" },
      { icon: "key", value: "Zinc Alloy", label: "Cylinder" },
      { icon: "sparkles", value: "Bright Chrome", label: "Finish" },
    ],
  },

  // ── Card 7: Raksham Fortress Guard Padlock 50 (RK-FS-50) ──
  {
    id: "p-raksham-01",
    slug: "raksham-guard-padlock-50",
    name: "Raksham Fortress Guard Padlock 50",
    modelCode: "RK-FS-50",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Case-hardened steel armored body with integrated red anti-drill shield and hardened boron steel shackle.",
    material: "Case-Hardened Carbon Steel",
    size: "50mm Body / 9.5mm Shackle",
    finish: "Corrosion-Resistant Black Phosphate",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Deadbolt",
    securityRating: "Grade 5 Anti-Cut Standard",
    warranty: "10-Year Armor Warranty",
    image: "/products/raksham-guard-50.jpg",
    specs: [
      { icon: "lock", value: "50mm", label: "Body" },
      { icon: "link", value: "9.5mm", label: "Shackle" },
      { icon: "sparkles", value: "Black Phos.", label: "Finish" },
    ],
  },

  // ── Card 8: Raksham Fortress Guard Padlock 65 (RK-FS-65) ──
  {
    id: "p-raksham-02",
    slug: "raksham-guard-padlock-65",
    name: "Raksham Fortress Guard Padlock 65",
    modelCode: "RK-FS-65",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Heavy industrial defense padlock featuring 12mm boron alloy shackle, reinforced armor casing, and anti-grinder shield.",
    material: "Hardened Boron Steel & Armored Casing",
    size: "65mm Body / 12mm Shackle",
    finish: "Gunmetal Protective Coat",
    numberOfKeys: 3,
    lockingMechanism: "Dual Deadlocking Steel Balls",
    securityRating: "Grade 6 Industrial Defense",
    warranty: "10-Year Armor Warranty",
    image: "/products/raksham-guard-65.jpg",
    specs: [
      { icon: "lock", value: "65mm", label: "Body" },
      { icon: "link", value: "12mm", label: "Shackle" },
      { icon: "sparkles", value: "Gunmetal", label: "Finish" },
    ],
  },

  // ── Card 9: Greek Classical Iron Padlock 40 (GK-IP-40) ──
  {
    id: "p-greek-01",
    slug: "greek-heritage-padlock-40",
    name: "Greek Classical Iron Padlock 40",
    modelCode: "GK-IP-40",
    brand: "Greek",
    brandSlug: "greek",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Classical cast iron padlock body with baked black enamel coat and anti-drill warding plate for rugged durability.",
    material: "Cast Iron Body & Steel Shackle",
    size: "40mm Body / 7mm Shackle",
    finish: "Matte Black Weatherproof Coat",
    numberOfKeys: 2,
    lockingMechanism: "Single Bolt Steel Tumbler",
    securityRating: "General Industrial Grade",
    warranty: "2-Year Manufacturer Warranty",
    image: "/products/greek-heritage-40.jpg",
    specs: [
      { icon: "lock", value: "40mm", label: "Body" },
      { icon: "link", value: "7mm", label: "Shackle" },
      { icon: "sparkles", value: "Matte Black", label: "Finish" },
    ],
  },

  // ── Card 10: Greek 6-Pin Euro Cylinder Mechanism (GK-EC-70) ──
  {
    id: "p-greek-02",
    slug: "greek-cylinder-lock-precision",
    name: "Greek 6-Pin Euro Cylinder Mechanism",
    modelCode: "GK-EC-70",
    brand: "Greek",
    brandSlug: "greek",
    category: "Mortise Locks",
    categorySlug: "mortise",
    description:
      "Swiss-precision 6-pin tumbler mechanism encased in satin brushed architectural chrome with anti-bump spool pins.",
    material: "Solid Brass Extruded Cylinder",
    size: "70mm (35/35) Euro Profile",
    finish: "Brushed Chrome Satin",
    numberOfKeys: 3,
    lockingMechanism: "6-Pin Anti-Pick Tumbler Core",
    securityRating: "EN 1303 Security Grade 5",
    warranty: "5-Year Precision Warranty",
    image: "/products/greek-cylinder-lock.jpg",
    specs: [
      { icon: "gear", value: "Standard", label: "Backset" },
      { icon: "shield", value: "70mm", label: "Center" },
      { icon: "sparkles", value: "Brushed Ch.", label: "Finish" },
    ],
  },

  // ── Card 11: Raksham Armored Shackle Lock System (RK-AS-80) ──
  {
    id: "p-raksham-04",
    slug: "raksham-shackle-armored-series",
    name: "Raksham Armored Shackle Lock System",
    modelCode: "RK-AS-80",
    brand: "Raksham",
    brandSlug: "raksham",
    category: "Padlocks",
    categorySlug: "padlocks",
    description:
      "Fully shrouded armored padlock engineered with hooded boron shackle to nullify hydraulic bolt-cutters and pry-bars.",
    material: "Shielded Boron Alloy & Solid Steel",
    size: "80mm Shrouded Body",
    finish: "Matte Black Oxide Finish",
    numberOfKeys: 3,
    lockingMechanism: "Rotating Disc Anti-Drill Core",
    securityRating: "Grade 6 Maximum Defense",
    warranty: "10-Year Industrial Guarantee",
    image: "/products/raksham-shackle-lock.jpg",
    specs: [
      { icon: "lock", value: "80mm", label: "Body" },
      { icon: "link", value: "14mm", label: "Shackle" },
      { icon: "sparkles", value: "Oxide Black", label: "Finish" },
    ],
  },
];

/**
 * Category filter pills matching the exact order from reference photo
 */
const CATEGORIES = [
  { id: "all", label: "All Products", showCount: true },
  { id: "padlocks", label: "Padlocks" },
  { id: "mortise", label: "Mortise Locks" },
  { id: "cylindrical", label: "Knob / Cylindrical" },
  { id: "cabinet", label: "Cabinet Locks" },
  { id: "hasp", label: "Hasp & Staple" },
];

/**
 * Brand filter options (inside Filter dialog/tune button)
 */
const BRAND_OPTIONS = [
  { id: "all", label: "All Brands" },
  { id: "s-nafi", label: "S-Nafi (Artisanal Brass)" },
  { id: "greek", label: "Greek (Mortise & Cylinders)" },
  { id: "raksham", label: "Raksham (Fortress Armor)" },
];

/**
 * ============================================================================
 * Icon Renderer Helper
 * ============================================================================
 */
function SpecIcon({ type }: { type: ProductSpecItem["icon"] }) {
  switch (type) {
    case "lock":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "link":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "sparkles":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l2.4 5.2L20 9.6l-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-2.4z" />
        </svg>
      );
    case "gear":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
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
      );
    case "shield":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "key":
      return (
        <svg
          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7.5" cy="15.5" r="4.5" />
          <path d="m21 3-9.5 9.5" />
          <path d="m15.5 7.5 3 3" />
        </svg>
      );
  }
}

/**
 * ============================================================================
 * Component: ProductGrid
 * ============================================================================
 */
export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalProduct, setActiveModalProduct] = useState<CatalogProduct | null>(null);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Add to cart / quotation
  const handleAddToCart = (product: CatalogProduct) => {
    setCartItems((prev) => [...prev, product.id]);
    setToastMessage(`✓ Added "${product.name}" to quotation list`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // 1. Category matching
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;

      // 2. Brand matching
      const matchesBrand =
        selectedBrand === "all" || product.brandSlug === selectedBrand;

      // 3. Search query matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.modelCode.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.size.toLowerCase().includes(q) ||
        product.finish.toLowerCase().includes(q);

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  return (
    <div id="catalog" className="max-w-7xl mx-auto select-none">
      {/* ====================================================================
          1. TOP FILTER BAR (Exact match to reference photo)
          ==================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        {/* Left: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#A98048] text-white shadow-xs"
                    : "bg-white text-[#4A5568] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#1A202C]"
                }`}
              >
                <span>{cat.label}</span>
                {cat.showCount && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isSelected ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {CATALOG_PRODUCTS.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Search Input & Filter Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, model, size..."
              className="w-full text-xs sm:text-[13px] py-2 pl-9 pr-8 bg-white border border-[#E2E8F0] rounded-xl text-gray-800 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#A98048] shadow-2xs transition-colors"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8] pointer-events-none"
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
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter / Tune Button with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                showFilterMenu || selectedBrand !== "all"
                  ? "bg-[#A98048] text-white border-[#A98048]"
                  : "bg-white text-[#4A5568] border-[#E2E8F0] hover:bg-gray-50"
              }`}
              title="Filter by Brand & metallurgy"
            >
              {/* Sliders / Tune Icon */}
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterMenu && (
              <div className="absolute right-0 top-12 z-40 w-64 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-4 text-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-800">Filter by Brand</span>
                  {selectedBrand !== "all" && (
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className="text-[11px] text-[#A98048] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {BRAND_OPTIONS.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand.id);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        selectedBrand === brand.id
                          ? "bg-[#FAF7F2] font-semibold text-[#A98048]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{brand.label}</span>
                      {selectedBrand === brand.id && (
                        <span className="text-[#A98048]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. 3-COLUMN PRODUCT CARDS GRID (Exact match to reference photo)
          ==================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl p-8">
          <p className="font-serif text-lg text-gray-900 mb-2">No matching lock systems found</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Try adjusting your category selection, clearing the search query, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedBrand("all");
              setSearchQuery("");
            }}
            className="text-xs font-semibold px-5 py-2.5 bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredProducts.map((product) => {
            const isFav = favorites.has(product.id);

            return (
              <article
                key={product.id}
                className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* ── Top Visual Stage: Product Image with Floating Badges ── */}
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full bg-[#F5F5F3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center w-full h-full group-hover:scale-103 transition-transform duration-500 ease-out"
                    />

                    {/* Top-Left Floating Brand Pill */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2D2A26] border border-black/5 shadow-2xs">
                        {product.brand.toUpperCase()}
                      </span>
                    </div>

                    {/* Top-Right Circular Heart / Wishlist Button */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-black/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-105 transition-all shadow-2xs cursor-pointer"
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${
                          isFav ? "text-red-500 fill-red-500" : "text-gray-500 fill-none"
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* ── Card Content ── */}
                  <div className="p-5 sm:p-6 pb-2">
                    {/* Category Label + Model Code Row */}
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-sans font-semibold tracking-wider uppercase text-[#64748B]">
                        {product.category}
                      </span>
                      <span className="font-mono font-medium tracking-wider text-[#94A3B8]">
                        {product.modelCode}
                      </span>
                    </div>

                    {/* Product Title (Bold Serif) */}
                    <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#111827] leading-snug mb-2">
                      {product.name}
                    </h3>

                    {/* Description Excerpt */}
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 min-h-[36px]">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* ── Bottom Action Row: View Details & Add to Cart ── */}
                <div className="p-5 sm:p-6 pt-0 grid grid-cols-2 gap-3">
                  {/* View Details Button */}
                  <button
                    onClick={() => setActiveModalProduct(product)}
                    className="w-full py-2.5 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] text-xs sm:text-[13px] font-semibold hover:bg-gray-50 transition-colors text-center cursor-pointer shadow-2xs"
                  >
                    View Details
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {/* Shopping Cart Icon */}
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          3. FLOATING CART / QUOTATION PILL (When items added)
          ==================================================================== */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <Link
            href="/contact?type=bulk_quote"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0F172A] text-white shadow-xl hover:bg-black transition-all hover:scale-105 border border-white/10"
          >
            <div className="relative">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A98048] text-[9px] font-bold flex items-center justify-center">
                {cartItems.length}
              </span>
            </div>
            <span className="text-xs font-semibold">Request Bulk Quote</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F172A] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl border border-white/10 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          4. QUICK SPECS SLIDE-OVER / MODAL DIALOG
          ==================================================================== */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-divider"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-divider flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#F7F5F0] text-[#8C7A5B] font-bold border border-black/5">
                  {activeModalProduct.modelCode}
                </span>
                <span className="text-xs font-semibold text-muted">
                  {activeModalProduct.brand} • {activeModalProduct.category}
                </span>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="w-8 h-8 rounded-full bg-[#F7F5F0] hover:bg-[#EFECE3] flex items-center justify-center text-primary transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Visual & Identity */}
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden bg-[#F7F5F0] border border-divider shrink-0">
                  <Image
                    src={activeModalProduct.image}
                    alt={activeModalProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">
                    {activeModalProduct.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-3">
                    {activeModalProduct.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A98048]/10 text-[#A98048] text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A98048]" />
                    <span>{activeModalProduct.securityRating}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Engineering Specification Table */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8C7A5B] mb-3">
                  Technical & Metallurgical Specifications
                </h4>
                <div className="divide-y divide-divider border border-divider rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-muted font-medium">Core Material</span>
                    <span className="font-semibold text-primary">{activeModalProduct.material}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-muted font-medium">Dimension / Size</span>
                    <span className="font-semibold text-primary">{activeModalProduct.size}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-muted font-medium">Surface Finish</span>
                    <span className="font-semibold text-primary">{activeModalProduct.finish}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-muted font-medium">Locking Mechanism</span>
                    <span className="font-semibold text-primary">{activeModalProduct.lockingMechanism}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-muted font-medium">Number of Precision Keys</span>
                    <span className="font-semibold text-primary">{activeModalProduct.numberOfKeys} High-Security Keys</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-muted font-medium">Factory Warranty</span>
                    <span className="font-semibold text-primary">{activeModalProduct.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Add to Quote Cart</span>
                </button>
                <Link
                  href={`/contact?product=${encodeURIComponent(activeModalProduct.name)}`}
                  className="flex-1 py-3 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-gray-800 text-xs font-semibold text-center transition-colors"
                >
                  Direct Factory Inquiry →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

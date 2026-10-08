"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrderCart } from "./OrderCartProvider";
import { getProducts, Product, likeProduct, unlikeProduct } from "@/lib/api";
import { isUserLoggedIn } from "@/lib/userAuth";

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
 * Complete Hardware Product Catalog Dataset
 * ============================================================================
 */
export const CATALOG_PRODUCTS: CatalogProduct[] = [
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
 * Category filter pills configuration
 */
const CATEGORIES = [
  { id: "all", label: "All Locks" },
  { id: "padlocks", label: "Padlocks" },
  { id: "mortise", label: "Mortise Locks" },
  { id: "cylindrical", label: "Knob / Cylindrical" },
  { id: "cabinet", label: "Cabinet Locks" },
  { id: "hasp", label: "Hasp & Staple" },
];

/**
 * Brand filter options with metadata styling
 */
const BRAND_TABS = [
  { id: "all", label: "All Brands", dotColor: "bg-[#A98048]", tag: "Master Catalog" },
  { id: "s-nafi", label: "S-Nafi", dotColor: "bg-[#C49B55]", tag: "Solid Brass Artisanal" },
  { id: "greek", label: "Greek", dotColor: "bg-[#2563EB]", tag: "Euro Precision & Mortise" },
  { id: "raksham", label: "Raksham", dotColor: "bg-[#DC2626]", tag: "Case-Hardened Armor" },
];

export interface ProductGridProps {
  brandFilter?: string;
  categoryFilter?: string;
  excludeSlug?: string;
  limit?: number;
  hideFilters?: boolean;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  isDistributorContext?: boolean;
}

/**
 * ============================================================================
 * Component: ProductGrid (Luxury Architectural Hardware Catalog)
 * ============================================================================
 */
export default function ProductGrid({
  brandFilter,
  categoryFilter,
  excludeSlug,
  limit,
  hideFilters = false,
  showHeader,
  title,
  subtitle,
  badge,
  isDistributorContext = false,
}: ProductGridProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "all");
  const [selectedBrand, setSelectedBrand] = useState<string>(brandFilter || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "security" | "name-asc" | "model">("featured");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalProduct, setActiveModalProduct] = useState<CatalogProduct | null>(null);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  // Hydrate favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nafi_liked_product_ids");
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch live API products if available
  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setLiveProducts(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch live products in ProductGrid", err));
  }, []);

  const liveProductMap = useMemo(() => {
    const map = new Map<string, Product>();
    liveProducts.forEach((p) => {
      if (p.slug) map.set(p.slug, p);
    });
    return map;
  }, [liveProducts]);

  // Dynamic counts per brand
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: CATALOG_PRODUCTS.length,
      "s-nafi": 0,
      greek: 0,
      raksham: 0,
    };
    CATALOG_PRODUCTS.forEach((p) => {
      if (counts[p.brandSlug] !== undefined) {
        counts[p.brandSlug]++;
      }
    });
    return counts;
  }, []);

  // Dynamic counts per category based on active brand
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    CATEGORIES.forEach((c) => (counts[c.id] = 0));

    CATALOG_PRODUCTS.forEach((p) => {
      const activeB = brandFilter || selectedBrand;
      if (activeB === "all" || p.brandSlug === activeB) {
        counts.all = (counts.all || 0) + 1;
        counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [selectedBrand, brandFilter]);

  // Toggle favorite with persistence & API sync
  const toggleFavorite = async (product: CatalogProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = product.id;
    const isNowFav = !favorites.has(id);

    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("nafi_liked_product_ids", JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });

    if (isNowFav) {
      setToastMessage(`Saved ${product.name} to wishlist`);
    } else {
      setToastMessage(`Removed ${product.name} from wishlist`);
    }
    setTimeout(() => setToastMessage(null), 2500);

    // Sync with API if user is logged in
    if (isUserLoggedIn()) {
      const live = liveProductMap.get(product.slug);
      const apiId = live?.id || product.id;
      try {
        if (isNowFav) {
          await likeProduct(apiId);
        } else {
          await unlikeProduct(apiId);
        }
      } catch (err) {
        console.warn("Could not sync like to API", err);
      }
    }
  };

  // Add to order cart
  const handleAddToCart = (product: CatalogProduct) => {
    const live = liveProductMap.get(product.slug);
    const prodId = live?.id || product.id;
    const price = live?.dealerPrice ? Number(live.dealerPrice) : 450;
    const minQty = live?.minOrderQty || 1;

    if (cart) {
      cart.addItem({
        productId: prodId,
        name: product.name,
        modelCode: product.modelCode || product.size,
        image: product.image,
        unitPrice: price,
        minOrderQty: minQty,
        quantity: minQty,
      });
      setToastMessage(`✓ Added "${product.name}" to Order Cart`);
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      setToastMessage(`✓ Saved "${product.name}" to purchase inquiry`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let items = CATALOG_PRODUCTS.filter((product) => {
      if (excludeSlug && product.slug === excludeSlug) {
        return false;
      }

      const targetCat = categoryFilter || selectedCategory;
      const matchesCategory = targetCat === "all" || product.categorySlug === targetCat;

      const targetBrand = brandFilter || selectedBrand;
      const matchesBrand = targetBrand === "all" || product.brandSlug === targetBrand;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.modelCode.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.size.toLowerCase().includes(q) ||
        product.finish.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q);

      return matchesCategory && matchesBrand && matchesSearch;
    });

    // Sorting
    if (sortBy === "security") {
      const rank = (p: CatalogProduct) => {
        if (p.securityRating.includes("Grade 6")) return 6;
        if (p.securityRating.includes("Grade 5") || p.securityRating.includes("EN 1303")) return 5;
        if (p.securityRating.includes("Grade 1")) return 4;
        if (p.securityRating.includes("Grade A")) return 3;
        return 1;
      };
      items.sort((a, b) => rank(b) - rank(a));
    } else if (sortBy === "name-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "model") {
      items.sort((a, b) => a.modelCode.localeCompare(b.modelCode));
    }

    if (limit && limit > 0) {
      items = items.slice(0, limit);
    }

    return items;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy, brandFilter, categoryFilter, excludeSlug, limit]);

  const activeFiltersCount =
    (selectedBrand !== "all" && !brandFilter ? 1 : 0) +
    (selectedCategory !== "all" && !categoryFilter ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  const shouldShowHeader = showHeader ?? !hideFilters;

  return (
    <div id="catalog" className="max-w-7xl mx-auto select-none">
      {/* ====================================================================
          1. ELEGANT SECTION HEADER (Shown by default on catalog & listing pages)
          ==================================================================== */}
      {shouldShowHeader && (
        <div className="mb-10 sm:mb-14 text-center">
          {/* Eyebrow badge with golden micro-lines */}
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#A98048]" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#A98048] font-bold">
              {badge || "ALIGARH FOUNDRY CRAFTSMANSHIP • EST. 1995"}
            </span>
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#A98048]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight mb-3">
            {title || "Architectural Lock Systems"}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#78716C] max-w-2xl mx-auto leading-relaxed">
            {subtitle ||
              "Precision-forged solid brass padlocks, commercial mortise sets, and armored lock systems built for generations of security."}
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] font-mono text-[#78716C]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-[#1C1917] font-semibold">{filteredProducts.length}</strong> Models Available
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A98048]" />
              Direct Foundry Dispatch
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================
          2. DUAL-TIER FILTERING SYSTEM (Brand Switcher + Categories + Search)
          ==================================================================== */}
      {!hideFilters && (
        <div className="space-y-4 mb-8 sm:mb-10">
          {/* ── Tier 1: Flagship Brand Switcher Tabs ── */}
          {!brandFilter && (
            <div className="bg-[#F6F5F1] p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-[#E6E3DB] flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none shadow-xs">
              {BRAND_TABS.map((tab) => {
                const isSelected = selectedBrand === tab.id;
                const count = brandCounts[tab.id] ?? 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedBrand(tab.id)}
                    className={`flex-1 min-w-[140px] sm:min-w-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-full text-xs font-serif font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1917] text-white shadow-md scale-[1.01]"
                        : "text-[#57534E] hover:text-[#1C1917] hover:bg-white/60"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${tab.dotColor}`} />
                    <span className="truncate">{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#78716C]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Tier 2: Category Pills + Search Box + Sort ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs font-medium px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#A98048] text-white font-semibold shadow-xs"
                        : "bg-white text-[#57534E] border border-[#E7E5E0] hover:border-[#C49B55] hover:text-[#1C1917]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/25 text-white" : "bg-[#F5F4F0] text-[#78716C]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search Input + Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model, brass, size..."
                  className="w-full text-xs py-2 pl-9 pr-8 bg-white border border-[#E7E5E0] rounded-xl text-gray-800 placeholder:text-[#A8A29E] focus:outline-none focus:border-[#A98048] focus:ring-1 focus:ring-[#A98048]/30 shadow-2xs transition-all"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-[#A8A29E] pointer-events-none"
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

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort product catalog"
                  className="text-xs py-2 pl-3 pr-8 bg-white border border-[#E7E5E0] rounded-xl text-[#44403C] font-medium appearance-none focus:outline-none focus:border-[#A98048] shadow-2xs cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="security">Security Rating</option>
                  <option value="name-asc">Name (A – Z)</option>
                  <option value="model">Model Code</option>
                </select>
                <svg
                  className="absolute right-2.5 top-3 w-3 h-3 text-[#78716C] pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#ECEAE4] text-xs">
              <span className="text-[11px] font-mono text-[#78716C] uppercase tracking-wider">Active:</span>

              {selectedBrand !== "all" && !brandFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0] text-[#1C1917]">
                  <span>Brand: {BRAND_TABS.find((t) => t.id === selectedBrand)?.label}</span>
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className="text-[#78716C] hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedCategory !== "all" && !categoryFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0] text-[#1C1917]">
                  <span>Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="text-[#78716C] hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0] text-[#1C1917]">
                  <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#78716C] hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedBrand("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-[11px] font-semibold text-[#A98048] hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          3. LUXURY PRODUCT CARDS GRID
          ==================================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E5E0] rounded-3xl p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E0] text-[#A98048] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="font-serif text-xl font-bold text-[#1C1917] mb-2">No matching lock systems found</p>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-5 leading-relaxed">
            We couldn&apos;t find any products matching your active criteria. Try clearing search keywords or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedBrand("all");
              setSearchQuery("");
            }}
            className="text-xs font-serif font-bold px-5 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-[#A98048] transition-colors cursor-pointer shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
          {filteredProducts.map((product) => {
            const isFav = favorites.has(product.id);
            const live = liveProductMap.get(product.slug);
            const isDistributor = isDistributorContext || live?.dealerPrice !== undefined;

            // Brand style tokens
            const brandBadgeClass =
              product.brandSlug === "s-nafi"
                ? "bg-[#FAF7F0] text-[#9A7228] border-[#9A7228]/25"
                : product.brandSlug === "greek"
                ? "bg-[#F0F5FA] text-[#1E4E79] border-[#1E4E79]/25"
                : "bg-[#FAF0F0] text-[#8A2518] border-[#8A2518]/25";

            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E5E0] hover:border-[#C49B55]/70 transition-all duration-300 hover:shadow-[0_22px_45px_-15px_rgba(169,128,72,0.18)] flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* ── Top Visual Stage: Product Photography ── */}
                  <div className="relative aspect-[4/3] sm:aspect-square bg-gradient-to-b from-[#FBFBFA] via-[#F4F3EE] to-[#EAE8E1] p-4 sm:p-6 flex items-center justify-center overflow-hidden border-b border-[#ECEAE4]">
                    {/* Floating Brand Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`text-[9.5px] sm:text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${brandBadgeClass}`}
                      >
                        {product.brand}
                      </span>
                    </div>

                    {/* Floating Security Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#1C1917]/80 backdrop-blur-md text-white/95 border border-white/10 flex items-center gap-1.5 shadow-2xs">
                        <svg className="w-3 h-3 text-[#C49B55]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>{product.securityRating.split(" ")[0]} {product.securityRating.split(" ")[1] || ""}</span>
                      </span>
                    </div>

                    {/* Top-Right Heart / Wishlist Button */}
                    <button
                      onClick={(e) => toggleFavorite(product, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#E7E5E0] flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-105 transition-all shadow-2xs cursor-pointer"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-colors ${
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

                    {/* Quick Specs trigger overlay on hover */}
                    <button
                      type="button"
                      onClick={() => setActiveModalProduct(product)}
                      className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#1C1917] text-[10.5px] font-serif font-bold shadow-md border border-[#E7E5E0] hover:bg-[#1C1917] hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      </svg>
                      <span>Quick Specs</span>
                    </button>

                    {/* Centered Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  {/* ── Card Content ── */}
                  <div className="p-4 sm:p-5">
                    {/* Category Label + Model Code Row */}
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1.5">
                      <span className="font-mono font-semibold tracking-wider uppercase text-[#78716C] truncate mr-2">
                        {product.category}
                      </span>
                      <span className="font-mono font-bold text-[#A98048] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EFECE6] shrink-0">
                        {product.modelCode}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-serif text-[16px] sm:text-[18px] font-bold text-[#1C1917] group-hover:text-[#A98048] transition-colors leading-snug line-clamp-2 min-h-[44px] sm:min-h-[48px] mb-2">
                      <Link href={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>

                    {/* Metallurgy & Mechanism summary line */}
                    <p className="text-[11.5px] text-[#78716C] line-clamp-1 mb-3">
                      {product.material} · {product.lockingMechanism}
                    </p>

                    {/* 3 Micro-Specs Engineering Pills */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F2EFE9] text-center mb-3">
                      {product.specs.map((sp, idx) => (
                        <div key={idx} className="bg-[#FAF9F6] border border-[#EFECE6] rounded-lg py-1 px-1">
                          <span className="text-[9px] font-mono text-[#A8A29E] uppercase block leading-none mb-0.5">
                            {sp.label}
                          </span>
                          <span className="text-[10.5px] font-mono font-bold text-[#292524] truncate block">
                            {sp.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing / Direct Factory Strip */}
                    {live?.dealerPrice || isDistributor ? (
                      <div className="flex items-center justify-between pt-2.5 border-t border-[#F2EFE9]">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#78716C] block leading-none mb-0.5">
                            DEALER PRICE
                          </span>
                          <span className="font-serif text-base sm:text-lg font-bold text-[#A98048]">
                            ₹{Number(live?.dealerPrice || 450).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#78716C] block leading-none mb-0.5">
                            MIN. BATCH
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#1C1917]">
                            {live?.minOrderQty || 1} pcs
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2.5 border-t border-[#F2EFE9] text-[11px] font-mono">
                        <span className="text-[#78716C]">Tier-1 Margins</span>
                        <span className="text-[#A98048] font-bold">Factory Wholesale</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Bottom Action Row: View Details & Add to Order ── */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2 sm:gap-2.5">
                  {/* View Details Button */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E7E5E0] bg-white hover:bg-[#FAF8F5] hover:border-[#A98048]/60 text-[#1C1917] text-xs font-serif font-bold transition-all text-center cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>View Specs</span>
                    <span className="text-[#A98048] transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>

                  {/* Add to Order Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#1C1917] hover:bg-[#A98048] text-white text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          4. FLOATING ORDER CART DRAWER TRIGGER
          ==================================================================== */}
      {cart && cart.itemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            type="button"
            onClick={cart.openDrawer}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#1C1917] text-white shadow-2xl hover:bg-[#A98048] transition-all hover:scale-105 border border-white/10 cursor-pointer"
          >
            <div className="relative">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-[#A98048] text-[9px] font-bold flex items-center justify-center text-white">
                {cart.itemCount}
              </span>
            </div>
            <span className="text-xs font-serif font-bold">Review Order Cart</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917]/95 backdrop-blur-md text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl border border-white/10 animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#C49B55]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          5. QUICK SPECS SLIDE-OVER / MODAL DIALOG
          ==================================================================== */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E5E0]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#ECEAE4] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#A98048] font-bold border border-[#EFECE6]">
                  {activeModalProduct.modelCode}
                </span>
                <span className="text-xs font-serif font-semibold text-[#78716C]">
                  {activeModalProduct.brand} • {activeModalProduct.category}
                </span>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#1C1917] transition-colors cursor-pointer text-sm font-bold"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Product Visual & Identity */}
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-[#EAE8E1] border border-[#E7E5E0] shrink-0 p-4 flex items-center justify-center">
                  <Image
                    src={activeModalProduct.image}
                    alt={activeModalProduct.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mb-2 leading-snug">
                    {activeModalProduct.name}
                  </h3>
                  <p className="text-xs text-[#78716C] leading-relaxed mb-3">
                    {activeModalProduct.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E0] text-[11px] font-mono text-[#A98048] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A98048]" />
                    <span>{activeModalProduct.securityRating}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Engineering Specification Table */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-[#A98048] mb-3">
                  Technical & Metallurgical Specifications
                </h4>
                <div className="divide-y divide-[#ECEAE4] border border-[#ECEAE4] rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-[#78716C] font-medium">Core Material</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.material}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-[#78716C] font-medium">Dimension / Size</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.size}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-[#78716C] font-medium">Surface Finish</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.finish}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-[#78716C] font-medium">Locking Mechanism</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.lockingMechanism}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-[#FAF9F5]">
                    <span className="text-[#78716C] font-medium">Number of Keys</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.numberOfKeys} High-Security Keys</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-[#78716C] font-medium">Factory Warranty</span>
                    <span className="font-semibold text-[#1C1917]">{activeModalProduct.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-[#1C1917] hover:bg-[#A98048] text-white text-xs font-serif font-bold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Add to Order Cart</span>
                </button>
                <Link
                  href={`/products/${activeModalProduct.slug}`}
                  onClick={() => setActiveModalProduct(null)}
                  className="w-full sm:flex-1 py-3 rounded-xl border border-[#E7E5E0] hover:bg-[#FAF8F5] hover:border-[#A98048] text-[#1C1917] text-xs font-serif font-bold text-center transition-colors"
                >
                  Full Specification Page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

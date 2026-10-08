"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getProducts, getLikedProducts, Product } from "@/lib/api";
import { isUserLoggedIn } from "@/lib/userAuth";
import ProductCard from "./ProductCard";
import { useOrderCart } from "./OrderCartProvider";

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

const BRAND_TABS = [
  { id: "all", label: "All Brands", dotColor: "bg-[#A98048]" },
  { id: "s-nafi", label: "S-Nafi", dotColor: "bg-[#9A7228]" },
  { id: "greek", label: "Greek", dotColor: "bg-[#235F8E]" },
  { id: "raksham", label: "Raksham", dotColor: "bg-[#9A2F24]" },
];

/**
 * ============================================================================
 * Component: ProductGrid
 * ============================================================================
 * Follows Spec 11:
 * - Fetches exclusively from GET /api/products (no hardcoded catalog or fallbacks)
 * - Renders ProductCard component (2 cards per row on mobile, 3 on desktop)
 * - Loading skeleton, empty state, and error state with retry button
 * - Apple/Google minimal design system & buttery smooth micro-animations
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string>(brandFilter || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "name-asc" | "name-desc">("featured");

  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  // 1. Fetch live products from backend API (Doc 11 Section 5.1)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load products from API", err);
      setError(err?.message || "Failed to connect to lock registry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Hydrate user liked products (Doc 11 Section 3.4)
  useEffect(() => {
    if (isUserLoggedIn()) {
      getLikedProducts()
        .then((liked) => {
          if (Array.isArray(liked)) {
            setLikedIds(new Set(liked.map((p) => p.id)));
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLikeToggle = (productId: string, isNowLiked: boolean) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isNowLiked) next.add(productId);
      else next.delete(productId);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 3. Extract unique categories from live products
  const availableCategories = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    map.set("all", { id: "all", label: "All Locks" });

    products.forEach((p) => {
      if (p.category?.slug && p.category?.name) {
        map.set(p.category.slug, {
          id: p.category.slug,
          label: p.category.name,
        });
      }
    });

    return Array.from(map.values());
  }, [products]);

  // Dynamic counts per brand
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
      "s-nafi": 0,
      greek: 0,
      raksham: 0,
    };
    products.forEach((p) => {
      const bSlug = p.brand?.slug;
      if (bSlug && counts[bSlug] !== undefined) {
        counts[bSlug]++;
      }
    });
    return counts;
  }, [products]);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    availableCategories.forEach((c) => (counts[c.id] = 0));

    products.forEach((p) => {
      const activeBrand = brandFilter || selectedBrand;
      if (activeBrand === "all" || p.brand?.slug === activeBrand) {
        counts.all = (counts.all || 0) + 1;
        const cSlug = p.category?.slug;
        if (cSlug) {
          counts[cSlug] = (counts[cSlug] || 0) + 1;
        }
      }
    });

    return counts;
  }, [products, availableCategories, selectedBrand, brandFilter]);

  // 4. Filter and sort products
  const filteredProducts = useMemo(() => {
    let items = products.filter((p) => {
      if (excludeSlug && p.slug === excludeSlug) {
        return false;
      }

      // Brand filter
      const targetBrand = brandFilter || selectedBrand;
      if (targetBrand !== "all" && p.brand?.slug !== targetBrand) {
        return false;
      }

      // Category filter
      const targetCat = categoryFilter || selectedCategory;
      if (targetCat !== "all" && p.category?.slug !== targetCat) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          p.name.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.size && p.size.toLowerCase().includes(q)) ||
          (p.finish && p.finish.toLowerCase().includes(q)) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "name-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (limit && limit > 0) {
      items = items.slice(0, limit);
    }

    return items;
  }, [products, selectedBrand, selectedCategory, searchQuery, sortBy, brandFilter, categoryFilter, excludeSlug, limit]);

  const shouldShowHeader = showHeader ?? !hideFilters;

  return (
    <div id="catalog" className="max-w-7xl mx-auto select-none">
      {/* ── 1. Minimal Header (Optional) ── */}
      {shouldShowHeader && (
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="w-5 h-px bg-[#A98048]" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#A98048] font-bold">
              {badge || "PRECISION ARCHITECTURAL HARDWARE"}
            </span>
            <span className="w-5 h-px bg-[#A98048]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {title || "Architectural Lock Systems"}
          </h2>

          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            {subtitle ||
              "Engineered with pure forged solid brass, case-hardened steel, and precision pin tumblers."}
          </p>
        </div>
      )}

      {/* ── 2. Minimal Filtering Controls (Apple/Google Style) ── */}
      {!hideFilters && (
        <div className="space-y-3.5 mb-6 sm:mb-8">
          {/* Brand Switcher Segmented Track */}
          {!brandFilter && (
            <div className="bg-[#F4F3EE] p-1 rounded-2xl sm:rounded-full border border-black/[0.05] flex items-center gap-1 overflow-x-auto scrollbar-none shadow-2xs">
              {BRAND_TABS.map((tab) => {
                const isSelected = selectedBrand === tab.id;
                const count = brandCounts[tab.id] ?? 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedBrand(tab.id)}
                    className={`flex-1 min-w-[120px] sm:min-w-0 py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-full text-xs font-serif font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1917] text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${tab.dotColor}`} />
                    <span className="truncate">{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Filter Pills & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#A98048] text-white font-semibold shadow-2xs"
                        : "bg-white text-gray-600 border border-black/[0.08] hover:border-black/20 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/25 text-white" : "bg-black/5 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search Box & Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locks, brass, size..."
                  className="w-full text-xs py-1.5 pl-8 pr-7 bg-white border border-black/[0.08] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A98048] shadow-2xs transition-colors"
                />
                <svg
                  className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort product catalog"
                className="text-xs py-1.5 pl-2.5 pr-6 bg-white border border-black/[0.08] rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:border-[#A98048] shadow-2xs cursor-pointer shrink-0"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name (A – Z)</option>
                <option value="name-desc">Name (Z – A)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Loading Skeleton State (Apple Shimmer Cards) ── */}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] overflow-hidden p-3 sm:p-4 flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div className="aspect-square w-full bg-stone-100 rounded-xl" />
              <div className="space-y-2 py-2 flex flex-col items-center">
                <div className="h-4 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-8 bg-stone-100 rounded-lg" />
                <div className="h-8 bg-stone-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 4. Error State with Retry Button (Never fallback to fake catalog) ── */}
      {!isLoading && error && (
        <div className="text-center py-16 bg-white rounded-3xl border border-red-100 p-8 shadow-xs max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
            Unable to Load Catalog
          </h3>
          <p className="text-xs text-muted leading-relaxed mb-5">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchProducts}
            className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-serif font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* ── 5. Empty State ── */}
      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-black/[0.06] p-8 shadow-2xs max-w-md mx-auto">
          <p className="font-serif text-lg font-bold text-gray-900 mb-1">No products found</p>
          <p className="text-xs text-muted mb-4">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedBrand("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-serif font-semibold px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── 6. Live Product Grid (2 Cards per row on Mobile!) ── */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedIds.has(product.id)}
              onLikeToggle={handleLikeToggle}
              isDistributorContext={isDistributorContext}
              onToast={showToast}
            />
          ))}
        </div>
      )}

      {/* Floating Cart Trigger */}
      {cart && cart.itemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            type="button"
            onClick={cart.openDrawer}
            className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#1C1917] text-white shadow-2xl hover:bg-black transition-all hover:scale-105 border border-white/10 cursor-pointer"
          >
            <div className="relative">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-accent text-[9px] font-bold flex items-center justify-center text-white">
                {cart.itemCount}
              </span>
            </div>
            <span className="text-xs font-serif font-bold">Review Cart</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917]/95 backdrop-blur-md text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

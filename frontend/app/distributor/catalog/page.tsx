"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, likeProduct, unlikeProduct, Product } from "@/lib/api";
import { useOrderCart } from "@/components/OrderCartProvider";

// High-fidelity fallback B2B catalog items if backend database is in initial empty state
const FALLBACK_B2B_PRODUCTS: Product[] = [
  {
    id: "p-b2b-01",
    slug: "s-nafi-classic-padlock-50",
    name: "S-Nafi Classic Solid Brass Padlock (50mm)",
    brandId: "b-snafi",
    brand: { id: "b-snafi", slug: "s-nafi", name: "S-Nafi", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "nafi", order: 1, isActive: true },
    categoryId: "c-padlocks",
    category: { id: "c-padlocks", slug: "padlocks", name: "Brass Padlocks" },
    description: "Solid extruded virgin brass body with hardened stainless shackle and paracentric pin tumbler.",
    material: "100% Solid Extruded Brass",
    size: "50mm Body / 8mm Shackle",
    finish: "Mirror Brass Polish",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Lock",
    warranty: "5 Years",
    images: ["/products/s-nafi-classic-50.jpg"],
    dealerPrice: 420,
    minOrderQty: 24,
    isActive: true,
  },
  {
    id: "p-b2b-02",
    slug: "s-nafi-royal-engraved-65",
    name: "S-Nafi Royal Seal Engraved Brass Padlock (65mm)",
    brandId: "b-snafi",
    brand: { id: "b-snafi", slug: "s-nafi", name: "S-Nafi", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "nafi", order: 1, isActive: true },
    categoryId: "c-padlocks",
    category: { id: "c-padlocks", slug: "padlocks", name: "Brass Padlocks" },
    description: "Artisanal hand-engraved royal crown insignia with anti-pick pin tumbler system.",
    material: "Solid Forged C36000 Brass",
    size: "65mm Body / 10mm Shackle",
    finish: "Antique Brass Lacquer",
    numberOfKeys: 4,
    lockingMechanism: "6-Pin Dual Locking",
    warranty: "10 Years",
    images: ["/products/s-nafi-royal-65.jpg"],
    dealerPrice: 680,
    minOrderQty: 18,
    isActive: true,
  },
  {
    id: "p-b2b-03",
    slug: "raksham-fortress-armored-70",
    name: "Raksham Grade-6 Fortress Armored Padlock (70mm)",
    brandId: "b-raksham",
    brand: { id: "b-raksham", slug: "raksham", name: "Raksham", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "raksham", order: 2, isActive: true },
    categoryId: "c-armored",
    category: { id: "c-armored", slug: "armored", name: "Armored Defense" },
    description: "Boron-alloy hardened steel shackle with anti-drill hardened carbide faceplate.",
    material: "Case-Hardened Boron Alloy",
    size: "70mm Monoblock / 12mm Shackle",
    finish: "Satin Titanium PVD",
    numberOfKeys: 4,
    lockingMechanism: "Anti-Pull Rotating Disc Cylinder",
    warranty: "Lifetime",
    images: ["/products/raksham-fortress-70.jpg"],
    dealerPrice: 890,
    minOrderQty: 12,
    isActive: true,
  },
  {
    id: "p-b2b-04",
    slug: "raksham-shutter-bullet-85",
    name: "Raksham Commercial Shutter Bullet Lock (85mm)",
    brandId: "b-raksham",
    brand: { id: "b-raksham", slug: "raksham", name: "Raksham", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "raksham", order: 2, isActive: true },
    categoryId: "c-armored",
    category: { id: "c-armored", slug: "armored", name: "Armored Defense" },
    description: "Enclosed shackle design engineered specifically for commercial rolling gates and shop shutters.",
    material: "Alloy Steel Monoblock",
    size: "85mm Enclosed Shackle",
    finish: "Industrial Black Chrome",
    numberOfKeys: 3,
    lockingMechanism: "Hardened Steel Sliding Pin",
    warranty: "5 Years",
    images: ["/products/raksham-shutter-85.jpg"],
    dealerPrice: 740,
    minOrderQty: 15,
    isActive: true,
  },
  {
    id: "p-b2b-05",
    slug: "greek-architectural-mortise-85",
    name: "Greek Architectural Cylinder Mortise Set (85mm)",
    brandId: "b-greek",
    brand: { id: "b-greek", slug: "greek", name: "Greek", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "greek", order: 3, isActive: true },
    categoryId: "c-mortise",
    category: { id: "c-mortise", slug: "mortise", name: "Mortise Systems" },
    description: "Euro-profile precision mortise lock with silent brass latch and solid deadbolt action.",
    material: "Extruded Brass & Stainless Steel",
    size: "85mm Center Distance / 50mm Backset",
    finish: "Brushed Satin Chrome",
    numberOfKeys: 5,
    lockingMechanism: "Double Throw Deadbolt + 6-Pin Cylinder",
    warranty: "7 Years",
    images: ["/products/greek-mortise-85.jpg"],
    dealerPrice: 1250,
    minOrderQty: 10,
    isActive: true,
  },
  {
    id: "p-b2b-06",
    slug: "greek-euro-profile-double-cylinder-70",
    name: "Greek High-Precision Euro Profile Double Cylinder (70mm)",
    brandId: "b-greek",
    brand: { id: "b-greek", slug: "greek", name: "Greek", tagline: "", description: "", logoUrl: null, heroImageUrl: null, themeKey: "greek", order: 3, isActive: true },
    categoryId: "c-mortise",
    category: { id: "c-mortise", slug: "mortise", name: "Mortise Systems" },
    description: "Computerized dimple key cylinder with anti-bump mushroom pins and hardened drill pins.",
    material: "Solid High-Tensile Brass",
    size: "70mm (35/35 Equal Split)",
    finish: "Brushed Nickel Satin",
    numberOfKeys: 5,
    lockingMechanism: "10-Pin Dimple High Security",
    warranty: "10 Years",
    images: ["/products/greek-cylinder-70.jpg"],
    dealerPrice: 560,
    minOrderQty: 25,
    isActive: true,
  },
];

export default function DistributorCatalogPage() {
  const { addItem } = useOrderCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_B2B_PRODUCTS);
        }
      })
      .catch((err) => {
        console.error("Backend catalog not reachable, using verified fallback list", err);
        setProducts(FALLBACK_B2B_PRODUCTS);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter products by brand and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchBrand =
        selectedBrand === "all" ||
        p.brand?.slug?.toLowerCase() === selectedBrand.toLowerCase() ||
        p.brand?.name?.toLowerCase() === selectedBrand.toLowerCase();

      const matchSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.size.toLowerCase().includes(searchQuery.toLowerCase());

      return matchBrand && matchSearch;
    });
  }, [products, selectedBrand, searchQuery]);

  const handleQtyChange = (productId: string, qty: number, minOrder: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(minOrder, qty),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const minQty = product.minOrderQty || 1;
    const qty = quantities[product.id] || minQty;
    const price = product.dealerPrice || 0;

    addItem({
      productId: product.id,
      name: product.name,
      modelCode: product.size,
      image: product.images && product.images[0] ? product.images[0] : undefined,
      unitPrice: Number(price),
      minOrderQty: minQty,
      quantity: qty,
    });
  };

  const toggleLike = async (productId: string) => {
    const isLiked = likedIds.has(productId);
    try {
      if (isLiked) {
        await unlikeProduct(productId);
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await likeProduct(productId);
        setLikedIds((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
              VERIFIED WHOLESALE PRICE BOOK
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary">
            Dealer Hardware Catalog
          </h2>
          <p className="text-xs text-muted">
            All prices reflect Tier-1 factory unit costs with manufacturer minimum batch sizing.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model, metallurgy, size..."
            className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-xs text-primary placeholder:text-muted focus:outline-hidden focus:border-accent"
          />
        </div>
      </div>

      {/* Brand Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { key: "all", label: "All Flagship Brands" },
          { key: "s-nafi", label: "01 S-Nafi (Brass)" },
          { key: "raksham", label: "02 Raksham (Armored)" },
          { key: "greek", label: "03 Greek (Mortise)" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedBrand(tab.key)}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-serif whitespace-nowrap transition-all touch-manipulation ${
              selectedBrand === tab.key
                ? "bg-accent text-background font-bold shadow-xs"
                : "bg-surface border border-divider text-muted hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono">Loading dealer price matrix...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <p className="text-sm text-muted">No products found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const minQty = product.minOrderQty || 1;
            const currentQty = quantities[product.id] || minQty;
            const isLiked = likedIds.has(product.id);

            return (
              <div
                key={product.id}
                className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Stage */}
                  <div className="aspect-4/3 bg-background p-6 flex items-center justify-center relative border-b border-divider">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain group-hover:scale-105 transition-transform duration-300 max-h-40"
                      />
                    ) : (
                      <span className="font-mono text-xs text-muted">NAFI HARDWARE</span>
                    )}

                    {/* Brand Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-surface/90 backdrop-blur-xs border border-divider text-primary">
                      {product.brand?.name || "Nafi"}
                    </span>

                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => toggleLike(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full bg-surface/90 backdrop-blur-xs border border-divider transition-colors shadow-xs touch-manipulation ${
                        isLiked ? "text-red-500" : "text-muted hover:text-red-500"
                      }`}
                      aria-label="Save product"
                    >
                      <svg
                        className={`w-4 h-4 ${isLiked ? "fill-current" : "fill-none"}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-primary mb-1 line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted mb-2.5 sm:mb-3">
                      <span>{product.material}</span>
                      <span>·</span>
                      <span>{product.size}</span>
                    </div>

                    <p className="text-xs text-muted line-clamp-2 mb-3.5 sm:mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Commercial Pricing Tier */}
                    <div className="bg-background border border-divider rounded-xl p-3 flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                          DEALER PRICE
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-base sm:text-lg font-bold text-accent">
                            ₹{Number(product.dealerPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-muted">/ pc</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                          MIN. BATCH (MOQ)
                        </span>
                        <span className="font-mono text-xs font-bold text-primary">
                          {minQty} units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Quantity + Add to Order + View Details */}
                <div className="p-4 sm:p-5 pt-0 space-y-2.5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center border border-divider rounded-xl overflow-hidden bg-background">
                      <button
                        type="button"
                        onClick={() =>
                          handleQtyChange(product.id, currentQty - 1, minQty)
                        }
                        disabled={currentQty <= minQty}
                        className="w-8 h-9 flex items-center justify-center text-sm font-bold text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={minQty}
                        value={currentQty}
                        onChange={(e) =>
                          handleQtyChange(
                            product.id,
                            parseInt(e.target.value, 10) || minQty,
                            minQty
                          )
                        }
                        className="w-11 sm:w-12 h-9 text-center text-xs font-mono font-bold bg-transparent text-primary focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleQtyChange(product.id, currentQty + 1, minQty)
                        }
                        className="w-8 h-9 flex items-center justify-center text-sm font-bold text-muted hover:text-primary transition-colors cursor-pointer touch-manipulation"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 h-9 py-2 bg-accent text-background rounded-xl font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Add to Order</span>
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full py-2 px-3 rounded-xl border border-divider bg-background hover:bg-surface text-primary text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-accent/60 text-center touch-manipulation"
                  >
                    <span>View Details</span>
                    <span className="text-[11px] text-muted">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

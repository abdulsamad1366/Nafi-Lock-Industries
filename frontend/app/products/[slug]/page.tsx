"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getLikedProducts, likeProduct, unlikeProduct, Product } from "@/lib/api";
import { isUserLoggedIn } from "@/lib/userAuth";
import ThemeProvider from "@/components/ThemeProvider";
import ProductGallery, { getCategoryPlaceholder } from "@/components/ProductGallery";
import ProductSpecTable from "@/components/ProductSpecTable";
import ProductGrid, { CatalogProduct } from "@/components/ProductGrid";
import { OrderCartProvider, useOrderCart } from "@/components/OrderCartProvider";
import OrderCartDrawer from "@/components/OrderCartDrawer";

// Local catalog fallback for offline / development resilience
const LOCAL_CATALOG_FALLBACK: Record<string, Partial<Product>> = {
  "s-nafi-classic-padlock-50": {
    id: "p-snafi-01",
    slug: "s-nafi-classic-padlock-50",
    name: "S-Nafi Classic Solid Brass Padlock",
    brand: { id: "b-snafi", slug: "s-nafi", name: "S-Nafi", tagline: "Premium brass craftsmanship", description: "", logoUrl: null, heroImageUrl: null, themeKey: "nafi", order: 1, isActive: true },
    brandId: "b-snafi",
    category: { id: "c-padlocks", slug: "padlocks", name: "Padlocks" },
    categoryId: "c-padlocks",
    description: "Hand-finished 50mm solid brass body with hardened stainless steel shackle and single-bolt precision tumblers. Built to withstand environmental weathering and maximum physical forced entry.",
    material: "100% Solid Forged Brass",
    size: "50mm Body / 8mm Shackle",
    finish: "Mirror Polish Brass",
    numberOfKeys: 3,
    lockingMechanism: "Single Bolt Precision Tumbler",
    warranty: "Lifetime Heritage Warranty",
    images: ["/products/s-nafi-classic-50.jpg", "/placeholders/padlock.svg"],
    dealerPrice: 420,
    minOrderQty: 24,
    isActive: true,
  },
  "s-nafi-classic-padlock-65": {
    id: "p-snafi-02",
    slug: "s-nafi-classic-padlock-65",
    name: "S-Nafi Dual-Action Padlock 65",
    brand: { id: "b-snafi", slug: "s-nafi", name: "S-Nafi", tagline: "Premium brass craftsmanship", description: "", logoUrl: null, heroImageUrl: null, themeKey: "nafi", order: 1, isActive: true },
    brandId: "b-snafi",
    category: { id: "c-padlocks", slug: "padlocks", name: "Padlocks" },
    categoryId: "c-padlocks",
    description: "Heavy 65mm brass padlock with double-bolt deadlocking action and dual ball-bearing locking lugs for estate gates and industrial facilities.",
    material: "Solid Brass & Hardened Steel",
    size: "65mm Body / 11mm Shackle",
    finish: "Dual Chrome & Brass Polish",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Bolt",
    warranty: "10-Year Mechanical Warranty",
    images: ["/products/s-nafi-classic-65.jpg", "/placeholders/padlock.svg"],
    dealerPrice: 580,
    minOrderQty: 20,
    isActive: true,
  },
  "s-nafi-mortise-lock-set": {
    id: "p-snafi-03",
    slug: "s-nafi-mortise-lock-set",
    name: "S-Nafi Architectural Mortise Set",
    brand: { id: "b-snafi", slug: "s-nafi", name: "S-Nafi", tagline: "Premium brass craftsmanship", description: "", logoUrl: null, heroImageUrl: null, themeKey: "nafi", order: 1, isActive: true },
    brandId: "b-snafi",
    category: { id: "c-mortise", slug: "door-locks-mortise", name: "Door Locks (Mortise)" },
    categoryId: "c-mortise",
    description: "Premium architectural stainless steel & brass mortise chassis with dual-action throw deadbolt and silent operation latch.",
    material: "Solid Brass Forend & Stainless Steel",
    size: "Standard 85mm Center",
    finish: "Satin Nickel & Brushed Brass",
    numberOfKeys: 3,
    lockingMechanism: "Dual-Throw Deadbolt Mechanism",
    warranty: "5-Year Factory Warranty",
    images: ["/products/s-nafi-mortise-set.jpg", "/placeholders/mortise-lock.svg"],
    dealerPrice: 720,
    minOrderQty: 10,
    isActive: true,
  },
  "greek-heritage-padlock-40": {
    id: "p-greek-01",
    slug: "greek-heritage-padlock-40",
    name: "Greek Classical Iron Padlock 40",
    brand: { id: "b-greek", slug: "greek", name: "Greek", tagline: "Classical strength, modern security", description: "", logoUrl: null, heroImageUrl: null, themeKey: "greek", order: 2, isActive: true },
    brandId: "b-greek",
    category: { id: "c-padlocks", slug: "padlocks", name: "Padlocks" },
    categoryId: "c-padlocks",
    description: "Classical cast iron padlock body with baked black enamel coat and anti-drill warding plate for rugged perimeter durability.",
    material: "Cast Iron Body & Steel Shackle",
    size: "40mm Body / 7mm Shackle",
    finish: "Matte Black Weatherproof Coat",
    numberOfKeys: 2,
    lockingMechanism: "Single Bolt Steel Tumbler",
    warranty: "2-Year Manufacturer Warranty",
    images: ["/products/greek-heritage-40.jpg", "/placeholders/greek-padlock.svg"],
    dealerPrice: 280,
    minOrderQty: 30,
    isActive: true,
  },
  "raksham-guard-padlock-50": {
    id: "p-raksham-01",
    slug: "raksham-guard-padlock-50",
    name: "Raksham Fortress Guard Padlock 50",
    brand: { id: "b-raksham", slug: "raksham", name: "Raksham", tagline: "Guardian-grade protection", description: "", logoUrl: null, heroImageUrl: null, themeKey: "raksham", order: 3, isActive: true },
    brandId: "b-raksham",
    category: { id: "c-padlocks", slug: "padlocks", name: "Padlocks" },
    categoryId: "c-padlocks",
    description: "Case-hardened steel armored body with integrated red anti-drill shield and hardened boron alloy steel shackle.",
    material: "Case-Hardened Carbon Steel",
    size: "50mm Body / 9.5mm Shackle",
    finish: "Corrosion-Resistant Black Phosphate",
    numberOfKeys: 3,
    lockingMechanism: "Double Ball-Bearing Deadbolt",
    warranty: "10-Year Armor Warranty",
    images: ["/products/raksham-guard-50.jpg", "/placeholders/raksham-padlock.svg"],
    dealerPrice: 490,
    minOrderQty: 20,
    isActive: true,
  },
  "raksham-guard-padlock-65": {
    id: "p-raksham-02",
    slug: "raksham-guard-padlock-65",
    name: "Raksham Fortress Guard Padlock 65",
    brand: { id: "b-raksham", slug: "raksham", name: "Raksham", tagline: "Guardian-grade protection", description: "", logoUrl: null, heroImageUrl: null, themeKey: "raksham", order: 3, isActive: true },
    brandId: "b-raksham",
    category: { id: "c-padlocks", slug: "padlocks", name: "Padlocks" },
    categoryId: "c-padlocks",
    description: "Heavy industrial defense padlock featuring 12mm boron alloy shackle, reinforced armor casing, and anti-grinder shield.",
    material: "Hardened Boron Steel & Armored Casing",
    size: "65mm Body / 12mm Shackle",
    finish: "Gunmetal Protective Coat",
    numberOfKeys: 3,
    lockingMechanism: "Dual Deadlocking Steel Balls",
    warranty: "10-Year Armor Warranty",
    images: ["/products/raksham-guard-65.jpg", "/placeholders/raksham-padlock.svg"],
    dealerPrice: 660,
    minOrderQty: 15,
    isActive: true,
  },
};

function ProductDetailContent({ product }: { product: Product }) {
  const router = useRouter();

  // Access cart context safely
  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  // Distributor status check: dealerPrice present in response means approved distributor
  const isApprovedDistributor =
    product.dealerPrice !== undefined && product.dealerPrice !== null;

  // Quantity input state defaulting to minOrderQty or 1
  const minQty = product.minOrderQty || 1;
  const [quantity, setQuantity] = useState<number>(minQty);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Like/Heart state
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      getLikedProducts()
        .then((liked) => {
          if (liked && Array.isArray(liked)) {
            setIsLiked(liked.some((p) => p.id === product.id));
          }
        })
        .catch(() => {});
    }
  }, [product.id]);

  const handleToggleLike = async () => {
    if (!isUserLoggedIn()) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`);
      return;
    }
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeProduct(product.id);
        setIsLiked(false);
      } else {
        await likeProduct(product.id);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!cart) return;
    const placeholderImg = getCategoryPlaceholder(product.category?.slug, product.brand?.slug);
    const mainImg = (product.images && product.images[0]) || placeholderImg;

    cart.addItem({
      productId: product.id,
      name: product.name,
      modelCode: product.size || product.slug,
      image: mainImg,
      unitPrice: Number(product.dealerPrice || 0),
      minOrderQty: minQty,
      quantity: quantity,
    });

    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2500);
  };

  const brandName = product.brand?.name || "Nafi";
  const brandSlug = product.brand?.slug || "s-nafi";
  const categoryName = product.category?.name || "Architectural Hardware";

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── 1. Breadcrumb: Home / [Brand name] / [Product name] ── */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-muted font-sans flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-divider">/</li>
          <li>
            <Link
              href={`/brands/${brandSlug}`}
              className="hover:text-accent font-semibold transition-colors"
            >
              {brandName}
            </Link>
          </li>
          <li aria-hidden="true" className="text-divider">/</li>
          <li aria-current="page" className="text-primary font-medium truncate max-w-xs sm:max-w-md">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── Main Two-Column Showcase Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20 items-start">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <ProductGallery
            images={product.images}
            productName={product.name}
            categorySlug={product.category?.slug}
            brandSlug={product.brand?.slug}
          />
        </div>

        {/* Right Column: Title, Specs, Description & Action Area */}
        <div className="lg:col-span-6 space-y-6">
          {/* ── 3. Title Block ── */}
          <div className="border-b border-divider pb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Brand Badge */}
                <Link
                  href={`/brands/${brandSlug}`}
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-accent text-background hover:bg-accent-hover transition-colors shadow-2xs"
                >
                  {brandName}
                </Link>

                {/* Category Name */}
                <span className="text-xs font-mono uppercase tracking-wider text-muted px-2.5 py-1 rounded-md bg-surface border border-divider">
                  {categoryName}
                </span>
              </div>

              {/* Like / Heart Icon Toggle (Any logged-in user) */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLikeLoading}
                aria-label={isLiked ? "Remove from saved locks" : "Save this lock"}
                title={isLiked ? "Saved to your list" : "Bookmark lock"}
                className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-500 scale-105"
                    : "bg-surface border-divider text-muted hover:text-red-500 hover:border-red-200 hover:scale-105"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isLiked ? "fill-current" : "fill-none"}`}
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

            {/* Product Headline */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* ── 5. Description Paragraph ── */}
          {product.description && (
            <div className="prose prose-sm text-muted">
              <p className="leading-relaxed text-sm sm:text-base text-muted/90">
                {product.description}
              </p>
            </div>
          )}

          {/* ── 4. Product Spec Table ── */}
          <div className="pt-2">
            <ProductSpecTable
              material={product.material}
              size={product.size}
              finish={product.finish}
              numberOfKeys={product.numberOfKeys}
              lockingMechanism={product.lockingMechanism}
              warranty={product.warranty}
            />
          </div>

          {/* ── 6. Action Area (Role-Dependent) ── */}
          <div className="pt-4 border-t border-divider">
            {isApprovedDistributor ? (
              /* Approved Distributor Branch */
              <div className="p-5 rounded-2xl bg-surface border border-accent/20 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-divider">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                      WHOLESALE DEALER PRICE
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-serif text-2xl font-bold text-accent">
                        ₹{Number(product.dealerPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-mono text-muted">/ unit</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                      MIN. BATCH (MOQ)
                    </span>
                    <span className="font-mono text-sm font-bold text-primary mt-0.5 block">
                      {minQty} units
                    </span>
                  </div>
                </div>

                {/* Quantity Input + Add to Order */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center border border-divider rounded-xl overflow-hidden bg-background shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(minQty, prev - 1))}
                      disabled={quantity <= minQty}
                      className="px-3 py-3 text-sm text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={minQty}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setQuantity(isNaN(val) ? minQty : Math.max(minQty, val));
                      }}
                      className="w-16 text-center text-sm font-mono font-bold bg-transparent text-primary focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-3 text-sm text-muted hover:text-primary transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-6 rounded-xl font-serif font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isAddedToCart
                        ? "bg-emerald-600 text-white"
                        : "bg-accent text-background hover:bg-accent-hover active:scale-[0.99]"
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Added to Order Cart</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span>Add {quantity} to Order Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted font-mono pt-1">
                  <span>Batch Total: ₹{(quantity * Number(product.dealerPrice || 0)).toLocaleString("en-IN")}</span>
                  <Link href="/distributor/catalog" className="text-accent hover:underline">
                    View Dealer Catalog →
                  </Link>
                </div>
              </div>
            ) : (
              /* Public / Retail / Customer Branch */
              <div className="space-y-3">
                <Link
                  href={`/contact?productId=${encodeURIComponent(product.id)}&brandId=${encodeURIComponent(product.brandId || "")}`}
                  className="w-full py-3.5 px-6 rounded-xl bg-accent text-background hover:bg-accent-hover font-serif font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <span>Enquire About This Product</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <div className="flex items-center justify-between text-xs text-muted pt-1">
                  <span>Authorized Wholesale Dealer?</span>
                  <Link href="/login" className="text-accent font-semibold hover:underline">
                    Sign In for B2B Pricing →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 7. Related Products: Reusing ProductGrid ── */}
      <section className="pt-12 border-t border-divider">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary">
              Related {brandName} Locks
            </h2>
            <p className="text-xs text-muted mt-1 font-mono uppercase tracking-wider">
              Complementary hardware from the {brandName} collection
            </p>
          </div>

          <Link
            href={`/brands/${brandSlug}`}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>View All {brandName}</span>
            <span>→</span>
          </Link>
        </div>

        <ProductGrid
          brandFilter={brandSlug}
          excludeSlug={product.slug}
          limit={3}
          hideFilters={true}
        />
      </section>

      {/* Global slide-out order cart drawer for quick review */}
      <OrderCartDrawer />
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setIsNotFound(false);

    getProductBySlug(slug)
      .then((data) => {
        if (!data || data.isActive === false) {
          // Check local fallback before 404
          const fallback = LOCAL_CATALOG_FALLBACK[slug];
          if (fallback && fallback.isActive !== false) {
            setProduct(fallback as Product);
          } else {
            setIsNotFound(true);
          }
        } else {
          setProduct(data);
        }
      })
      .catch((err) => {
        console.warn(`Product API lookup failed for ${slug}, checking catalog fallback:`, err);
        const fallback = LOCAL_CATALOG_FALLBACK[slug];
        if (fallback && fallback.isActive !== false) {
          setProduct(fallback as Product);
        } else {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted">
            Forging Product Specifications...
          </p>
        </div>
      </div>
    );
  }

  // Proper 404 screen if the slug does not resolve to an active product
  if (isNotFound || !product) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-background text-center">
        <div className="max-w-md w-full bg-surface border border-divider rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="9" y1="16" x2="15" y2="16" />
            </svg>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">
            Status Code 404
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
            Product Not Found
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-8">
            The lock specification or model you requested could not be located in our active factory registry. It may have been renamed or archived.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#catalog"
              className="w-full sm:w-auto px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-xl hover:bg-accent-hover transition-colors shadow-xs"
            >
              Browse Full Catalog
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-2.5 bg-background border border-divider text-primary font-serif font-semibold text-xs rounded-xl hover:bg-surface transition-colors"
            >
              Contact Factory Desk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Wrap in ThemeProvider using the product's own brand's themeKey
  const brandThemeKey = product.brand?.themeKey || "nafi";

  return (
    <ThemeProvider themeKey={brandThemeKey}>
      <OrderCartProvider>
        <ProductDetailContent product={product} />
      </OrderCartProvider>
    </ThemeProvider>
  );
}

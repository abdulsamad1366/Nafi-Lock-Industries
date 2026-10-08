"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getLikedProducts, likeProduct, unlikeProduct, Product } from "@/lib/api";
import { getUser, isUserLoggedIn } from "@/lib/userAuth";
import ThemeProvider from "@/components/ThemeProvider";
import ProductGallery, { getCategoryPlaceholder } from "@/components/ProductGallery";
import ProductSpecTable from "@/components/ProductSpecTable";
import ProductGrid from "@/components/ProductGrid";
import { useOrderCart } from "@/components/OrderCartProvider";

function ProductDetailContent({ product }: { product: Product }) {
  const router = useRouter();

  // Access cart context safely
  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  // Distributor status check: dealerPrice present in response AND logged in distributor
  // (Doc 11 Section 5.2)
  const user = getUser();
  const isApprovedDistributor = Boolean(
    user && user.role === "DISTRIBUTOR" && product.dealerPrice !== undefined && product.dealerPrice !== null
  );

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* ── 1. Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-muted flex items-center gap-2">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-accent transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link href={`/brands/${brandSlug}`} className="hover:text-accent transition-colors">
          {brandName}
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* ── 2. Main Two-Column Architectural Showcase ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            categorySlug={product.category?.slug}
            brandSlug={product.brand?.slug}
          />
        </div>

        {/* Right Column: Specifications & Commercial Terms */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            {/* Top Identity Row: Brand Pill + Wishlist Action */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/brands/${brandSlug}`}
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-accent/15 text-accent border border-accent/25 hover:bg-accent/25 transition-colors"
                >
                  {brandName}
                </Link>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">
                  {categoryName}
                </span>
              </div>

              {/* Heart Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLikeLoading}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
                  isLiked
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "bg-surface border-divider text-muted hover:text-red-500 hover:border-red-500/30"
                }`}
                title={isLiked ? "Saved to your distributor registry" : "Save this lock model"}
                aria-label={isLiked ? "Saved" : "Save Lock"}
              >
                <svg
                  className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
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

          {/* ── 3. Description Paragraph ── */}
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
              warranty={product.warranty || "1 year"}
            />
          </div>

          {/* ── 5. Action Area (Role-Dependent) ── */}
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
                  <Link href="/products" className="text-accent hover:underline">
                    Browse More Locks →
                  </Link>
                </div>
              </div>
            ) : (
              /* Public / Non-Approved Visitor Branch — Gated B2B Wholesale Notice */
              <div className="p-6 rounded-2xl bg-surface border border-divider shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-primary">
                      B2B Dealer Pricing &amp; Bulk Ordering
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-1">
                      Direct factory wholesale pricing, minimum order quantities, and purchase orders are reserved for authorized Nafi Lock Industries distributors and hardware stockists.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-accent text-white font-serif font-bold text-xs hover:bg-accent-hover text-center shadow-xs transition-colors"
                  >
                    Distributor Sign In →
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-background border border-divider hover:bg-surface text-primary font-serif font-bold text-xs text-center transition-colors shadow-2xs"
                  >
                    Apply for Dealership
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. Related Products: Live API ProductGrid ── */}
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
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    getProductBySlug(slug)
      .then((data) => {
        if (!data || data.isActive === false) {
          setProduct(null);
        } else {
          setProduct(data);
        }
      })
      .catch((err) => {
        console.warn(`Product API lookup failed for ${slug}:`, err);
        setError(err?.message || "Failed to load product specifications.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

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

  // Error state with retry button (Doc 11 Section 5.2)
  if (error && !product) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-background text-center">
        <div className="max-w-md w-full bg-surface border border-red-100 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary mb-2">
            Failed to Load Product
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadProduct}
              className="w-full sm:w-auto px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-xl hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-2.5 bg-background border border-divider text-primary font-serif font-semibold text-xs rounded-xl hover:bg-surface transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Proper 404 screen if the slug does not resolve to an active product
  if (!product) {
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
              href="/products"
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
      <ProductDetailContent product={product} />
    </ThemeProvider>
  );
}

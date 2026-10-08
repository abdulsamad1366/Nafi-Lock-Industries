"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getLikedProducts, likeProduct, unlikeProduct, Product } from "@/lib/api";
import { getUser, isUserLoggedIn } from "@/lib/userAuth";
import ThemeProvider from "@/components/ThemeProvider";
import ProductGallery, { getCategoryPlaceholder } from "@/components/ProductGallery";
import ProductSpecTable from "@/components/ProductSpecTable";
import ProductGrid from "@/components/ProductGrid";
import { useOrderCart } from "@/components/OrderCartProvider";

function ProductDetailContent({ product }: { product: Product }) {
  const router = useRouter();
  const buyBoxRef = useRef<HTMLDivElement>(null);

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

  // UI / UX state
  const [activeTab, setActiveTab] = useState<"specs" | "craftsmanship" | "logistics" | "downloads">("specs");
  const [copiedToast, setCopiedToast] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

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

  // Scroll listener for sticky floating purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        // Show sticky bar when the buy box has scrolled out of view
        setShowStickyBar(rect.bottom < 80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    }
  };

  const brandName = product.brand?.name || "Nafi";
  const brandSlug = product.brand?.slug || "s-nafi";
  const categoryName = product.category?.name || "Architectural Hardware";

  const placeholderImg = getCategoryPlaceholder(product.category?.slug, product.brand?.slug);
  const mainImg = (product.images && product.images[0]) || placeholderImg;

  // Preset batch multipliers
  const batchPresets = [
    { label: `1x MOQ (${minQty})`, qty: minQty },
    { label: `2x MOQ (${minQty * 2})`, qty: minQty * 2 },
    { label: "100 Units", qty: 100 },
    { label: "250 Units", qty: 250 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* ── 1. Top Navigation & Quick Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06]">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-stone-500 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link href="/products" className="hover:text-[#A98048] transition-colors flex items-center gap-1 shrink-0 font-medium">
            <span>←</span>
            <span>All Locks</span>
          </Link>
          <span className="opacity-40">/</span>
          <Link href={`/brands/${brandSlug}`} className="hover:text-[#A98048] transition-colors shrink-0">
            {brandName}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Quick Share & Registry Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-black/[0.08] text-stone-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Copy link to clipboard"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{copiedToast ? "Copied!" : "Share Link"}</span>
          </button>

          <a
            href={`https://wa.me/919358933434?text=${encodeURIComponent(
              `Hello Nafi Lock Industries, I am inquiring about the ${product.name} (Material: ${product.material || "Brass"}, Size: ${product.size || "Standard"}). Please share factory wholesale pricing.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-medium flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.029-.49-1.635-.674-2.697-2.338-2.779-2.45-.082-.112-.663-.882-.663-1.682 0-.8.419-1.194.568-1.356.149-.163.325-.203.434-.203.109 0 .217.001.312.006.1.005.234-.038.366.279.136.327.466 1.139.507 1.222.041.083.069.18.014.288-.055.109-.083.176-.164.271-.082.096-.172.214-.246.287-.082.082-.167.172-.072.335.095.163.425.702.912 1.136.627.558 1.155.731 1.318.813.163.082.259.068.355-.041.096-.109.407-.476.516-.639.109-.163.218-.136.367-.082.149.055.95.449 1.113.53.163.082.272.122.312.19.041.068.041.394-.103.799z" />
            </svg>
            <span>WhatsApp Inquiry</span>
          </a>
        </div>
      </div>

      {/* ── 2. Main Two-Column Showcase (Gallery + Purchasing Console) ── */}
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

        {/* Right Column: Commercial Specifications & Order Console */}
        <div className="lg:col-span-6 space-y-7" ref={buyBoxRef}>
          <div>
            {/* Top Identity Row: Brand Pill + Production Status + Wishlist */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/brands/${brandSlug}`}
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#A98048]/15 text-[#A98048] border border-[#A98048]/25 hover:bg-[#A98048]/25 transition-colors"
                >
                  {brandName}
                </Link>
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                  {categoryName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Active Foundry Batch</span>
                </span>
              </div>

              {/* Heart Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLikeLoading}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-2xs active:scale-90 ${
                  isLiked
                    ? "bg-red-500/10 border-red-500/30 text-red-500 hover:scale-105"
                    : "bg-white border-black/[0.08] text-stone-400 hover:text-red-500 hover:border-red-500/30 hover:scale-105"
                }`}
                title={isLiked ? "Saved to your lock registry" : "Save this lock model"}
                aria-label={isLiked ? "Saved" : "Save Lock"}
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isLiked ? "fill-current scale-110" : "fill-none"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Product Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15]">
              {product.name}
            </h1>

            {/* Key Spec Chips */}
            <div className="flex items-center gap-2 flex-wrap mt-3 text-xs font-mono text-stone-600">
              {product.material && (
                <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  {product.material}
                </span>
              )}
              {product.size && (
                <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  {product.size}
                </span>
              )}
              {product.finish && (
                <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  {product.finish}
                </span>
              )}
              {product.lockingMechanism && product.lockingMechanism.toUpperCase() !== "N/A" && (
                <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  {product.lockingMechanism}
                </span>
              )}
            </div>
          </div>

          {/* Description Paragraph */}
          {product.description && (
            <p className="leading-relaxed text-sm sm:text-base text-stone-600 border-l-2 border-[#A98048]/40 pl-4 py-0.5">
              {product.description}
            </p>
          )}

          {/* ── 3. Wholesale Purchasing Console ── */}
          <div className="pt-2">
            {isApprovedDistributor ? (
              /* Approved Distributor Console */
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#A98048]/30 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                      WHOLESALE DEALER PRICE
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-serif text-3xl font-bold text-[#A98048]">
                        ₹{Number(product.dealerPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-mono text-stone-500">/ unit</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                      MIN. BATCH (MOQ)
                    </span>
                    <span className="font-mono text-base font-bold text-stone-900 mt-0.5 block">
                      {minQty} units
                    </span>
                  </div>
                </div>

                {/* Quick Batch Presets */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-2">
                    Quick Batch Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {batchPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setQuantity(preset.qty)}
                        className={`text-xs font-mono py-1.5 px-2 rounded-xl border transition-all text-center cursor-pointer ${
                          quantity === preset.qty
                            ? "bg-[#1C1917] text-white border-[#1C1917] font-bold shadow-2xs"
                            : "bg-stone-50 hover:bg-stone-100 border-black/[0.08] text-stone-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Quantity Stepper + Add to Order Cart */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center border border-black/15 rounded-xl overflow-hidden bg-stone-50 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(minQty, prev - 1))}
                        disabled={quantity <= minQty}
                        className="px-4 py-3 text-sm font-bold text-stone-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                        className="w-20 text-center text-sm font-mono font-bold bg-transparent text-stone-900 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-4 py-3 text-sm font-bold text-stone-600 hover:text-black transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-serif font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                        isAddedToCart
                          ? "bg-emerald-600 text-white"
                          : "bg-[#1C1917] hover:bg-black text-white hover:shadow-lg"
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
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          <span>Add {quantity} Units to Order Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Calculations & Batch Value Breakdown */}
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-1">
                    <span className="font-semibold text-stone-800">
                      Batch Value: ₹{(quantity * Number(product.dealerPrice || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      ✓ Meets {minQty} unit minimum batch
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Public / Non-Approved Visitor Branch — Gated B2B Wholesale Notice */
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-black/[0.08] shadow-md space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#A98048]/10 text-[#A98048] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                      B2B Dealer Pricing &amp; Factory Batch Ordering
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                      Direct foundry wholesale rates, MOQ batch shipments, and commercial credit accounts are exclusive to authorized Nafi Lock Industries distributors and architectural hardware merchants.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#1C1917] hover:bg-black text-white font-serif font-bold text-xs text-center shadow-xs transition-all active:scale-95"
                  >
                    Distributor Sign In →
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-stone-50 border border-black/15 hover:bg-stone-100 text-stone-900 font-serif font-bold text-xs text-center transition-all shadow-2xs active:scale-95"
                  >
                    Apply for Dealership
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── 4. Interactive Tabs Section (Specs, Craftsmanship, Logistics, Downloads) ── */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 border-b border-black/[0.08] pb-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`text-xs font-serif font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "specs"
                    ? "bg-[#1C1917] text-white shadow-2xs"
                    : "text-stone-600 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("craftsmanship")}
                className={`text-xs font-serif font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "craftsmanship"
                    ? "bg-[#1C1917] text-white shadow-2xs"
                    : "text-stone-600 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                Craftsmanship
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("logistics")}
                className={`text-xs font-serif font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "logistics"
                    ? "bg-[#1C1917] text-white shadow-2xs"
                    : "text-stone-600 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                Logistics &amp; MOQ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("downloads")}
                className={`text-xs font-serif font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "downloads"
                    ? "bg-[#1C1917] text-white shadow-2xs"
                    : "text-stone-600 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                Downloads &amp; CAD
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === "specs" && (
                <div className="animate-fade-in">
                  <ProductSpecTable
                    material={product.material}
                    size={product.size}
                    finish={product.finish}
                    numberOfKeys={product.numberOfKeys}
                    lockingMechanism={product.lockingMechanism}
                    warranty={product.warranty || "1 year"}
                  />
                </div>
              )}

              {activeTab === "craftsmanship" && (
                <div className="space-y-3 animate-fade-in text-xs leading-relaxed text-stone-600">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-black/[0.06] space-y-2">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      Solid Metal Alloy Casting
                    </h4>
                    <p>
                      Every body is hot-forged in our Aligarh foundry using pure brass and cold-rolled alloy stock. Heavy solid metal blocks eliminate porous casting voids, delivering impact resistance against sledgehammers and wedge attacks.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-black/[0.06] space-y-2">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      Case-Hardened Boron Shackle
                    </h4>
                    <p>
                      Thermal induction treatment yields a Rockwell C-scale surface hardness exceeding 60 HRC, resisting 10-ton hydraulic bolt cutters and abrasive hacksaws.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-black/[0.06] space-y-3 animate-fade-in text-xs text-stone-700">
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-black/[0.06]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-500 block">Factory Dispatch</span>
                      <span className="font-bold font-serif text-sm">Aligarh, Uttar Pradesh</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-500 block">Batch Packing</span>
                      <span className="font-bold font-serif text-sm">Master Carton (Inner 6x)</span>
                    </div>
                  </div>
                  <p className="leading-relaxed">
                    Orders exceeding the minimum batch quantity ({minQty} units) qualify for direct factory consignment via safe insured transport. Commercial GST invoices accompany all distributor shipments.
                  </p>
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-black/[0.06] space-y-3 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Architectural documentation and blueprint specifications for contractors and security engineers:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`Technical specification sheet for ${product.name} is compiled. Please contact factory engineering.`)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-black/[0.08] text-xs font-mono font-medium text-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      <span>Spec Sheet (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`CAD drawing files for ${product.name} will be dispatched by our technical team.`)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-black/[0.08] text-xs font-mono font-medium text-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span>Request 2D/3D CAD</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Foundry Quality Guarantee Strip ── */}
      <section className="py-8 px-6 rounded-3xl bg-gradient-to-r from-[#FAF9F5] via-white to-[#FAF9F5] border border-black/[0.06] shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#A98048]/15 text-[#A98048] flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">Solid Metal Forging</h4>
            <p className="text-[11px] text-stone-500 font-mono">100% Forged Body</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#A98048]/15 text-[#A98048] flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">100,000 Cycle Tested</h4>
            <p className="text-[11px] text-stone-500 font-mono">EN 1303 Durability</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#A98048]/15 text-[#A98048] flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">Direct Aligarh Terms</h4>
            <p className="text-[11px] text-stone-500 font-mono">Factory Wholesale</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#A98048]/15 text-[#A98048] flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">1 Year Warranty</h4>
            <p className="text-[11px] text-stone-500 font-mono">Factory Replacement</p>
          </div>
        </div>
      </section>

      {/* ── 6. Related Products: Live API ProductGrid ── */}
      <section className="pt-8 border-t border-black/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Related {brandName} Locks
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-mono uppercase tracking-wider">
              Architectural security hardware from the {brandName} collection
            </p>
          </div>

          <Link
            href={`/brands/${brandSlug}`}
            className="text-xs font-serif font-bold text-[#A98048] hover:underline flex items-center gap-1"
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

      {/* ── 7. Apple/Google Grade Sticky Floating Order Bar ── */}
      {showStickyBar && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-40 animate-fade-in">
          <div className="bg-[#1C1917]/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl sm:rounded-full border border-white/10 shadow-2xl flex items-center justify-between gap-3">
            {/* Thumbnail + Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 shrink-0">
                <Image
                  src={mainImg}
                  alt={product.name}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="truncate">
                <h4 className="font-serif text-xs font-bold truncate text-white">
                  {product.name}
                </h4>
                <p className="text-[10px] font-mono text-stone-400 truncate">
                  {isApprovedDistributor && product.dealerPrice
                    ? `₹${Number(product.dealerPrice).toLocaleString("en-IN")} / unit • MOQ: ${minQty}`
                    : `MOQ: ${minQty} units • ${product.material || "Brass"}`}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="shrink-0 flex items-center gap-2">
              {isApprovedDistributor ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-4 py-2 rounded-xl sm:rounded-full bg-[#A98048] hover:bg-[#C49B55] active:scale-95 text-white text-xs font-serif font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{isAddedToCart ? "✓ Added" : "Add to Order"}</span>
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl sm:rounded-full bg-[#A98048] hover:bg-[#C49B55] text-white text-xs font-serif font-bold transition-all shadow-xs whitespace-nowrap"
                >
                  Apply Dealership
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
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
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#A98048] border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Forging Product Specifications...
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry button (Doc 11 Section 5.2)
  if (error && !product) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#FAF9F5] text-center">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Failed to Load Product
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadProduct}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1C1917] text-white font-serif font-bold text-xs rounded-xl hover:bg-black transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              Retry Connection
            </button>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-50 border border-black/15 text-stone-900 font-serif font-semibold text-xs rounded-xl hover:bg-stone-100 transition-colors"
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
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#FAF9F5] text-center">
        <div className="max-w-md w-full bg-white border border-black/[0.08] rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#A98048]/10 text-[#A98048] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="9" y1="16" x2="15" y2="16" />
            </svg>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-stone-400 block mb-2 font-semibold">
            Status Code 404
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            Product Not Found
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-8">
            The lock specification or model you requested could not be located in our active factory registry. It may have been renamed or archived.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#A98048] hover:bg-[#C49B55] text-white font-serif font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Browse Full Catalog
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-50 border border-black/15 text-stone-900 font-serif font-semibold text-xs rounded-xl hover:bg-stone-100 transition-colors"
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

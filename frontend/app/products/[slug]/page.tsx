"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getLikedProducts, likeProduct, unlikeProduct, Product } from "@/lib/api";
import { getUser, isUserLoggedIn } from "@/lib/userAuth";
import ThemeProvider from "@/components/ThemeProvider";
import ProductGallery, { getCategoryPlaceholder } from "@/components/ProductGallery";
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

  // UI state for Flipkart/Amazon features
  const [copiedToast, setCopiedToast] = useState(false);
  const [pincode, setPincode] = useState("202001");
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size || "50mm");

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
    if (!isApprovedDistributor) {
      router.push(`/signup`);
      return;
    }
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

  const handleBuyNow = () => {
    if (!isApprovedDistributor) {
      router.push(`/signup`);
      return;
    }
    handleAddToCart();
    if (cart) {
      cart.openDrawer();
    }
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
  const categoryName = product.category?.name || "Padlocks";

  const placeholderImg = getCategoryPlaceholder(product.category?.slug, product.brand?.slug);
  const mainImg = (product.images && product.images[0]) || placeholderImg;

  // Presets for quick wholesale ordering
  const batchPresets = [
    { label: `${minQty} (1x MOQ)`, qty: minQty },
    { label: `${minQty * 2} (2x MOQ)`, qty: minQty * 2 },
    { label: "100 Units", qty: 100 },
    { label: "250 Units", qty: 250 },
  ];

  // Available size variants for locks
  const availableSizes = ["40mm", "50mm", "65mm", "75mm"];

  // Reference MRP calculation for discount display
  const unitPrice = Number(product.dealerPrice || 0);
  const referenceMrp = Math.round(unitPrice * 1.55);

  return (
    <div className="bg-[#F1F3F6] min-h-screen pb-24 sm:pb-16">
      {/* ── Top Breadcrumbs Strip (Flipkart / Amazon style) ── */}
      <div className="bg-white border-b border-black/[0.06] py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-sans text-stone-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <Link href="/" className="hover:text-[#2874F0] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-[#2874F0] transition-colors">Locks &amp; Hardware</Link>
            <span>›</span>
            <Link href={`/brands/${brandSlug}`} className="hover:text-[#2874F0] transition-colors">{brandName}</Link>
            <span>›</span>
            <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-[11px] text-stone-600 hover:text-black flex items-center gap-1 cursor-pointer font-medium"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copiedToast ? "Copied Link!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Amazon/Flipkart 2-Column Product Showcase ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ── Left Column: Media Gallery & Dual Flipkart Action Buttons (Col 5) ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <ProductGallery
                images={product.images}
                productName={product.name}
                categorySlug={product.category?.slug}
                brandSlug={product.brand?.slug}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAddedToCart={isAddedToCart}
                isDistributor={isApprovedDistributor}
              />
            </div>

            {/* ── Right Column: Title, Ratings, Pricing, Offers & Specs (Col 7) ── */}
            <div className="lg:col-span-7 space-y-5" ref={buyBoxRef}>
              <div>
                {/* Store Link & Heart Button */}
                <div className="flex items-center justify-between pb-1">
                  <Link
                    href={`/brands/${brandSlug}`}
                    className="text-xs font-semibold text-[#2874F0] hover:underline flex items-center gap-1"
                  >
                    <span>Visit the {brandName} Official Store</span>
                    <span>›</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    disabled={isLikeLoading}
                    className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    title={isLiked ? "In Wishlist" : "Add to Wishlist"}
                    aria-label="Wishlist toggle"
                  >
                    <svg
                      className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "fill-none"}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Product Title (Amazon / Flipkart format with key attributes) */}
                <h1 className="font-sans text-xl sm:text-2xl font-semibold text-[#212121] leading-snug">
                  {product.name} ({product.material || "Brass"}, {product.size || "50mm"}, {product.finish || "Brass Polish"}, {product.numberOfKeys ? `${product.numberOfKeys} Precision Keys` : "Computerized Keys"})
                </h1>

                {/* Flipkart / Amazon Ratings & Assured Badge Strip */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap mt-2.5 pt-1">
                  {/* Flipkart Green Star Badge */}
                  <div className="inline-flex items-center gap-1 bg-[#388E3C] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                    <span>4.8</span>
                    <span>★</span>
                  </div>

                  <span className="text-xs font-medium text-[#878787]">
                    128 Ratings &amp; 34 Verified Dealer Reviews
                  </span>

                  {/* Flipkart Assured Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2874F0] bg-[#2874F0]/10 px-2 py-0.5 rounded-sm">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
                    </svg>
                    <span>Nafi Assured</span>
                  </span>

                  {/* Amazon Best Seller Tag */}
                  <span className="text-[11px] font-medium text-[#E47911] bg-[#FFF3E5] px-2 py-0.5 rounded-sm">
                    #1 in Architectural Brass Padlocks
                  </span>
                </div>
              </div>

              {/* ── Pricing Box (Role-Aware) ── */}
              <div className="pt-2 border-t border-black/[0.06]">
                {isApprovedDistributor && product.dealerPrice ? (
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-[#388E3C] text-lg font-bold">
                        35% off
                      </span>
                      <span className="text-3xl font-bold font-sans text-[#212121]">
                        ₹{unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-[#878787] line-through">
                        ₹{referenceMrp.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        / unit
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#388E3C] font-medium">
                      <span>✓ Wholesale Factory Direct Rate</span>
                      <span>•</span>
                      <span>GST Input Tax Credit Eligible</span>
                    </div>

                    <p className="text-xs text-[#878787]">
                      Inclusive of all taxes. Minimum Order Quantity: <strong className="text-stone-900">{minQty} units</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FFF9EE] border border-[#FFE8B3] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF9F00]/20 text-[#FF9F00] flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-stone-900">
                        B2B Wholesale Price Gated
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Authorized dealer pricing and direct consignment ordering is available for approved hardware distributors.
                      </p>
                      <div className="pt-1.5 flex items-center gap-3">
                        <Link
                          href={`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`}
                          className="text-xs font-bold text-[#2874F0] hover:underline"
                        >
                          Sign In as Distributor →
                        </Link>
                        <span className="text-stone-300">|</span>
                        <Link
                          href="/signup"
                          className="text-xs font-bold text-[#2874F0] hover:underline"
                        >
                          Apply for Dealership
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Flipkart/Amazon "Available Offers" Section ── */}
              <div className="p-4 rounded-xl bg-stone-50 border border-black/[0.06] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#212121]">
                  <span className="text-emerald-600">🏷️</span>
                  <span>Available Factory Offers &amp; B2B Schemes</span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2874F0] shrink-0">Volume Rebate:</span>
                    <span>Order 50+ units to get an additional 5% consignment cash discount.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2874F0] shrink-0">GST Invoice:</span>
                    <span>Claim up to 18% Input Tax Credit with your registered business GSTIN.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2874F0] shrink-0">Free Delivery:</span>
                    <span>Insured direct factory consignment dispatch from Aligarh on orders over ₹10,000.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2874F0] shrink-0">Bank Offer:</span>
                    <span>Flat 2% settlement rebate on instant RTGS / NEFT transfer payments.</span>
                  </div>
                </div>
              </div>

              {/* ── Variant Selector (Amazon Style Size Pills) ── */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">
                    Size: <strong className="text-stone-900">{selectedSize}</strong>
                  </span>
                  <span className="text-[#2874F0] hover:underline cursor-pointer text-[11px]">Size Guide</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs font-mono font-medium px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#2874F0] bg-[#2874F0]/5 text-[#2874F0] font-bold ring-1 ring-[#2874F0]"
                            : "border-black/15 bg-white text-stone-700 hover:border-black/30"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Amazon/Flipkart Delivery Pincode Checker ── */}
              <div className="pt-2 border-t border-black/[0.06] space-y-2">
                <span className="text-xs font-semibold text-stone-800 block">
                  Delivery &amp; Dispatch Status:
                </span>
                <div className="flex items-center gap-2 max-w-xs">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter delivery pincode"
                      className="w-full text-xs font-mono py-2 pl-3 pr-2 bg-white border border-black/20 rounded-lg text-stone-900 focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPincodeChecked(true)}
                    className="text-xs font-bold text-[#2874F0] hover:text-[#1258c7] px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </div>

                {pincodeChecked && (
                  <div className="text-xs space-y-1 pt-0.5">
                    <p className="text-stone-900 font-medium">
                      Delivery by <span className="text-[#388E3C] font-bold">10 AM, Day after tomorrow</span> | <span className="text-[#388E3C] font-bold">FREE</span>
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Dispatched from: Nafi Lock Industries Central Foundry, Aligarh, UP (202001)
                    </p>
                  </div>
                )}
              </div>

              {/* ── Amazon 4-Icon Service Highlights Strip ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 pb-2 text-center">
                <div className="p-3 bg-stone-50 rounded-xl border border-black/[0.04] space-y-1">
                  <div className="text-lg">🚚</div>
                  <span className="text-[10.5px] font-sans font-bold text-stone-800 block leading-tight">24-48h Dispatch</span>
                  <span className="text-[9.5px] text-stone-500 font-mono block">Direct from Foundry</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-black/[0.04] space-y-1">
                  <div className="text-lg">🛡️</div>
                  <span className="text-[10.5px] font-sans font-bold text-stone-800 block leading-tight">1 Year Warranty</span>
                  <span className="text-[9.5px] text-stone-500 font-mono block">Factory Replacement</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-black/[0.04] space-y-1">
                  <div className="text-lg">🏭</div>
                  <span className="text-[10.5px] font-sans font-bold text-stone-800 block leading-tight">100% Solid Brass</span>
                  <span className="text-[9.5px] text-stone-500 font-mono block">Zero Porous Voids</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-black/[0.04] space-y-1">
                  <div className="text-lg">🧾</div>
                  <span className="text-[10.5px] font-sans font-bold text-stone-800 block leading-tight">GST Invoice</span>
                  <span className="text-[9.5px] text-stone-500 font-mono block">Input Tax Credit</span>
                </div>
              </div>

              {/* ── Distributor Batch Quantity Stepper ── */}
              {isApprovedDistributor && (
                <div className="p-4 rounded-xl bg-stone-50 border border-[#FF9F00]/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                    <span>Batch Quantity (Units):</span>
                    <span className="text-[#388E3C] font-bold">
                      Batch Total: ₹{(quantity * unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {batchPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setQuantity(preset.qty)}
                        className={`text-xs font-mono py-1.5 px-2 rounded-lg border transition-all text-center cursor-pointer ${
                          quantity === preset.qty
                            ? "bg-[#2874F0] text-white border-[#2874F0] font-bold shadow-2xs"
                            : "bg-white hover:bg-stone-100 border-black/15 text-stone-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center border border-black/20 rounded-lg overflow-hidden bg-white shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(minQty, prev - 1))}
                        disabled={quantity <= minQty}
                        className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:text-black transition-colors disabled:opacity-30 cursor-pointer"
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
                        className="w-16 text-center text-xs font-mono font-bold bg-transparent text-stone-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:text-black transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs text-stone-500 font-mono">
                      Quantity selected: <strong>{quantity} units</strong> (Min: {minQty})
                    </span>
                  </div>
                </div>
              )}

              {/* ── Flipkart Tabular Specifications (2-Column Key/Value Grid) ── */}
              <div className="pt-4 border-t border-black/[0.08] space-y-4">
                <h3 className="font-sans text-base font-bold text-[#212121]">
                  Specifications
                </h3>

                {/* Section 1: General */}
                <div className="border border-black/[0.08] rounded-xl overflow-hidden text-xs">
                  <div className="bg-stone-50 px-4 py-2 font-bold text-stone-700 border-b border-black/[0.08]">
                    General
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Sales Package</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">
                        1 Padlock Body, {product.numberOfKeys || 3} Computerized Keys, Factory Warranty Card
                      </div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Model Name</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.name}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Brand</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{brandName}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Core Material</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.material || "Brass"}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Surface Finish</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.finish || "Polished Brass"}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Suitable For</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">
                        Main Entrance Doors, Commercial Shutters, Warehouses, Storage Godowns, Gates
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Dimensions & Mechanism */}
                <div className="border border-black/[0.08] rounded-xl overflow-hidden text-xs">
                  <div className="bg-stone-50 px-4 py-2 font-bold text-stone-700 border-b border-black/[0.08]">
                    Security &amp; Mechanical Dimensions
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Body Size</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.size || "50mm"}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Locking Mechanism</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.lockingMechanism || "Single bolt"}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Cylinder Tumbler</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">Precision Swiss-Grade 5-Pin Tumbler</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Shackle Hardness</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">Case-Hardened Boron Steel (&gt;60 HRC)</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Corrosion Resistance</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">Multi-Layer Protective Polish (Outdoor Rated)</div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Warranty */}
                <div className="border border-black/[0.08] rounded-xl overflow-hidden text-xs">
                  <div className="bg-stone-50 px-4 py-2 font-bold text-stone-700 border-b border-black/[0.08]">
                    Warranty &amp; Service
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    <div className="grid grid-cols-12 px-4 py-2.5">
                      <div className="col-span-5 text-stone-500 font-medium">Warranty Summary</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">{product.warranty || "1 Year Factory Warranty"}</div>
                    </div>
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-stone-50/50">
                      <div className="col-span-5 text-stone-500 font-medium">Covered in Warranty</div>
                      <div className="col-span-7 font-sans text-stone-900 font-medium">Manufacturing Defects &amp; Mechanism Lockup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Amazon A+ Visual Engineering Showcase (A+ Content) ── */}
        <section className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-black/[0.06] pb-3">
            <h2 className="font-sans text-lg sm:text-xl font-bold text-[#212121]">
              From the Manufacturer — Architectural Engineering &amp; Foundry Standards
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Precision lockmaking direct from Aligarh, India since 1995.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-black/[0.06]">
                <Image
                  src="/products/s-nafi-classic-50.jpg"
                  alt="Solid Brass Foundry Casting"
                  fill
                  sizes="300px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-sans font-bold text-sm text-stone-900">
                100% Solid Brass Casting
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hot-forged from virgin brass ingots. Eliminates porous air bubbles and brittle fracture points common in cheap die-cast locks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-black/[0.06]">
                <Image
                  src="/products/raksham-shackle-lock.jpg"
                  alt="Case-Hardened Boron Shackle"
                  fill
                  sizes="300px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-sans font-bold text-sm text-stone-900">
                Anti-Cut Boron Shackle
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Thermal induction hardening delivers surface hardness above 60 HRC to defeat 10-ton hydraulic bolt cutters and abrasive hacksaws.
              </p>
            </div>

            {/* Card 3 */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-black/[0.06]">
                <Image
                  src="/products/s-nafi-mortise-set.jpg"
                  alt="Swiss Precision Tumbler Core"
                  fill
                  sizes="300px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-sans font-bold text-sm text-stone-900">
                Anti-Pick Pin Tumbler
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Spool and mushroom driver pins create false set feedback against lockpicks, providing maximum mechanical deterrence.
              </p>
            </div>

            {/* Card 4 */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-black/[0.06]">
                <Image
                  src="/products/greek-heritage-40.jpg"
                  alt="Hand Polished Heritage Finish"
                  fill
                  sizes="300px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-sans font-bold text-sm text-stone-900">
                100,000 Cycle Tested
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Individually hand-buffed and tested for smooth key rotation across 100,000 mechanical operating cycles without seizure.
              </p>
            </div>
          </div>
        </section>

        {/* ── Customer Ratings & Reviews Breakdown (Amazon/Flipkart Style) ── */}
        <section className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold text-[#212121]">
                Customer Ratings &amp; Contractor Reviews
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Verified feedback from hardware dealers, builders, and facility managers across India.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert("Review submission is open to verified distributor accounts.")}
              className="text-xs font-bold text-[#2874F0] border border-[#2874F0] px-4 py-2 rounded-lg hover:bg-[#2874F0]/5 transition-colors cursor-pointer"
            >
              Rate Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Score & Stars Breakdown (Col 4) */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-[#212121]">4.8</span>
                <div>
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="text-xs text-[#878787]">Based on 128 verified ratings</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-10">5 ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#388E3C] w-[84%]" />
                  </div>
                  <span className="w-8 text-right font-mono">84%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10">4 ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#388E3C] w-[12%]" />
                  </div>
                  <span className="w-8 text-right font-mono">12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10">3 ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF9F00] w-[3%]" />
                  </div>
                  <span className="w-8 text-right font-mono">3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10">2 ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF9F00] w-[1%]" />
                  </div>
                  <span className="w-8 text-right font-mono">1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10">1 ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-[0%]" />
                  </div>
                  <span className="w-8 text-right font-mono">0%</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews (Col 8) */}
            <div className="md:col-span-8 space-y-4 divide-y divide-black/[0.06]">
              {/* Review 1 */}
              <div className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#388E3C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">5 ★</span>
                  <span className="font-bold text-xs text-stone-900">Heavy solid brass forging, pure quality</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ordered a batch of 50 units for commercial godowns in Kanpur. You can immediately feel the heavy brass weight. Shackle lockup is positive with zero play. Key turns like clockwork.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#878787] pt-1">
                  <span className="font-medium text-stone-800">Rajesh Hardware Mart, Kanpur</span>
                  <span>•</span>
                  <span className="text-[#388E3C] font-semibold">✓ Certified Hardware Stockist</span>
                  <span>•</span>
                  <span>2 weeks ago</span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#388E3C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">5 ★</span>
                  <span className="font-bold text-xs text-stone-900">Best shutter security locks in this price tier</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The case-hardened shackle cannot be cut by standard bolt cutters. Weather resistance is excellent even after heavy monsoons in Mumbai. Very reliable supplier from Aligarh.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#878787] pt-1">
                  <span className="font-medium text-stone-800">Mehta Building Supplies, Mumbai</span>
                  <span>•</span>
                  <span className="text-[#388E3C] font-semibold">✓ Verified B2B Buyer</span>
                  <span>•</span>
                  <span>1 month ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Products: Live API ProductGrid (Amazon Style "Customers Also Viewed") ── */}
        <section className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold text-[#212121]">
                Customers who viewed this item also viewed
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Explore complementary security locks from the {brandName} collection
              </p>
            </div>

            <Link
              href={`/brands/${brandSlug}`}
              className="text-xs font-semibold text-[#2874F0] hover:underline flex items-center gap-1"
            >
              <span>See more</span>
              <span>›</span>
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

      {/* ── Mobile Sticky Dual Actions Bar (Flipkart Style at bottom of screen) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/15 shadow-2xl p-2.5 flex items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-2 rounded-xl font-sans font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all truncate ${
            isAddedToCart
              ? "bg-emerald-600 text-white"
              : "bg-[#FF9F00] text-white active:bg-[#F39700]"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
          </svg>
          <span className="truncate">{isAddedToCart ? "Added" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-2 rounded-xl bg-[#FB641B] active:bg-[#E85D19] text-white font-sans font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all truncate"
        >
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l3-8z" />
          </svg>
          <span className="truncate">{isApprovedDistributor ? "Buy Now" : "Apply to Buy"}</span>
        </button>
      </div>
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
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F1F3F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#2874F0] border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Loading Lock Details...
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error && !product) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#F1F3F6] text-center">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="font-sans text-xl font-bold text-stone-900 mb-2">
            Failed to Load Product
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadProduct}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2874F0] text-white font-sans font-bold text-xs rounded-xl hover:bg-[#1258c7] transition-colors shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 text-stone-900 font-sans font-semibold text-xs rounded-xl hover:bg-stone-200 transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#F1F3F6] text-center">
        <div className="max-w-md w-full bg-white border border-black/[0.08] rounded-3xl p-8 sm:p-10 shadow-sm">
          <h1 className="font-sans text-2xl font-bold text-stone-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed mb-6">
            The lock model you requested could not be located in our factory catalog.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-[#2874F0] text-white font-sans font-bold text-xs rounded-xl"
          >
            Browse Full Catalog
          </Link>
        </div>
      </div>
    );
  }

  const brandThemeKey = product.brand?.themeKey || "nafi";

  return (
    <ThemeProvider themeKey={brandThemeKey}>
      <ProductDetailContent product={product} />
    </ThemeProvider>
  );
}

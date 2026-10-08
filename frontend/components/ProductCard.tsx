"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Product, likeProduct, unlikeProduct } from "@/lib/api";
import { getUser, isUserLoggedIn, getDistributorStatus } from "@/lib/userAuth";
import { useOrderCart } from "./OrderCartProvider";
import { getCategoryPlaceholder } from "./ProductGallery";

/**
 * Brand pill background & text color helper keyed on brand's themeKey
 * (Section 3.4 of Spec 11)
 */
export function getBrandPillColor(themeKey?: string | null): string {
  switch (themeKey) {
    case "nafi":
      return "bg-[#9A7228] text-white";
    case "greek":
      return "bg-[#235F8E] text-white";
    case "raksham":
      return "bg-[#9A2F24] text-white";
    default:
      return "bg-[#1C1917] text-white";
  }
}

export interface ProductCardProps {
  product: Product;
  isLiked?: boolean;
  onLikeToggle?: (productId: string, newLikedState: boolean) => void;
  isDistributorContext?: boolean;
  onToast?: (message: string) => void;
}

/**
 * ============================================================================
 * Component: ProductCard (Apple/Google Minimal Precision Design)
 * ============================================================================
 * Follows exact anatomy from Spec 11:
 * - Brand pill top-left, heart top-right
 * - Centered product image
 * - Centered bold product name (max 2 lines)
 * - Centered muted spec line (Material · Size)
 * - ₹ dealer price (approved distributors only; absent for guests/customers)
 * - Two equal-width buttons: [ Add to Cart ] [ View Details ]
 * - Optimized for 2-cards-per-row on mobile screens
 */
export default function ProductCard({
  product,
  isLiked: initialLiked = false,
  onLikeToggle,
  isDistributorContext = false,
  onToast,
}: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [showCustomerNotice, setShowCustomerNotice] = useState<boolean>(false);

  // Safe cart access
  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  // Determine user authorization state
  const loggedIn = isUserLoggedIn();
  const user = getUser();
  const isApprovedDistributor =
    isDistributorContext ||
    (loggedIn && user?.role === "DISTRIBUTOR" && getDistributorStatus() === "APPROVED") ||
    (product.dealerPrice !== undefined && product.dealerPrice !== null);

  // Fallback image handling
  const imageSrc =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : getCategoryPlaceholder(product.category?.slug, product.brand?.slug);

  // Spec line: "Material · Size" (omits missing/N/A values, absent if both empty)
  const specParts = [product.material, product.size].filter(
    (val) => val && val.trim().length > 0 && val.trim().toLowerCase() !== "n/a"
  );
  const specLine = specParts.join(" · ");

  // Handle Heart / Like click
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guest -> redirect to /login with return url
    if (!loggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const nextState = !liked;
    setLiked(nextState);
    if (onLikeToggle) {
      onLikeToggle(product.id, nextState);
    }

    try {
      if (nextState) {
        await likeProduct(product.id);
        if (onToast) onToast(`Saved ${product.name} to wishlist`);
      } else {
        await unlikeProduct(product.id);
        if (onToast) onToast(`Removed ${product.name} from wishlist`);
      }
    } catch (err) {
      console.warn("Failed to toggle product like", err);
      // revert on error
      setLiked(!nextState);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Add to Cart click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Guest -> redirect to /login
    if (!loggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    // 2. Customer (logged in non-distributor) -> show notice with link to /signup
    if (!isApprovedDistributor) {
      setShowCustomerNotice(true);
      return;
    }

    // 3. Approved distributor -> add minOrderQty to cart & trigger toast
    if (cart) {
      const minQty = product.minOrderQty || 1;
      cart.addItem({
        productId: product.id,
        name: product.name,
        modelCode: product.size || "Standard",
        image: imageSrc,
        unitPrice: Number(product.dealerPrice || 0),
        minOrderQty: minQty,
        quantity: minQty,
      });

      if (onToast) {
        onToast(`✓ Added "${product.name}" to Order Cart`);
      }
    }
  };

  return (
    <>
      <article className="group bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] hover:border-black/[0.14] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden relative select-none">
        <div>
          {/* ── Top Imagery Stage ── */}
          <div className="relative aspect-square w-full bg-[#FAF9F5] p-2.5 sm:p-3.5 flex items-center justify-center overflow-hidden border-b border-black/[0.04]">
            {/* Top-Left: Brand Pill */}
            <div className="absolute top-3.5 left-3.5 sm:top-4.5 sm:left-4.5 z-10 pointer-events-none">
              <span
                className={`text-[8.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shadow-2xs backdrop-blur-md ${getBrandPillColor(
                  product.brand?.themeKey
                )}`}
              >
                {product.brand?.name || "Nafi"}
              </span>
            </div>

            {/* Top-Right: Heart Button */}
            <button
              type="button"
              onClick={handleHeartClick}
              aria-label={liked ? "Saved to wishlist" : "Save to wishlist"}
              className="absolute top-3.5 right-3.5 sm:top-4.5 sm:right-4.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white active:scale-90 backdrop-blur-md border border-black/[0.08] flex items-center justify-center text-stone-400 hover:text-red-500 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <svg
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                  liked ? "text-red-500 fill-red-500 scale-110" : "text-stone-400 fill-none"
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

            {/* Centered Product Image in Sleek Rounded Canvas */}
            <Link
              href={`/products/${product.slug}`}
              className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-stone-900/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </Link>
          </div>

          {/* ── Centered Information Body ── */}
          <div className="p-3 sm:p-4 text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5">
            {/* Centered Product Name (max 2 lines) */}
            <h3 className="font-serif text-[13px] sm:text-[15px] font-bold text-gray-900 group-hover:text-[#A98048] transition-colors leading-snug line-clamp-2 min-h-[34px] sm:min-h-[40px] flex items-center justify-center">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Centered Muted Spec Line: Material · Size (absent if missing) */}
            {specLine ? (
              <p className="text-[10px] sm:text-[11.5px] text-stone-500 font-mono tracking-tight leading-none truncate max-w-full">
                {specLine}
              </p>
            ) : null}

            {/* Dealer Price (Approved Distributors only; completely absent for guests/customers) */}
            {isApprovedDistributor && product.dealerPrice !== undefined && product.dealerPrice !== null && (
              <p className="font-serif text-xs sm:text-sm font-bold text-[#A98048] pt-0.5 leading-none">
                ₹{Number(product.dealerPrice).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* ── Two Equal-Width Buttons: [ Add to Cart ][ View Details ] ── */}
        <div className="p-2.5 sm:p-4 pt-0 grid grid-cols-2 gap-1.5 sm:gap-2.5 w-full">
          {/* Add to Cart (Outlined button per reference) */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl border border-black/15 hover:border-black hover:bg-black/[0.03] active:scale-[0.96] text-[10px] sm:text-xs font-serif font-semibold text-gray-900 transition-all duration-200 text-center cursor-pointer truncate touch-manipulation"
          >
            Add to Cart
          </button>

          {/* View Details (Filled dark button per reference) */}
          <Link
            href={`/products/${product.slug}`}
            className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl bg-[#1C1917] hover:bg-black active:scale-[0.96] text-white text-[10px] sm:text-xs font-serif font-semibold transition-all duration-200 text-center cursor-pointer truncate touch-manipulation shadow-2xs hover:shadow-xs flex items-center justify-center"
          >
            View Details
          </Link>
        </div>
      </article>

      {/* ── Customer Notice Modal (Section 3.3 of Spec 11) ── */}
      {showCustomerNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCustomerNotice(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-black/[0.08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
              Distributor Portal Notice
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Ordering is for approved distributors. To access factory wholesale orders and dealer pricing, apply for an authorized dealership.
            </p>
            <div className="space-y-2">
              <Link
                href="/signup"
                onClick={() => setShowCustomerNotice(false)}
                className="block w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-serif font-bold transition-all shadow-xs"
              >
                Apply as a distributor →
              </Link>
              <button
                type="button"
                onClick={() => setShowCustomerNotice(false)}
                className="w-full py-2 px-4 rounded-xl text-xs font-serif font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrderCart } from "./OrderCartProvider";
import { likeProduct, unlikeProduct } from "@/lib/api";
import { isUserLoggedIn } from "@/lib/userAuth";
import { getCategoryPlaceholder } from "./ProductGallery";

interface ProductCardProps {
  id?: string;
  slug?: string;
  name: string;
  brand?: string;
  category?: string;
  material: string;
  size: string;
  finish: string;
  image: string;
  dealerPrice?: number | null;
  minOrderQty?: number | null;
  isDistributorContext?: boolean;
}

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  category,
  material,
  size,
  finish,
  image,
  dealerPrice,
  minOrderQty = 1,
  isDistributorContext,
}: ProductCardProps) {
  const pathname = usePathname();
  const isDistributor = isDistributorContext || pathname?.startsWith("/distributor");
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(minOrderQty || 1);

  // Safe access to cart context (only when inside OrderCartProvider)
  let cart: ReturnType<typeof useOrderCart> | null = null;
  try {
    cart = useOrderCart();
  } catch {
    cart = null;
  }

  const handleLike = async () => {
    if (!id || !isUserLoggedIn()) return;
    try {
      if (isLiked) {
        await unlikeProduct(id);
        setIsLiked(false);
      } else {
        await likeProduct(id);
        setIsLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToOrder = () => {
    if (!id || !cart) return;
    cart.addItem({
      productId: id,
      name,
      modelCode: size,
      image,
      unitPrice: Number(dealerPrice || 0),
      minOrderQty: minOrderQty || 1,
      quantity,
    });
  };

  return (
    <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Imagery Stage */}
        <div className="aspect-square bg-background flex items-center justify-center p-6 border-b border-divider relative">
          <Image
            src={image || getCategoryPlaceholder(category, brand)}
            alt={name}
            width={200}
            height={200}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Like Button (Always functional for logged-in users) */}
          {id && (
            <button
              type="button"
              onClick={handleLike}
              className={`absolute top-3 right-3 p-2 rounded-full bg-surface/90 backdrop-blur-xs border border-divider transition-colors shadow-xs ${
                isLiked ? "text-red-500" : "text-muted hover:text-red-500"
              }`}
              title={isLiked ? "Saved" : "Save Lock"}
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
          )}
        </div>

        {/* Specs */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            {brand && (
              <span className="text-[10px] font-mono uppercase tracking-wider bg-background border border-divider rounded px-2 py-0.5 text-accent font-semibold">
                {brand}
              </span>
            )}
            {category && (
              <span className="text-[10px] font-mono text-muted">
                {category}
              </span>
            )}
          </div>

          <h3 className="font-serif font-bold text-sm text-primary mb-1 line-clamp-1">
            {name}
          </h3>

          <div className="text-xs text-muted font-mono space-y-0.5 mt-2">
            <p>
              {material} · {size}
            </p>
            <p>{finish}</p>
          </div>

          {/* Distributor Pricing & MOQ block */}
          {isDistributor && dealerPrice !== undefined && dealerPrice !== null && (
            <div className="mt-3 pt-3 border-t border-divider/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-muted uppercase block">
                  DEALER PRICE
                </span>
                <span className="font-mono text-sm font-bold text-accent">
                  ₹{Number(dealerPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-muted uppercase block">
                  MIN. BATCH
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  {minOrderQty} pcs
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Additive View Details button + (if distributor) Add to Order */}
      <div className="p-4 pt-0 space-y-2">
        <Link
          href={`/products/${slug || id}`}
          className="w-full py-2 px-3 rounded-xl border border-divider bg-background hover:bg-surface text-primary text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-accent/60 text-center"
        >
          <span>View Details</span>
          <span className="text-[11px] text-muted group-hover:text-accent transition-colors">→</span>
        </Link>

        {isDistributor && dealerPrice !== undefined && dealerPrice !== null && cart && (
          <button
            type="button"
            onClick={handleAddToOrder}
            className="w-full py-2 bg-accent text-background rounded-xl font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add to Order Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}

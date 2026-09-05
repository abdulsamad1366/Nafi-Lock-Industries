"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, ShoppingBag, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart, CartItemProduct } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    description: string;
    basePrice: number;
    dealerPrice: number;
    stock: number;
    finish: string;
    images: string; // JSON string or array
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isDealer, loginAs } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Parse images securely
  let imageUrl = "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800";
  try {
    const parsed = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageUrl = parsed[0];
    }
  } catch (e) {
    // fallback
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        basePrice: product.basePrice,
        dealerPrice: product.dealerPrice,
        finish: product.finish,
        images: product.images,
        stock: product.stock,
      },
      1,
      product.finish
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white hairline-border hover:border-brass-600 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <Link href={`/products/${product.id}`} className="block relative">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span className="bg-graphite-900 text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase">
            SKU: {product.sku}
          </span>
          {product.stock <= 50 && (
            <span className="bg-signal-red text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold">
              Stock: {product.stock} units
            </span>
          )}
        </div>

        {/* Product Macro Photo */}
        <div className="relative w-full h-56 bg-steel-50 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-[1.04]"
          />
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono text-steel-500 uppercase mb-1">
            Finish: <span className="text-graphite-900 font-semibold">{product.finish}</span>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-space font-bold text-base text-graphite-900 group-hover:text-brass-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-steel-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Dealer Pricing Box */}
        <div className="mt-5 pt-4 border-t border-steel-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-steel-500 uppercase block">RETAIL PRICE</span>
              <span className="font-space font-bold text-lg text-graphite-900">
                ₹{product.basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Dealer Pricing Lock / Active Badge */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-brass-600 uppercase block font-semibold">
                DEALER RATE
              </span>
              {isDealer ? (
                <span className="font-space font-bold text-base text-brass-600">
                  ₹{product.dealerPrice.toLocaleString("en-IN")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    loginAs("dealer");
                  }}
                  className="group/lock flex items-center gap-1 text-xs text-steel-500 hover:text-brass-600 font-mono transition-colors"
                  title="Click to switch persona to Approved Dealer"
                >
                  <Lock className="w-3 h-3 text-steel-400 group-hover/lock:text-brass-600" />
                  <span className="blur-[3px] select-none text-graphite-900 font-bold">₹1,250</span>
                  <span className="text-[9px] underline text-brass-600 ml-1">Unlock</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              className={`py-2 px-3 text-xs font-space font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                added
                  ? "bg-emerald-700 text-white"
                  : "bg-graphite-900 hover:bg-graphite-800 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-brass-500" /> Add to Cart
                </>
              )}
            </button>

            <Link
              href={`/products/${product.id}`}
              className="py-2 px-3 text-xs font-space font-semibold bg-steel-100 hover:bg-steel-300/40 text-graphite-900 rounded-sm flex items-center justify-center gap-1 transition-colors"
            >
              Specs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

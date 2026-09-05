"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Lock,
  ShieldCheck,
  Check,
  ChevronRight,
  Info,
  Building2,
  Share2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart, CartItemProduct } from "@/context/CartContext";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    sku: string;
    description: string;
    basePrice: number;
    dealerPrice: number;
    stock: number;
    finish: string;
    images: string;
    specs: string;
    category?: {
      name: string;
      slug: string;
    };
  };
}

const AVAILABLE_FINISHES = [
  { name: "Brushed Brass", colorHex: "#A9793F" },
  { name: "Satin Chrome", colorHex: "#9E9E9E" },
  { name: "Antique Bronze", colorHex: "#4E3629" },
  { name: "Matte Black", colorHex: "#1B1D1F" },
];

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { isDealer, loginAs } = useAuth();
  const { addToCart } = useCart();
  const [selectedFinish, setSelectedFinish] = useState(product.finish || "Brushed Brass");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Parse images securely
  let imagesList: string[] = [];
  try {
    const parsed = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    if (Array.isArray(parsed)) imagesList = parsed;
  } catch (e) {
    imagesList = ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"];
  }
  if (imagesList.length === 0) {
    imagesList = ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"];
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Parse specs JSON
  let specsObj: Record<string, string> = {};
  try {
    specsObj = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;
  } catch (e) {
    specsObj = {
      Material: "Forged Solid Brass",
      Warranty: "10 Years Mechanical",
    };
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        basePrice: product.basePrice,
        dealerPrice: product.dealerPrice,
        finish: selectedFinish,
        images: product.images,
        stock: product.stock,
      },
      quantity,
      selectedFinish
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const buildSingleWhatsAppUrl = () => {
    const phone = "919876543210";
    const priceText = isDealer ? `₹${product.dealerPrice} (Dealer Rate)` : `₹${product.basePrice}`;
    const text = `Hello NAFI Lock Industries,\n\nI am inquiring about the following product:\nProduct: ${product.name}\nSKU: ${product.sku}\nSelected Finish: ${selectedFinish}\nQuantity: ${quantity}\nRate: ${priceText}\n\nPlease confirm availability and dispatch schedule.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column — Macro Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative w-full h-[420px] sm:h-[500px] bg-white hairline-border overflow-hidden">
          <Image
            src={imagesList[activeImageIndex] || imagesList[0]}
            alt={product.name}
            fill
            priority
            className="object-cover object-center filter contrast-[1.05]"
          />
          <div className="absolute top-4 left-4 bg-graphite-900 text-white font-mono text-xs px-2.5 py-1 rounded">
            SKU: {product.sku}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {imagesList.length > 1 && (
          <div className="flex items-center gap-3">
            {imagesList.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 bg-white hairline-border overflow-hidden rounded ${
                  activeImageIndex === idx ? "ring-2 ring-brass-600" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={imgUrl} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Quick Engineering Badges */}
        <div className="bg-white hairline-border p-4 grid grid-cols-2 gap-4 text-xs font-mono text-steel-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brass-600 shrink-0" />
            <span>ISO 9001:2015 Quality Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brass-600 shrink-0" />
            <span>Tolerance: ±0.02mm Precision</span>
          </div>
        </div>
      </div>

      {/* Right Column — Spec Sheet & Pricing & Actions */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-steel-500 uppercase mb-2">
            <span className="bg-steel-100 text-graphite-900 px-2 py-0.5 rounded font-semibold">
              {product.category?.name || "Hardware"}
            </span>
            <span>•</span>
            <span className={product.stock > 0 ? "text-emerald-700 font-semibold" : "text-signal-red"}>
              In Stock ({product.stock} units)
            </span>
          </div>

          <h1 className="font-space font-bold text-2xl sm:text-3xl text-graphite-900 mb-3 leading-tight">
            {product.name}
          </h1>

          <p className="font-inter text-steel-500 text-sm leading-relaxed mb-6">
            {product.description}
          </p>
        </div>

        {/* Price & Dealer Pricing Panel */}
        <div className="bg-white hairline-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-steel-100">
            <div>
              <span className="text-[11px] font-mono text-steel-500 uppercase block">RETAIL PRICE (INCL. TAX)</span>
              <span className="font-space font-bold text-3xl text-graphite-900">
                ₹{product.basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Wholesale Pricing Status */}
            <div className="text-right">
              <span className="text-[11px] font-mono text-brass-600 uppercase block font-semibold">
                DEALER RATE
              </span>
              {isDealer ? (
                <div>
                  <span className="font-space font-bold text-2xl text-brass-600">
                    ₹{product.dealerPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-mono bg-brass-600/20 text-brass-600 px-1.5 py-0.5 rounded block mt-0.5">
                    Save ₹{(product.basePrice - product.dealerPrice).toLocaleString("en-IN")} / unit
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-steel-400" />
                    <span className="blur-[3px] font-space font-bold text-lg text-graphite-900 select-none">
                      ₹1,250
                    </span>
                  </div>
                  <button
                    onClick={() => loginAs("dealer")}
                    className="text-[11px] font-mono text-brass-600 underline hover:text-brass-700 mt-0.5"
                  >
                    Sign in as Dealer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Finish Selector */}
          <div>
            <label className="text-xs font-mono font-semibold text-graphite-900 uppercase block mb-2">
              Select Metallic Finish: <span className="text-brass-600">{selectedFinish}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_FINISHES.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFinish(f.name)}
                  className={`py-2 px-3 text-xs font-mono rounded border flex items-center gap-2 transition-all ${
                    selectedFinish === f.name
                      ? "border-brass-600 bg-brass-600/10 text-graphite-900 font-semibold"
                      : "border-steel-100 bg-paper-50 text-steel-500 hover:border-steel-300"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-steel-300 shrink-0"
                    style={{ backgroundColor: f.colorHex }}
                  />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Main Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex items-center border border-steel-300 rounded bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-graphite-900 font-bold hover:bg-steel-100 text-sm"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-mono font-semibold text-graphite-900 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-graphite-900 font-bold hover:bg-steel-100 text-sm"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 font-space font-semibold text-sm rounded-sm flex items-center justify-center gap-2 transition-colors ${
                added
                  ? "bg-emerald-700 text-white"
                  : "bg-graphite-900 hover:bg-graphite-800 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-brass-500" /> Add to Cart
                </>
              )}
            </button>

            <a
              href={buildSingleWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-space font-semibold text-sm rounded-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
            </a>
          </div>
        </div>

        {/* Technical Spec Sheet Table */}
        <div className="bg-white hairline-border p-6">
          <h3 className="font-space font-bold text-lg text-graphite-900 mb-4 pb-2 border-b border-steel-100 flex items-center justify-between">
            <span>Technical Spec Sheet</span>
            <span className="text-xs font-mono font-normal text-steel-500 uppercase">PRECISION METRICS</span>
          </h3>

          <div className="divide-y divide-steel-100 text-xs">
            {Object.entries(specsObj).map(([key, value]) => (
              <div key={key} className="py-2.5 grid grid-cols-12 gap-4">
                <span className="col-span-5 font-mono text-steel-500">{key}</span>
                <span className="col-span-7 font-inter font-semibold text-graphite-900">{value}</span>
              </div>
            ))}
            <div className="py-2.5 grid grid-cols-12 gap-4">
              <span className="col-span-5 font-mono text-steel-500">Standard Finish</span>
              <span className="col-span-7 font-inter font-semibold text-graphite-900">{selectedFinish}</span>
            </div>
            <div className="py-2.5 grid grid-cols-12 gap-4">
              <span className="col-span-5 font-mono text-steel-500">Dispatches From</span>
              <span className="col-span-7 font-inter font-semibold text-graphite-900">Factory Warehouse (24-48 Hours)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

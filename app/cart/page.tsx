"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = RouterHook();
  const { isDealer, role, loginAs } = useAuth();
  const { cart, removeFromCart, updateQty, clearCart, getTotals, buildWhatsAppInquiryUrl } = useCart();
  const [customNote, setCustomNote] = useState("");

  const { subtotal, total, savings } = getTotals(isDealer);

  let parsedImages: Record<string, string> = {};
  cart.forEach((item) => {
    try {
      const parsed = typeof item.product.images === "string" ? JSON.parse(item.product.images) : item.product.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedImages[item.product.id] = parsed[0];
      }
    } catch (e) {
      parsedImages[item.product.id] = "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800";
    }
  });

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8">
          <span className="font-mono text-xs text-steel-500 uppercase tracking-widest block mb-1">
            PURCHASE REQUISITION
          </span>
          <h1 className="font-space font-bold text-3xl text-graphite-900 flex items-center gap-3">
            <span>Shopping Cart</span>
            {isDealer && (
              <span className="text-xs font-mono bg-brass-600/20 text-brass-600 border border-brass-600/40 px-2.5 py-1 rounded">
                DEALER WHOLESALE RATES APPLIED
              </span>
            )}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white hairline-border p-12 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-4 text-steel-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="font-space font-bold text-xl text-graphite-900 mb-2">Your cart is empty</h2>
            <p className="text-xs text-steel-500 leading-relaxed mb-6">
              Browse our architectural hardware catalog to add mortise lock cylinders, lever handles, or concealed hinges.
            </p>
            <Link
              href="/"
              className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-6 py-3 rounded-sm inline-flex items-center gap-2 text-xs tracking-wide transition-colors"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white hairline-border divide-y divide-steel-100">
                <div className="p-4 bg-steel-100/50 hidden sm:grid grid-cols-12 gap-4 text-xs font-mono text-steel-500 uppercase">
                  <div className="col-span-6">PRODUCT SPECIFICATION</div>
                  <div className="col-span-2 text-center">RATE</div>
                  <div className="col-span-2 text-center">QTY</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>

                {cart.map((item) => {
                  const unitPrice = isDealer ? item.product.dealerPrice : item.product.basePrice;
                  const itemTotal = unitPrice * item.qty;
                  const imgUrl = parsedImages[item.product.id] || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800";

                  return (
                    <div key={`${item.product.id}-${item.finish}`} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product Detail */}
                      <div className="sm:col-span-6 flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-steel-50 hairline-border shrink-0 overflow-hidden">
                          <Image src={imgUrl} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-steel-400 block">SKU: {item.product.sku}</span>
                          <h3 className="font-space font-bold text-sm text-graphite-900 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <span className="text-xs text-steel-500 font-mono">
                            Finish: <span className="text-graphite-900 font-semibold">{item.finish}</span>
                          </span>
                        </div>
                      </div>

                      {/* Rate */}
                      <div className="sm:col-span-2 text-left sm:text-center">
                        <span className="sm:hidden text-xs font-mono text-steel-400 mr-2">Rate:</span>
                        <span className="font-mono text-sm font-semibold text-graphite-900">
                          ₹{unitPrice.toLocaleString("en-IN")}
                        </span>
                        {isDealer && (
                          <span className="block text-[9px] font-mono text-brass-600 line-through">
                            ₹{item.product.basePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Qty Counter */}
                      <div className="sm:col-span-2 flex items-center justify-start sm:justify-center gap-1">
                        <button
                          onClick={() => updateQty(item.product.id, item.finish, item.qty - 1)}
                          className="w-7 h-7 bg-steel-100 hover:bg-steel-300/60 rounded flex items-center justify-center text-graphite-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.finish, item.qty + 1)}
                          className="w-7 h-7 bg-steel-100 hover:bg-steel-300/60 rounded flex items-center justify-center text-graphite-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total & Remove */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-right">
                          <span className="font-space font-bold text-base text-graphite-900">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.finish)}
                          className="text-steel-400 hover:text-signal-red transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Order / Inquiry Note */}
              <div className="bg-white hairline-border p-4">
                <label className="text-xs font-mono font-semibold text-graphite-900 uppercase block mb-1">
                  PO / Special Project Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Specify keying preferences (e.g. Master Keyed alike, custom backset, site contact details)..."
                  className="w-full text-xs p-3 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                ></textarea>
              </div>
            </div>

            {/* Order Summary & Checkout Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white hairline-border p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-graphite-900 pb-3 border-b border-steel-100">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-steel-500">
                    <span>Subtotal (Standard MRP)</span>
                    <span className="font-semibold text-graphite-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {isDealer && savings > 0 && (
                    <div className="flex items-center justify-between text-brass-600 font-semibold bg-brass-600/10 p-2 rounded">
                      <span>Wholesale Dealer Discount</span>
                      <span>-₹{savings.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-steel-500">
                    <span>Tax (GST 18% Included)</span>
                    <span className="text-emerald-700 font-semibold">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-steel-500">
                    <span>Dispatch Freight</span>
                    <span className="text-emerald-700 font-semibold">Calculated at Checkout</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-steel-100 flex items-baseline justify-between">
                  <span className="font-space font-bold text-base text-graphite-900">ESTIMATED TOTAL</span>
                  <span className="font-space font-bold text-2xl text-graphite-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                {!isDealer && (
                  <div className="bg-steel-100/60 p-3 rounded text-[11px] text-steel-600 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-brass-600 shrink-0 mt-0.5" />
                    <div>
                      Dealers get up to 38% off.{" "}
                      <button
                        onClick={() => loginAs("dealer")}
                        className="text-brass-600 font-semibold underline"
                      >
                        Sign in as Dealer
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-graphite-900 hover:bg-graphite-800 text-white font-space font-semibold py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-xs tracking-wide transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-brass-500" /> Proceed to Online Checkout
                  </Link>

                  <a
                    href={buildWhatsAppInquiryUrl(isDealer, customNote)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-space font-semibold py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-xs tracking-wide transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Send WhatsApp PO Inquiry
                  </a>
                </div>
              </div>

              <div className="bg-white hairline-border p-4 text-xs font-mono text-steel-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brass-600" />
                  <span>Factory Direct Dispatch Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brass-600" />
                  <span>GST Tax Credit Compliant Invoice</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Router hook safe fallback helper
function RouterHook() {
  try {
    return useRouter();
  } catch (e) {
    return { push: () => {} };
  }
}

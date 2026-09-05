"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isDealer } = useAuth();
  const { cart, getTotals, clearCart, buildWhatsAppInquiryUrl } = useCart();

  const { subtotal, total, savings } = getTotals(isDealer);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    gstin: user?.gstin || "",
    address: "123 Commercial Avenue, Industrial Zone",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    paymentMethod: "razorpay",
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-paper-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white hairline-border p-10 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="font-mono text-xs text-brass-600 uppercase font-semibold block mb-1">
                ORDER #NFL-88492 CONFIRMED
              </span>
              <h1 className="font-space font-bold text-2xl text-graphite-900">
                Payment Received & Dispatched to Factory
              </h1>
              <p className="text-xs text-steel-500 mt-2 leading-relaxed">
                Thank you for your order with NAFI Lock Industries. A tax invoice with GST details has been emailed to <span className="font-semibold text-graphite-900">{formData.email}</span>.
              </p>
            </div>

            <div className="bg-steel-100/60 p-4 text-xs font-mono text-steel-600 text-left space-y-1">
              <div>Shipping to: {formData.address}, {formData.city} - {formData.pincode}</div>
              <div>Estimated Delivery: 2-4 Business Days via Factory Express</div>
            </div>

            <Link
              href="/"
              className="inline-block bg-graphite-900 hover:bg-graphite-800 text-white font-space font-semibold px-6 py-3 rounded-sm text-xs transition-colors"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-steel-500 hover:text-graphite-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <span className="text-xs font-mono text-steel-400">Checkout / Secured SSL Gateway</span>
        </div>

        <div className="mb-8">
          <h1 className="font-space font-bold text-3xl text-graphite-900">Checkout & Payment</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white hairline-border p-8 text-center">
            <p className="text-xs font-mono text-steel-500 mb-4">No items in cart for checkout.</p>
            <Link href="/" className="text-xs font-space text-brass-600 font-semibold underline">
              Return to catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleOnlinePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column — Shipping & Customer Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white hairline-border p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-graphite-900 pb-2 border-b border-steel-100 flex items-center justify-between">
                  <span>Customer & Shipping Details</span>
                  {isDealer && (
                    <span className="text-xs font-mono text-brass-600 bg-brass-600/10 px-2 py-0.5 rounded">
                      DEALER ACCOUNT
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">GSTIN (Optional for Retail)</label>
                    <input
                      type="text"
                      name="gstin"
                      placeholder="e.g. 27AAACH1234F1Z9"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-mono uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Factory Shipping Address</label>
                    <textarea
                      rows={2}
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-inter"
                    />
                  </div>

                  <div>
                    <label className="font-mono font-semibold text-steel-500 block mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-steel-300 rounded focus:border-brass-600 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white hairline-border p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-graphite-900 pb-2 border-b border-steel-100">
                  Select Payment Method
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "razorpay" })}
                    className={`p-4 hairline-border rounded flex items-center justify-between cursor-pointer transition-colors ${
                      formData.paymentMethod === "razorpay"
                        ? "border-brass-600 bg-brass-600/10"
                        : "bg-paper-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === "razorpay"}
                        onChange={() => {}}
                        className="text-brass-600"
                      />
                      <div>
                        <div className="font-space font-bold text-sm text-graphite-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brass-600" /> Razorpay Secured Checkout
                        </div>
                        <p className="text-xs text-steel-500 mt-0.5">
                          Credit/Debit Cards, UPI (GPay, PhonePe), NetBanking, EMI
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-graphite-900 text-white px-2 py-0.5 rounded">
                      INSTANT DISPATCH
                    </span>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "po_inquiry" })}
                    className={`p-4 hairline-border rounded flex items-center justify-between cursor-pointer transition-colors ${
                      formData.paymentMethod === "po_inquiry"
                        ? "border-brass-600 bg-brass-600/10"
                        : "bg-paper-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === "po_inquiry"}
                        onChange={() => {}}
                        className="text-brass-600"
                      />
                      <div>
                        <div className="font-space font-bold text-sm text-graphite-900 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" /> Send Proforma Invoice Inquiry
                        </div>
                        <p className="text-xs text-steel-500 mt-0.5">
                          Generate official quote for PO approval & bank wire transfer
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-700 text-white px-2 py-0.5 rounded">
                      B2B FAVORITE
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column — Summary & Submission */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white hairline-border p-6 space-y-4">
                <h3 className="font-space font-bold text-lg text-graphite-900 pb-3 border-b border-steel-100">
                  Items ({cart.length})
                </h3>

                <div className="divide-y divide-steel-100 max-h-60 overflow-y-auto pr-1 text-xs">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.finish}`} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-graphite-900 block">{item.product.name}</span>
                        <span className="font-mono text-steel-400">
                          {item.finish} • Qty: {item.qty}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-graphite-900">
                        ₹{((isDealer ? item.product.dealerPrice : item.product.basePrice) * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-steel-100 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-steel-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {isDealer && savings > 0 && (
                    <div className="flex items-center justify-between text-brass-600">
                      <span>Dealer Discount</span>
                      <span>-₹{savings.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-graphite-900 font-bold text-base pt-2 border-t border-steel-100">
                    <span>TOTAL PAYABLE</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {formData.paymentMethod === "razorpay" ? (
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold py-4 px-4 rounded-sm flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    {processing ? (
                      "Connecting to Razorpay..."
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString("en-IN")} via Razorpay
                      </>
                    )}
                  </button>
                ) : (
                  <a
                    href={buildWhatsAppInquiryUrl(isDealer, `PO Request from ${formData.name} (${formData.companyName})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-space font-semibold py-4 px-4 rounded-sm flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Send WhatsApp Proforma PO
                  </a>
                )}
              </div>

              <div className="bg-white hairline-border p-4 text-xs font-mono text-steel-500 space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brass-600" />
                  <span>Encrypted 256-Bit SSL Payment Processing</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

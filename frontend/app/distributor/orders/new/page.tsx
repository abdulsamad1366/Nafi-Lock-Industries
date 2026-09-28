"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOrderCart } from "@/components/OrderCartProvider";
import { createOrder, Order } from "@/lib/api";

export default function NewOrderPage() {
  const router = useRouter();
  const { items, subtotal, itemCount, clearCart, removeItem, updateQuantity } = useOrderCart();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        notes: notes || undefined,
      };

      const result = await createOrder(orderPayload);
      clearCart();
      setPlacedOrder(result);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please review item quantities.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="bg-surface border border-accent/30 rounded-3xl p-6 sm:p-10 text-center max-w-xl mx-auto my-4 sm:my-8 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center mb-4">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold block mb-1">
          Purchase Order Placed
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
          {placedOrder.orderNumber}
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto mb-6 leading-relaxed">
          Order submitted to factory dispatch queue. Your assigned sales executive will confirm freight details.
        </p>

        <div className="bg-background border border-divider rounded-2xl p-4 mb-6 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">PO Number</span>
            <span className="font-mono font-bold text-primary">{placedOrder.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Status</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {placedOrder.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Items</span>
            <span className="font-mono font-bold text-primary">{placedOrder.items?.length || 0} Models</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/distributor/orders"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-sm flex items-center justify-center touch-manipulation"
          >
            View Orders →
          </Link>
          <Link
            href="/#catalog"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors flex items-center justify-center touch-manipulation"
          >
            Continue Ordering
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface border border-divider rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-primary mb-1">
          Your Order Cart is Empty
        </h2>
        <p className="text-xs text-muted max-w-xs mx-auto mb-5">
          Select lock products from the catalog to build your wholesale order batch.
        </p>
        <Link
          href="/#catalog"
          className="min-h-[42px] px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs inline-flex items-center justify-center touch-manipulation"
        >
          Browse Hardware Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Review Wholesale Order
          </h2>
          <p className="text-xs text-muted">
            Confirm item quantities and dispatch notes before placing PO.
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          {itemCount} Units
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Itemized Table */}
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <div className="p-3 sm:p-4 border-b border-divider bg-background/50 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
              Line Items ({items.length})
            </span>
            <span className="text-xs text-muted font-mono">{itemCount} Total Pcs</span>
          </div>

          <div className="divide-y divide-divider">
            {items.map((item) => (
              <div
                key={item.productId}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-background border border-divider rounded-xl flex items-center justify-center p-1.5 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-muted">LOCK</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-primary truncate">
                      {item.name}
                    </h4>
                    {item.modelCode && (
                      <span className="text-[10px] font-mono text-muted block">
                        Size: {item.modelCode}
                      </span>
                    )}
                    <span className="text-xs font-mono text-accent font-semibold">
                      ₹{item.unitPrice.toLocaleString("en-IN")} / pc
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 bg-background/50 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-divider/40">
                  <div className="flex items-center border border-divider rounded-xl overflow-hidden bg-background">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(item.minOrderQty, item.quantity - 1)
                        )
                      }
                      disabled={item.quantity <= item.minOrderQty}
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-primary transition-colors disabled:opacity-30 touch-manipulation cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 sm:w-12 text-center text-xs font-mono font-bold text-primary">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-primary transition-colors touch-manipulation cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[75px] sm:min-w-[90px]">
                    <span className="font-mono text-xs sm:text-sm font-bold text-primary">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-muted hover:text-rose-500 transition-colors touch-manipulation cursor-pointer"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Notes */}
        <div className="bg-surface border border-divider rounded-2xl p-3.5 sm:p-5">
          <label className="block text-xs font-serif font-bold text-primary mb-1.5">
            Transport & Dispatch Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Booking via SafeXpress Transport, Aligarh depot. Box stencil required."
            className="w-full bg-background border border-divider rounded-xl p-3 text-xs text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
          />
        </div>

        {/* Order Summary & Submit Bar */}
        <div className="bg-surface border border-divider rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-muted block">Order Total</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-3xl font-bold text-accent">
                ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted">({itemCount} pcs)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Link
              href="/#catalog"
              className="min-h-[44px] px-5 py-2.5 border border-divider rounded-full font-serif font-medium text-xs text-primary hover:bg-background transition-colors text-center flex items-center justify-center touch-manipulation"
            >
              Add More Locks
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-8 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-md disabled:opacity-50 text-center cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? "Placing Order..." : "Confirm & Place Order →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

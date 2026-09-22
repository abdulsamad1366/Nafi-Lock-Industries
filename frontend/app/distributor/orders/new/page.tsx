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
      <div className="bg-surface border border-accent/30 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center mb-6">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block mb-1">
          PURCHASE ORDER PLACED
        </span>
        <h2 className="font-serif text-3xl font-bold text-primary mb-2">
          Order {placedOrder.orderNumber}
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mb-8 leading-relaxed">
          Your wholesale order has been submitted directly to the Aligarh factory dispatch queue. An official commercial invoice and logistics tracking will be shared by your assigned representative.
        </p>

        <div className="bg-background border border-divider rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Order Identifier</span>
            <span className="font-mono font-bold text-primary">{placedOrder.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              {placedOrder.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Total Line Items</span>
            <span className="font-mono font-bold text-primary">{placedOrder.items?.length || 0} Products</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/distributor/orders"
            className="w-full sm:w-auto px-6 py-3 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-md"
          >
            View All Orders →
          </Link>
          <Link
            href="/distributor/catalog"
            className="w-full sm:w-auto px-6 py-3 bg-background border border-divider rounded-full font-serif font-medium text-xs text-primary hover:border-accent transition-colors"
          >
            Continue Ordering
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Your Order Cart is Empty
        </h2>
        <p className="text-xs text-muted max-w-sm mx-auto mb-6">
          Add hardware line items from the dealer catalog before proceeding to order checkout.
        </p>
        <Link
          href="/distributor/catalog"
          className="px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
        >
          Open Dealer Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-primary">
          Review & Confirm Wholesale Order
        </h2>
        <p className="text-xs text-muted">
          Verify product quantities, minimum batch commitments, and dispatch notes
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Itemized Table */}
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-divider bg-background/50 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
              Itemized Line Items ({items.length})
            </span>
            <span className="text-xs text-muted font-mono">{itemCount} Total Units</span>
          </div>

          <div className="divide-y divide-divider">
            {items.map((item) => (
              <div
                key={item.productId}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-background border border-divider rounded-xl flex items-center justify-center p-2 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs font-mono text-muted">LOCK</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-primary">
                      {item.name}
                    </h4>
                    {item.modelCode && (
                      <span className="text-[10px] font-mono text-muted block">
                        Size: {item.modelCode}
                      </span>
                    )}
                    <span className="text-xs font-mono text-accent font-semibold">
                      ₹{item.unitPrice.toLocaleString("en-IN")} / unit
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end">
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
                      className="px-2.5 py-1.5 text-xs text-muted hover:text-primary transition-colors disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-xs font-mono font-bold text-primary">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2.5 py-1.5 text-xs text-muted hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="font-mono text-sm font-bold text-primary">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors"
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
        <div className="bg-surface border border-divider rounded-2xl p-6">
          <label className="block text-xs font-serif font-bold text-primary uppercase tracking-wider mb-2">
            Special Instructions / Transport Preference
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Please dispatch via SafeXpress Transport, Aligarh booking depot. Box labels require Sharma Hardware marking."
            className="w-full bg-background border border-divider rounded-xl p-3.5 text-xs text-primary placeholder:text-muted focus:outline-hidden focus:border-accent"
          />
        </div>

        {/* Order Summary Card & Submit */}
        <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs text-muted block mb-1">Estimated Purchase Order Total</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-accent">
                ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-muted">({itemCount} total units)</span>
            </div>
            <p className="text-[11px] text-muted mt-1">
              * Official B2B GST tax invoice generated upon factory order confirmation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/distributor/catalog"
              className="px-5 py-3 border border-divider rounded-full font-serif font-medium text-xs text-primary hover:bg-background transition-colors"
            >
              Add More Products
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Placing Purchase Order..." : "Confirm & Place Order →"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

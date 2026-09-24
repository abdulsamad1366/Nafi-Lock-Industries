"use client";

import Image from "next/image";
import Link from "next/link";
import { useOrderCart } from "./OrderCartProvider";

export default function OrderCartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
  } = useOrderCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-divider shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-divider flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-primary">
                  Distributor Order Cart
                </h2>
                <p className="text-[11px] sm:text-xs text-muted">
                  {itemCount} units across {items.length} product line(s)
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-muted hover:text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors touch-manipulation"
              aria-label="Close cart"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-lg text-primary mb-1">
                  Order Cart is Empty
                </h3>
                <p className="text-xs text-muted max-w-xs mx-auto mb-6">
                  Select products from the B2B catalog with verified dealer pricing and minimum order quantities.
                </p>
                <Link
                  href="/distributor/catalog"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-full font-medium text-xs hover:bg-accent-hover transition-colors"
                >
                  Browse Dealer Catalog
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-background border border-divider rounded-xl p-3.5 sm:p-4 flex gap-3 sm:gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface rounded-lg border border-divider flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-muted text-xs font-mono">NAFI</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-primary truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 -mr-1 text-muted hover:text-red-500 transition-colors touch-manipulation"
                          title="Remove item"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {item.modelCode && (
                        <span className="font-mono text-[10px] text-muted tracking-wider uppercase block">
                          CODE: {item.modelCode}
                        </span>
                      )}

                      <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-accent">
                          ₹{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-muted">/ unit</span>
                      </div>
                    </div>

                    {/* Quantity Selector with minOrderQty compliance */}
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-divider/60">
                      <div className="flex items-center border border-divider rounded-lg overflow-hidden bg-surface">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(item.minOrderQty, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= item.minOrderQty}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={item.minOrderQty}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              updateQuantity(item.productId, Math.max(item.minOrderQty, val));
                            }
                          }}
                          className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs font-mono font-bold bg-transparent text-primary focus:outline-hidden py-1"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors touch-manipulation"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] sm:text-[10px] text-muted block">
                          MOQ: {item.minOrderQty}
                        </span>
                        <span className="font-mono text-xs font-bold text-primary">
                          ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-divider bg-background/50 space-y-3 sm:space-y-4 shrink-0 pb-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted">Estimated Subtotal</span>
                <span className="font-mono text-base sm:text-lg font-bold text-primary">
                  ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[10px] text-muted leading-tight">
                * Taxes and freight terms will be verified upon order confirmation by sales executive.
              </p>
              <div className="flex gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 border border-divider rounded-full font-medium text-xs text-primary hover:bg-surface transition-colors text-center"
                >
                  Keep Browsing
                </button>
                <Link
                  href="/distributor/orders/new"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 bg-accent text-background rounded-full font-medium text-xs hover:bg-accent-hover transition-colors text-center font-serif tracking-wide shadow-md"
                >
                  Place Order →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

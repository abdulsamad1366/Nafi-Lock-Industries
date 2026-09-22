"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDistributorOrders, Order } from "@/lib/api";

export default function DistributorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDistributorOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "CONFIRMED":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "PROCESSING":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "SHIPPED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "DELIVERED":
        return "bg-green-600/10 text-green-700 border-green-600/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-xl font-bold text-primary">
            Wholesale Purchase Orders
          </h2>
          <p className="text-xs text-muted">
            Track manufacturing dispatch, logistics status, and itemized invoices
          </p>
        </div>
        <Link
          href="/distributor/catalog"
          className="px-4 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
        >
          Create New Order +
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono">Loading purchase orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-base text-primary mb-1">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            You currently have no active purchase orders. Browse the dealer catalog to build your first inventory batch.
          </p>
          <Link
            href="/distributor/catalog"
            className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors"
          >
            Start Order from Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = order.items.reduce(
              (sum, item) => sum + Number(item.unitPrice) * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-surface border border-divider rounded-2xl p-6 transition-all hover:border-accent/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-divider gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-muted font-mono">
                    Placed:{" "}
                    {new Date(order.placedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-accent font-bold">
                          {item.quantity}×
                        </span>
                        <span className="text-primary font-medium">
                          {item.product?.name || "Lock Model"}
                        </span>
                      </div>
                      <span className="font-mono text-muted">
                        ₹{(Number(item.unitPrice) * item.quantity).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Row */}
                <div className="pt-3 border-t border-divider flex items-center justify-between">
                  <span className="text-xs text-muted">
                    Total: <strong className="text-primary">{totalUnits} units</strong>
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-muted block">Estimated Total</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDistributorOrders, Order } from "@/lib/api";
import { useOrderCart } from "@/components/OrderCartProvider";
import { getCategoryPlaceholder } from "@/components/ProductGallery";

const ORDER_STAGES: {
  key: Order["status"];
  label: string;
  stepNumber: number;
}[] = [
  { key: "PLACED", label: "Order Placed", stepNumber: 1 },
  { key: "CONFIRMED", label: "Factory Confirmed", stepNumber: 2 },
  { key: "PROCESSING", label: "Production & Assembly", stepNumber: 3 },
  { key: "SHIPPED", label: "Dispatched & In Transit", stepNumber: 4 },
  { key: "DELIVERED", label: "Delivered", stepNumber: 5 },
];

function getStageIndex(status: Order["status"]): number {
  switch (status) {
    case "PLACED":
      return 0;
    case "CONFIRMED":
      return 1;
    case "PROCESSING":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return -1;
  }
}

export default function DistributorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const { addItem, openDrawer } = useOrderCart();
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  useEffect(() => {
    getDistributorOrders()
      .then((data) => {
        setOrders(data);
        // By default, expand the first order if available
        if (data.length > 0) {
          setExpandedOrders({ [data[0].id]: true });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.product?.name || "Lock Model",
        unitPrice: Number(item.unitPrice),
        minOrderQty: item.product?.minOrderQty || 1,
        quantity: item.quantity,
        image:
          item.product?.images?.[0] ||
          getCategoryPlaceholder(item.product?.category?.slug, item.product?.brand?.slug),
      });
    });
    setReorderSuccessId(order.id);
    setTimeout(() => setReorderSuccessId(null), 3000);
    openDrawer();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(order.status)
          : order.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        (order.notes && order.notes.toLowerCase().includes(q)) ||
        order.items.some((i) => i.product?.name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Aggregate stats
  const activeOrdersCount = orders.filter((o) =>
    ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status)
  ).length;

  const totalVolumeUnits = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  const totalProcurementValue = orders.reduce(
    (sum, o) =>
      sum + o.items.reduce((iSum, i) => iSum + Number(i.unitPrice) * i.quantity, 0),
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Top Header & Fast Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Consignment Tracking
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Purchase Orders
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time foundry dispatch status and itemized purchase order history.
          </p>
        </div>

        <Link
          href="/#catalog"
          className="min-h-[42px] px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer touch-manipulation self-start sm:self-auto w-full sm:w-auto"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Order Batch</span>
        </Link>
      </div>

      {/* ── KPI Tiles Row ── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Active
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-lg sm:text-2xl font-bold text-primary">
              {activeOrdersCount}
            </span>
            <span className="text-[10px] text-accent hidden xs:inline">orders</span>
          </div>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Total Units
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-lg sm:text-2xl font-bold text-primary">
              {totalVolumeUnits.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted hidden xs:inline">pcs</span>
          </div>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Total Value
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-base sm:text-2xl font-bold text-accent truncate">
              ₹{totalProcurementValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter and Search Bar ── */}
      <div className="bg-surface border border-divider rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: "ALL", label: "All" },
            { id: "ACTIVE", label: "Active" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all whitespace-nowrap cursor-pointer touch-manipulation ${
                statusFilter === tab.id
                  ? "bg-accent text-background font-bold shadow-2xs"
                  : "text-muted hover:text-primary hover:bg-background/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO # or lock name..."
            className="w-full bg-background border border-divider rounded-xl pl-9 pr-3 py-2 text-xs text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent transition-colors"
          />
          <svg
            className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* ── Orders List ── */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider">
            Loading orders...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface border border-divider rounded-3xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-3 border border-accent/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-primary mb-1">
            No Orders Found
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-5">
            {orders.length === 0
              ? "You haven't placed any wholesale purchase orders yet."
              : "No orders match your filter criteria."}
          </p>
          <Link
            href="/#catalog"
            className="min-h-[40px] px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs inline-flex items-center gap-1.5 touch-manipulation"
          >
            <span>Explore Catalog</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders[order.id];
            const stageIdx = getStageIndex(order.status);
            const isCancelled = order.status === "CANCELLED";
            const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = order.items.reduce(
              (sum, item) => sum + Number(item.unitPrice) * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-surface border border-divider hover:border-accent/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all shadow-xs"
              >
                {/* ── Order Card Header Bar ── */}
                <div className="p-3.5 sm:p-5 bg-background/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-sm sm:text-base font-bold text-primary">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : order.status === "SHIPPED"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : order.status === "PROCESSING"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : order.status === "CONFIRMED"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : order.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-surface text-accent border-accent/30"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[11px] text-muted font-mono">
                          {new Date(order.placedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-muted font-mono">
                        <span>{order.items.length} Product Models</span>
                        <span>·</span>
                        <span>{totalUnits} Units</span>
                      </div>
                    </div>

                    {/* Amount & Expand Toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-divider/40">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-muted block">
                          Total
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-accent">
                          ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-surface border border-divider hover:border-accent text-xs font-serif font-bold text-primary transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 touch-manipulation"
                      >
                        <span>{isExpanded ? "Hide" : "Details"}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* ── Status Stepper (Rendered on both Mobile & Desktop) ── */}
                  {!isCancelled ? (
                    <div className="mt-3.5 pt-3 border-t border-divider/50 overflow-x-auto no-scrollbar">
                      <div className="min-w-[310px] sm:min-w-0 relative py-1">
                        {/* Base Connecting Line (starts at center of circle 1 = 10%, ends at center of circle 5 = 90%) */}
                        <div className="absolute top-3 sm:top-3.5 left-[10%] right-[10%] h-0.5 bg-divider -z-0" />
                        
                        {/* Progress Filled Connecting Line */}
                        <div
                          className="absolute top-3 sm:top-3.5 left-[10%] h-0.5 bg-accent transition-all duration-500 -z-0"
                          style={{
                            width: `${(stageIdx / (ORDER_STAGES.length - 1)) * 80}%`,
                          }}
                        />

                        {/* 5 Stage Nodes */}
                        <div className="grid grid-cols-5 relative z-10">
                          {ORDER_STAGES.map((stage, idx) => {
                            const isCompleted = idx < stageIdx;
                            const isCurrent = idx === stageIdx;

                            return (
                              <div
                                key={stage.key}
                                className="flex flex-col items-center text-center px-0.5"
                              >
                                <div
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 mb-1 ${
                                    isCurrent
                                      ? "bg-accent text-background ring-4 ring-blue-400/35 dark:ring-blue-400/40 scale-105 shadow-xs"
                                      : isCompleted
                                      ? "bg-accent text-background"
                                      : "bg-surface border border-divider text-muted"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <svg className="w-3.5 h-3.5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    stage.stepNumber
                                  )}
                                </div>

                                <span
                                  className={`text-[9px] sm:text-[10px] block font-serif leading-tight ${
                                    isCurrent
                                      ? "text-accent font-bold"
                                      : isCompleted
                                      ? "text-primary font-medium"
                                      : "text-muted"
                                  }`}
                                >
                                  {stage.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <span>This order consignment has been cancelled.</span>
                    </div>
                  )}

                  {/* Dispatch Notes */}
                  {order.notes && (
                    <div className="mt-3 p-3 bg-background border border-divider rounded-xl flex items-start gap-2.5 text-xs">
                      <svg className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold block mb-0.5">
                          Logistics Notes:
                        </span>
                        <p className="text-primary text-[11px] leading-relaxed">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Expanded Bill of Materials ── */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-5 bg-surface space-y-3 border-t border-divider animate-in fade-in-50 duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block pb-1 border-b border-divider">
                      Itemized Line Items
                    </span>

                    <div className="divide-y divide-divider/60">
                      {order.items.map((item) => {
                        const product = item.product;
                        const fallbackImg = getCategoryPlaceholder(
                          product?.category?.slug,
                          product?.brand?.slug
                        );
                        const displayImg = product?.images?.[0] || fallbackImg;

                        return (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-background border border-divider overflow-hidden flex items-center justify-center shrink-0 p-1">
                                <Image
                                  src={displayImg}
                                  alt={product?.name || "Product"}
                                  width={36}
                                  height={36}
                                  className="object-contain"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  {product?.brand?.name && (
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-accent font-bold">
                                      {product.brand.name}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono text-muted">
                                    ₹{Number(item.unitPrice).toFixed(0)}/pc
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-xs text-primary truncate">
                                  {product?.name || "Lock Model"}
                                </h4>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-mono text-muted block">
                                {item.quantity} pcs
                              </span>
                              <span className="font-mono text-xs font-bold text-primary">
                                ₹{(Number(item.unitPrice) * item.quantity).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-3 border-t border-divider flex flex-col xs:flex-row items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full xs:w-auto min-h-[40px] px-4 py-2 bg-background border border-divider hover:border-accent rounded-full text-xs font-serif font-semibold text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs touch-manipulation"
                      >
                        <svg className="w-3.5 h-3.5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>Print Slip</span>
                      </button>

                      <div className="flex items-center gap-2 w-full xs:w-auto">
                        {reorderSuccessId === order.id && (
                          <span className="text-xs text-emerald-500 font-mono">
                            ✓ Added to Cart
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="w-full xs:w-auto min-h-[40px] px-5 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                          </svg>
                          <span>Re-Order Batch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

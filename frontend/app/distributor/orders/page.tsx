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
    <div className="space-y-8">
      {/* Top Header & Fast Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              Manufacturing & Logistics Console
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Purchase Orders & Shipments
          </h2>
          <p className="text-xs text-muted max-w-xl mt-1">
            Real-time manufacturing dispatch, logistics freight tracking, and itemized billing for Aligarh foundry consignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/distributor/catalog"
            className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Order Batch</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Active Consignments
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {activeOrdersCount}
            </span>
            <span className="text-xs text-accent font-medium">in pipeline</span>
          </div>
          <p className="text-[11px] text-muted mt-1">In tooling, packaging, or road transit.</p>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Total Procured Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {totalVolumeUnits.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted font-mono">Units</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Across all historical order consignments.</p>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Cumulative Value
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-accent">
              ₹{totalProcurementValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-[11px] text-muted mt-1">Tier-1 wholesale factory pricing locked.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-divider rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "ACTIVE", label: "In Progress" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-accent text-background font-bold shadow-2xs"
                  : "text-muted hover:text-primary hover:bg-background/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, notes, or product..."
            className="w-full bg-background border border-divider rounded-xl pl-9 pr-4 py-2 text-xs text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent transition-colors"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-muted pointer-events-none"
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

      {/* Orders List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider">
            Fetching purchase order records...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface border border-divider rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4 border border-accent/20">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-lg text-primary mb-1">
            No Matching Purchase Orders
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto mb-6">
            {orders.length === 0
              ? "You haven't placed any wholesale purchase orders yet. Browse the dealer catalog to build your first inventory batch."
              : "No orders match your filter criteria. Try clearing your search query."}
          </p>
          <Link
            href="/distributor/catalog"
            className="px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs inline-flex items-center gap-2"
          >
            <span>Explore Wholesale Catalog</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
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
                className="bg-surface border border-divider hover:border-accent/40 rounded-3xl overflow-hidden transition-all shadow-xs"
              >
                {/* Order Top Summary Bar */}
                <div className="p-6 border-b border-divider bg-background/40">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <span className="font-mono text-base font-bold text-primary tracking-tight">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
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
                        <span className="text-xs text-muted font-mono">
                          Placed:{" "}
                          {new Date(order.placedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted font-mono">
                        <span>{order.items.length} Product Models</span>
                        <span>·</span>
                        <span>{totalUnits} Total Units</span>
                      </div>
                    </div>

                    {/* Right side Total & Controls */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                          Consignment Total
                        </span>
                        <span className="font-mono text-lg font-bold text-accent">
                          ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="px-3.5 py-2 rounded-xl bg-surface border border-divider hover:border-accent text-xs font-serif font-bold text-primary transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>{isExpanded ? "Collapse" : "Review Items"}</span>
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

                  {/* Visual Status Stepper */}
                  {!isCancelled ? (
                    <div className="mt-8 pt-6 border-t border-divider/60">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-divider -z-0 hidden sm:block" />
                        <div
                          className="absolute top-4 left-4 h-0.5 bg-accent transition-all duration-500 -z-0 hidden sm:block"
                          style={{
                            width: `${(stageIdx / (ORDER_STAGES.length - 1)) * 95}%`,
                          }}
                        />

                        {/* Stages */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                          {ORDER_STAGES.map((stage, idx) => {
                            const isCompleted = idx < stageIdx;
                            const isCurrent = idx === stageIdx;
                            const isUpcoming = idx > stageIdx;

                            return (
                              <div
                                key={stage.key}
                                className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all shrink-0 ${
                                    isCurrent
                                      ? "bg-accent text-background ring-4 ring-accent/20 scale-110 shadow-sm"
                                      : isCompleted
                                      ? "bg-accent text-background"
                                      : "bg-surface border border-divider text-muted"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    stage.stepNumber
                                  )}
                                </div>

                                <div>
                                  <span
                                    className={`text-xs block font-serif font-medium ${
                                      isCurrent
                                        ? "text-accent font-bold"
                                        : isCompleted
                                        ? "text-primary"
                                        : "text-muted"
                                    }`}
                                  >
                                    {stage.label}
                                  </span>
                                  <span className="text-[10px] text-muted font-mono block">
                                    {isCurrent ? "In progress" : isCompleted ? "Completed" : "Pending"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <span>
                        This purchase order consignment has been cancelled. Please consult your factory representative for settlement or re-issue.
                      </span>
                    </div>
                  )}

                  {/* Factory Dispatch & Logistics Notes Callout */}
                  {order.notes && (
                    <div className="mt-6 p-4 bg-background border border-divider rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </div>
                      <div className="text-xs">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold block mb-0.5">
                          Aligarh Dispatch & Logistics Remarks
                        </span>
                        <p className="text-primary leading-relaxed">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Itemized Bill of Materials */}
                {isExpanded && (
                  <div className="p-6 bg-surface space-y-4 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-divider">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                        Itemized Bill of Materials
                      </span>
                      <span className="text-[10px] font-mono text-muted">
                        Snapshot prices locked at order placement
                      </span>
                    </div>

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
                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-xl bg-background border border-divider overflow-hidden flex items-center justify-center shrink-0 p-1 relative">
                                <Image
                                  src={displayImg}
                                  alt={product?.name || "Product"}
                                  width={44}
                                  height={44}
                                  className="object-contain"
                                />
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  {product?.brand?.name && (
                                    <span className="px-2 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider bg-background border border-divider text-accent font-bold">
                                      {product.brand.name}
                                    </span>
                                  )}
                                  {product?.category?.name && (
                                    <span className="text-[10px] font-mono text-muted">
                                      {product.category.name}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-serif font-bold text-sm text-primary">
                                  {product?.name || "Lock Model"}
                                </h4>
                                <span className="text-[11px] font-mono text-muted">
                                  ₹{Number(item.unitPrice).toFixed(2)} per unit
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] font-mono text-muted block">Quantity</span>
                                <span className="font-mono text-sm font-bold text-accent">
                                  {item.quantity} Units
                                </span>
                              </div>

                              <div className="text-right min-w-28">
                                <span className="text-[10px] font-mono text-muted block">Line Total</span>
                                <span className="font-mono text-sm font-bold text-primary">
                                  ₹{(Number(item.unitPrice) * item.quantity).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-4 border-t border-divider flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-background border border-divider hover:border-accent rounded-full text-xs font-serif font-semibold text-primary transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-3.5 h-3.5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>Print Order Slip</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {reorderSuccessId === order.id && (
                          <span className="text-xs text-emerald-500 font-mono">
                            ✓ Items loaded to Order Cart
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-5 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                          </svg>
                          <span>Re-Order This Batch</span>
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

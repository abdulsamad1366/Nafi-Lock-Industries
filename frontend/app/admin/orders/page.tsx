"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

interface OrderAdminRow {
  id: string;
  orderNumber: string;
  status: "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  notes?: string | null;
  placedAt: string;
  distributor: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    distributorProfile?: {
      companyName: string;
      city: string;
      state: string;
    } | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product?: {
      id: string;
      name: string;
    };
  }>;
}

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderAdminRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const url = statusFilter === "ALL"
        ? `${API_BASE}/admin/orders`
        : `${API_BASE}/admin/orders?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setOrders(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      await fetch(`${API_BASE}/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Wholesale B2B Purchase Orders
          </h1>
          <p className="text-xs text-muted">
            Manage factory manufacturing orders, update logistics tracking, and record dispatch status
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["ALL", ...ORDER_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-serif font-bold transition-all ${
                statusFilter === st
                  ? "bg-accent text-background shadow-xs"
                  : "bg-surface border border-divider text-muted hover:text-primary"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-xs text-muted font-mono">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center text-xs text-muted">
          No orders found matching filter: {statusFilter}.
        </div>
      ) : (
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order Number & Date</th>
                  <th className="p-4">Distributor Entity</th>
                  <th className="p-4">Line Items</th>
                  <th className="p-4">Order Total</th>
                  <th className="p-4">Dispatch Status</th>
                  <th className="p-4">Instructions / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {orders.map((o) => {
                  const totalUnits = o.items.reduce((s, i) => s + i.quantity, 0);
                  const totalAmount = o.items.reduce(
                    (s, i) => s + Number(i.unitPrice) * i.quantity,
                    0
                  );

                  return (
                    <tr key={o.id} className="hover:bg-background/40 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-primary block">
                          {o.orderNumber}
                        </span>
                        <span className="text-[10px] text-muted font-mono">
                          {new Date(o.placedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-serif font-bold text-primary block">
                          {o.distributor.distributorProfile?.companyName || o.distributor.name}
                        </span>
                        <span className="text-[11px] text-muted">
                          {o.distributor.distributorProfile?.city},{" "}
                          {o.distributor.distributorProfile?.state}
                        </span>
                        <span className="text-[10px] text-muted font-mono block">
                          {o.distributor.email}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-bold text-accent">
                          {totalUnits} units
                        </span>
                        <span className="text-[10px] text-muted block">
                          across {o.items.length} product(s)
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-sm text-primary">
                        ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="bg-background border border-divider rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-primary focus:outline-hidden focus:border-accent"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 max-w-xs text-[11px] text-muted truncate">
                        {o.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

interface SalesRep {
  id: string;
  name: string;
}

interface DistributorRow {
  id: string;
  userId: string;
  companyName: string;
  gstNumber?: string | null;
  businessAddress: string;
  city: string;
  state: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  assignedRepId?: string | null;
  assignedRep?: SalesRep | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState<DistributorRow[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const authHeader = { Authorization: `Bearer ${token}` };

      const url = statusFilter === "ALL"
        ? `${API_BASE}/admin/distributors`
        : `${API_BASE}/admin/distributors?status=${statusFilter}`;

      const [distRes, repsRes] = await Promise.all([
        fetch(url, { headers: authHeader }).catch(() => null),
        fetch(`${API_BASE}/admin/sales-reps`, { headers: authHeader }).catch(() => null),
      ]);

      if (distRes && distRes.ok) {
        const dJson = await distRes.json();
        setDistributors(dJson);
      }
      if (repsRes && repsRes.ok) {
        const rJson = await repsRes.json();
        setSalesReps(rJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED", assignedRepId?: string) => {
    setUpdatingId(id);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const res = await fetch(`${API_BASE}/admin/distributors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          assignedRepId: assignedRepId || undefined,
        }),
      });

      if (res.ok) {
        await fetchData();
      } else {
        alert("Failed to update distributor status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRepChange = async (id: string, repId: string, currentStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      await fetch(`${API_BASE}/admin/distributors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus,
          assignedRepId: repId || null,
        }),
      });
      await fetchData();
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
            Distributor Network Review
          </h1>
          <p className="text-xs text-muted">
            Audit wholesale dealer applications, grant Tier-1 pricing access, and assign regional sales reps
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all ${
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
          Loading distributor applications...
        </div>
      ) : distributors.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center text-xs text-muted">
          No distributor records found for status filter: {statusFilter}.
        </div>
      ) : (
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Enterprise & Location</th>
                  <th className="p-4">Owner / Contact</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Assigned Sales Rep</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {distributors.map((d) => (
                  <tr key={d.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4">
                      <span className="font-serif font-bold text-sm text-primary block">
                        {d.companyName}
                      </span>
                      <span className="text-muted text-[11px]">
                        {d.city}, {d.state}
                      </span>
                      <span className="text-muted text-[10px] block truncate max-w-xs">
                        {d.businessAddress}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-primary block">
                        {d.user?.name}
                      </span>
                      <span className="text-muted text-[11px] font-mono block">
                        {d.user?.email}
                      </span>
                      {d.user?.phone && (
                        <span className="text-muted text-[10px] font-mono block">
                          {d.user.phone}
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono text-[11px] uppercase">
                      {d.gstNumber || "—"}
                    </td>

                    <td className="p-4">
                      <select
                        value={d.assignedRepId || ""}
                        onChange={(e) => handleRepChange(d.id, e.target.value, d.status)}
                        className="bg-background border border-divider rounded-lg px-2.5 py-1 text-xs text-primary focus:outline-hidden focus:border-accent"
                      >
                        <option value="">No Rep Assigned</option>
                        {salesReps.map((rep) => (
                          <option key={rep.id} value={rep.id}>
                            {rep.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          d.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : d.status === "REJECTED"
                            ? "bg-red-500/10 text-red-600 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {d.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(d.id, "APPROVED", d.assignedRepId || undefined)}
                            disabled={updatingId === d.id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {d.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(d.id, "REJECTED", d.assignedRepId || undefined)}
                            disabled={updatingId === d.id}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

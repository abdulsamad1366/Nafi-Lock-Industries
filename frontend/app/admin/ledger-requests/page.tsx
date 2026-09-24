"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

interface LedgerRequestAdminRow {
  id: string;
  note?: string | null;
  status: "REQUESTED" | "FULFILLED";
  requestedAt: string;
  fulfilledAt?: string | null;
  distributor: {
    id: string;
    name: string;
    email: string;
    distributorProfile?: {
      companyName: string;
      city: string;
      state: string;
    } | null;
  };
}

export default function AdminLedgerRequestsPage() {
  const [requests, setRequests] = useState<LedgerRequestAdminRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Fulfillment upload modal state
  const [activeReq, setActiveReq] = useState<LedgerRequestAdminRow | null>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const url = statusFilter === "ALL"
        ? `${API_BASE}/admin/ledger-requests`
        : `${API_BASE}/admin/ledger-requests?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setRequests(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleOpenFulfill = (req: LedgerRequestAdminRow) => {
    setActiveReq(req);
    setTitle(
      `Statement for ${req.distributor.distributorProfile?.companyName || req.distributor.name} — ${new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
    );
    setFile(null);
    setUploadError(null);
  };

  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const res = await fetch(
        `${API_BASE}/admin/ledger-requests/${activeReq.id}/fulfill`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to upload ledger PDF");
      }

      setActiveReq(null);
      await fetchRequests();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Financial Ledger & Statement Queue
          </h1>
          <p className="text-xs text-muted">
            Fulfill distributor statement requests by uploading signed factory reconciliation PDFs
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {["ALL", "REQUESTED", "FULFILLED"].map((st) => (
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
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center text-xs text-muted">
          No ledger requests on record.
        </div>
      ) : (
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Distributor Entity</th>
                  <th className="p-4">Request Note / Scope</th>
                  <th className="p-4">Requested On</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4">
                      <span className="font-serif font-bold text-primary block">
                        {r.distributor.distributorProfile?.companyName || r.distributor.name}
                      </span>
                      <span className="text-[11px] text-muted">
                        {r.distributor.distributorProfile?.city},{" "}
                        {r.distributor.distributorProfile?.state}
                      </span>
                      <span className="text-[10px] text-muted font-mono block">
                        {r.distributor.email}
                      </span>
                    </td>

                    <td className="p-4 text-primary font-medium max-w-sm">
                      {r.note || "General Account Statement"}
                    </td>

                    <td className="p-4 text-[11px] font-mono text-muted">
                      {new Date(r.requestedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          r.status === "FULFILLED"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {r.status === "REQUESTED" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenFulfill(r)}
                          className="px-4 py-1.5 bg-accent text-background font-serif font-bold text-xs rounded-lg hover:bg-accent-hover transition-colors shadow-xs"
                        >
                          Upload PDF to Fulfill →
                        </button>
                      ) : (
                        <span className="text-muted text-[11px] font-mono">
                          Fulfilled{" "}
                          {r.fulfilledAt &&
                            new Date(r.fulfilledAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload to Fulfill Modal */}
      {activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <h3 className="font-serif font-bold text-lg text-primary">
                Fulfill Statement Request
              </h3>
              <button
                onClick={() => setActiveReq(null)}
                className="text-muted hover:text-primary p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted">
              Fulfilling request for{" "}
              <strong className="text-primary">
                {activeReq.distributor.distributorProfile?.companyName || activeReq.distributor.name}
              </strong>
            </p>

            {uploadError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleFulfillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                  Select Ledger PDF File *
                </label>
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-divider">
                <button
                  type="button"
                  onClick={() => setActiveReq(null)}
                  className="px-4 py-2 text-xs text-muted hover:text-primary rounded-full border border-divider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-md disabled:opacity-50"
                >
                  {isUploading ? "Uploading & Fulfilling..." : "Upload & Mark Fulfilled"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

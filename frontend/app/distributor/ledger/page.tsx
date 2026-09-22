"use client";

import { useEffect, useState } from "react";
import {
  requestLedger,
  getDistributorLedgerRequests,
  getDistributorLedgers,
  getLedgerDownloadUrl,
  LedgerRequest,
  Ledger,
} from "@/lib/api";
import { getUserAuthHeaders } from "@/lib/userAuth";

export default function DistributorLedgerPage() {
  const [requests, setRequests] = useState<LedgerRequest[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [reqs, leds] = await Promise.all([
        getDistributorLedgerRequests(),
        getDistributorLedgers(),
      ]);
      setRequests(reqs);
      setLedgers(leds);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      await requestLedger(note);
      setNote("");
      setSuccessMsg("Statement request submitted to factory accounting desk.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (ledger: Ledger) => {
    setDownloadingId(ledger.id);
    try {
      const url = getLedgerDownloadUrl(ledger.id);
      const res = await fetch(url, {
        headers: getUserAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to download ledger");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${ledger.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Error downloading ledger statement. Please contact support.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-primary">
          Distributor Account Ledger & Statements
        </h2>
        <p className="text-xs text-muted">
          Request official stamped financial statements, payment reconciliation, and credit status
        </p>
      </div>

      {/* Request Form Card */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8">
        <h3 className="font-serif font-bold text-lg text-primary mb-1">
          Request New Account Statement
        </h3>
        <p className="text-xs text-muted mb-4">
          Our plant accounts department generates signed PDF statements for tax, audit, and credit settlement purposes.
        </p>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRequestStatement} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              Specific Date Range or Notes (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Statement for Q2 FY2026-27 or FY Year-End Reconciliation"
              className="w-full bg-background border border-divider rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-hidden focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? "Submitting Request..." : "Request Official Statement"}
          </button>
        </form>
      </div>

      {/* Fulfilled Ledgers Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-primary">
          Fulfilled Statement Documents
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-muted font-mono">
            Loading statements...
          </div>
        ) : ledgers.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-8 text-center text-xs text-muted">
            No fulfilled ledger statements on record yet. Once accounting uploads your statement, it will appear here for secure PDF download.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ledgers.map((l) => (
              <div
                key={l.id}
                className="bg-surface border border-divider rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-primary">
                      {l.title}
                    </h4>
                    <span className="text-[10px] text-muted font-mono">
                      Uploaded{" "}
                      {new Date(l.uploadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(l)}
                  disabled={downloadingId === l.id}
                  className="px-4 py-2 bg-background border border-divider hover:border-accent text-accent font-serif font-bold text-xs rounded-full transition-colors shrink-0 disabled:opacity-50"
                >
                  {downloadingId === l.id ? "Downloading..." : "Download PDF ↓"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests Queue */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-primary">
          Statement Request History
        </h3>

        {requests.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-6 text-center text-xs text-muted">
            No previous ledger requests.
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-2xl overflow-hidden divide-y divide-divider">
            {requests.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-primary block">
                    {r.note || "General Account Statement Request"}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    Requested on{" "}
                    {new Date(r.requestedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    r.status === "FULFILLED"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

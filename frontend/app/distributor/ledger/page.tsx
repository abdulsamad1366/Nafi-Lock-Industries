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

const PRESET_STATEMENT_PERIODS = [
  "Current Month Statement (Reconciliation)",
  "Q2 FY2026-27 (Jul – Sep)",
  "Q1 FY2026-27 (Apr – Jun)",
  "Full Financial Year 2025-26 Audit Ledger",
  "GST & Tax Compliance Summary",
];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getLedgerExpiryInfo(uploadedAtStr: string) {
  const uploadedTime = new Date(uploadedAtStr).getTime();
  const expiresTime = uploadedTime + SEVEN_DAYS_MS;
  const msRemaining = expiresTime - Date.now();

  if (msRemaining <= 0) {
    return {
      label: "Expired (Auto-Purged)",
      daysLeft: 0,
      hoursLeft: 0,
      percentRemaining: 0,
      isExpired: true,
      color: "red",
    };
  }

  const daysLeft = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor(msRemaining / (60 * 60 * 1000));
  const percentRemaining = Math.max(
    5,
    Math.min(100, Math.round((msRemaining / SEVEN_DAYS_MS) * 100))
  );

  if (daysLeft > 2) {
    return {
      label: `${daysLeft} days left`,
      daysLeft,
      hoursLeft,
      percentRemaining,
      isExpired: false,
      color: "slate",
    };
  } else if (daysLeft === 2) {
    return {
      label: "2 days left",
      daysLeft: 2,
      hoursLeft,
      percentRemaining,
      isExpired: false,
      color: "amber",
    };
  } else if (daysLeft === 1 && hoursLeft > 24) {
    return {
      label: "1 day left",
      daysLeft: 1,
      hoursLeft,
      percentRemaining,
      isExpired: false,
      color: "urgent",
    };
  } else if (hoursLeft > 1) {
    return {
      label: `${hoursLeft} hours left`,
      daysLeft: 1,
      hoursLeft,
      percentRemaining,
      isExpired: false,
      color: "urgent",
    };
  } else {
    return {
      label: "Expiring in < 1 hour",
      daysLeft: 0,
      hoursLeft: 0,
      percentRemaining: 5,
      isExpired: false,
      color: "urgent",
    };
  }
}

export default function DistributorLedgerPage() {
  const [requests, setRequests] = useState<LedgerRequest[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const fetchData = async () => {
    try {
      const [reqs, leds] = await Promise.all([
        getDistributorLedgerRequests(),
        getDistributorLedgers(),
      ]);
      setRequests(reqs);
      setLedgers(leds);
    } catch (err) {
      console.error("Failed to load distributor ledger records", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      await requestLedger(note);
      setNote("");
      setSuccessMsg("Statement request submitted to factory accounts desk.");
      setShowRequestModal(false);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit statement request");
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
      if (!res.ok) throw new Error("Failed to download ledger statement");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${ledger.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(err.message || "Error downloading ledger statement. Please ensure distributor approval.");
    } finally {
      setDownloadingId(null);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === "REQUESTED").length;

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              Commercial Financial Services
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Account Ledger & Statements
          </h2>
          <p className="text-xs text-muted max-w-xl mt-1">
            Access digitally signed financial statements, tax reconciliation reports, and track credit settlements generated by the Aligarh accounts desk.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Request New Statement</span>
        </button>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Certified Statements
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {ledgers.length}
            </span>
            <span className="text-xs text-muted font-mono">Available</span>
          </div>
          <p className="text-[11px] text-muted mt-1">7-day active retention before auto-purge.</p>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Pending Queue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-accent">
              {pendingRequestsCount}
            </span>
            <span className="text-xs text-muted font-mono">Requests</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Under review by Aligarh accounting team.</p>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-5 relative overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1">
            Reconciliation Standard
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-400">
              Audited & Stamped
            </span>
          </div>
          <p className="text-[11px] text-muted mt-1">Standard factory commercial invoices.</p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-muted hover:text-primary text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Fulfilled Statement Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            <span>Official Stamped Statements</span>
            <span className="text-xs font-mono font-normal text-muted">
              ({ledgers.length})
            </span>
          </h3>
          <span className="text-[10px] font-mono text-accent font-semibold uppercase tracking-wider hidden sm:inline">
            7-Day Auto-Purge Protection Active
          </span>
        </div>

        {/* 7-Day Policy Notice */}
        <div className="p-3.5 bg-surface border border-accent/20 rounded-2xl flex items-start gap-3 text-xs text-muted shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-primary font-semibold font-serif">
                7-Day Automatic Expiry & Purge Policy
              </strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 font-bold uppercase">
                Data Minimization SLA
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
              To safeguard financial confidentiality, all certified ledger PDFs automatically delete from the server exactly 7 days after generation. Please download and preserve your local PDF copies.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs text-muted font-mono">Loading statement files...</p>
          </div>
        ) : ledgers.length === 0 ? (
          <div className="bg-surface border border-divider rounded-3xl p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4 border border-accent/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-base text-primary mb-1">
              No Active Ledger Documents
            </h4>
            <p className="text-xs text-muted max-w-md mx-auto mb-6">
              Statements are available for download for 7 days after issue and automatically purge afterwards. When accounting fulfills a request, your statement will appear here.
            </p>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="px-5 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Submit Statement Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ledgers.map((l) => {
              const expiry = getLedgerExpiryInfo(l.uploadedAt);

              return (
                <div
                  key={l.id}
                  className="bg-surface border border-divider hover:border-accent/40 rounded-3xl p-6 flex flex-col justify-between transition-all shadow-xs group"
                >
                  <div>
                    {/* Header badge row with live countdown badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Official PDF
                        </span>

                        {/* Prominent Live Countdown Pill */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-tight border flex items-center gap-1.5 shadow-xs ${
                            expiry.color === "urgent"
                              ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                              : expiry.color === "amber"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                              : "bg-accent/15 text-accent border-accent/30"
                          }`}
                          title="This ledger will automatically delete after 7 days"
                        >
                          <svg
                            className="w-3 h-3 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{expiry.label}</span>
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-muted">
                        Uploaded{" "}
                        {new Date(l.uploadedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-primary group-hover:text-accent transition-colors mb-2">
                      {l.title}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed mb-4">
                      Commercial statement generated by Nafi Lock Industries factory accounting desk for GST reconciliation and ledger audit.
                    </p>

                    {/* 7-Day Retention Window Progress Bar */}
                    <div className="mb-5 p-3 bg-background/60 border border-divider rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted flex items-center gap-1">
                          <span>Auto-Delete Countdown:</span>
                          <strong
                            className={
                              expiry.color === "urgent"
                                ? "text-red-400 font-bold"
                                : expiry.color === "amber"
                                ? "text-amber-400 font-bold"
                                : "text-accent font-bold"
                            }
                          >
                            {expiry.label}
                          </strong>
                        </span>
                        <span className="text-muted/80">
                          Deletes:{" "}
                          {new Date(
                            new Date(l.uploadedAt).getTime() + SEVEN_DAYS_MS
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-divider rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            expiry.color === "urgent"
                              ? "bg-red-500"
                              : expiry.color === "amber"
                              ? "bg-amber-400"
                              : "bg-accent"
                          }`}
                          style={{ width: `${expiry.percentRemaining}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-muted/70 pt-0.5">
                        <span>7-day auto-purge policy</span>
                        <span>Auto-deleted from server on expiry</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-divider flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                      <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Digitally Certified</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(l)}
                      disabled={downloadingId === l.id || expiry.isExpired}
                      className={`px-4 py-2 font-serif font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 ${
                        expiry.isExpired
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-accent text-background hover:bg-accent-hover cursor-pointer"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>
                        {downloadingId === l.id
                          ? "Downloading..."
                          : expiry.isExpired
                          ? "Statement Expired"
                          : "Download PDF"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statement Request History Timeline */}
      <div className="space-y-4 pt-4">
        <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
          <span>Statement Request Audit History</span>
          <span className="text-xs font-mono font-normal text-muted">
            ({requests.length})
          </span>
        </h3>

        {requests.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-6 text-center text-xs text-muted">
            No previous ledger statement requests submitted.
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-2xl overflow-hidden divide-y divide-divider shadow-xs">
            {requests.map((r) => (
              <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif font-bold text-primary">
                      {r.note || "General Account Statement Request"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted block">
                    Requested on{" "}
                    {new Date(r.requestedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      r.status === "FULFILLED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {r.status === "FULFILLED" ? "✓ Fulfilled by Plant" : "⧖ Under Review"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-divider rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-5 right-5 text-muted hover:text-primary p-2 cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold block mb-1">
                Aligarh Accounts Desk
              </span>
              <h3 className="font-serif text-xl font-bold text-primary">
                Request Ledger Statement
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Choose a common fiscal interval or provide custom dates. Official statements are certified and uploaded by the factory dispatch accounts desk.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-2 font-semibold">
                Quick Select Accounting Period:
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_STATEMENT_PERIODS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNote(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-colors text-left cursor-pointer border ${
                      note === preset
                        ? "bg-accent text-background font-bold border-accent shadow-xs"
                        : "bg-background border-divider text-muted hover:text-primary hover:border-accent/40"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRequestStatement} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5 font-semibold">
                  Statement Period or Custom Note
                </label>
                <textarea
                  required
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Please provide reconciled statement for FY26 Q2 with stamp for bank audit."
                  className="w-full bg-background border border-divider rounded-xl p-3 text-xs text-primary focus:outline-hidden focus:border-accent transition-colors placeholder:text-muted/60"
                />
              </div>

              <div className="p-3 bg-background border border-divider rounded-xl text-[11px] text-muted flex items-start gap-2">
                <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  Certified PDF statements are typically compiled, stamped, and fulfilled within standard plant business hours.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-5 py-2.5 rounded-full border border-divider text-xs font-serif font-medium text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !note.trim()}
                  className="px-6 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

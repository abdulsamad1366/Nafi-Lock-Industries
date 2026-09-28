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
    <div className="space-y-4 sm:space-y-6">
      {/* ── Top Header & Fast Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Financial Records
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Account Ledger
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Digitally certified fiscal statements and tax reconciliation reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="min-h-[42px] px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer touch-manipulation self-start sm:self-auto w-full sm:w-auto"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Request Statement</span>
        </button>
      </div>

      {/* ── KPI Tiles Row ── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Available
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-lg sm:text-2xl font-bold text-primary">
              {ledgers.length}
            </span>
            <span className="text-[10px] text-muted hidden xs:inline">PDFs</span>
          </div>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Pending
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-lg sm:text-2xl font-bold text-accent">
              {pendingRequestsCount}
            </span>
            <span className="text-[10px] text-muted hidden xs:inline">requests</span>
          </div>
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-3 sm:p-4 text-center sm:text-left">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted block mb-0.5">
            Status
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="font-serif text-xs sm:text-base font-bold text-emerald-500">
              Certified
            </span>
          </div>
        </div>
      </div>

      {/* ── Success Alert ── */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-muted hover:text-primary text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 7-Day Purge Notice Pill ── */}
      <div className="p-3 bg-surface border border-accent/20 rounded-xl flex items-center gap-2.5 text-xs text-muted">
        <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-[11px] leading-tight">
          <strong className="text-primary font-semibold">7-Day Retention:</strong> Certified PDF statements auto-delete from server 7 days after generation. Please download local copies.
        </span>
      </div>

      {/* ── Statements Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-serif font-bold text-base text-primary flex items-center gap-2">
            <span>Certified Statements</span>
            <span className="text-xs font-mono font-normal text-muted">({ledgers.length})</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted font-mono">Loading statements...</p>
          </div>
        ) : ledgers.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
              No Statements Issued
            </h4>
            <p className="text-xs text-muted max-w-xs mx-auto mb-4">
              Submit a request to generate an official accounting statement.
            </p>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="min-h-[40px] px-5 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs cursor-pointer touch-manipulation"
            >
              Request Statement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {ledgers.map((l) => {
              const expiry = getLedgerExpiryInfo(l.uploadedAt);

              return (
                <div
                  key={l.id}
                  className="bg-surface border border-divider hover:border-accent/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                        PDF
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          expiry.color === "urgent"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : expiry.color === "amber"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-accent/15 text-accent border-accent/30"
                        }`}
                      >
                        {expiry.label}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
                      {l.title}
                    </h4>
                    <p className="text-[11px] text-muted mb-3">
                      Uploaded on{" "}
                      {new Date(l.uploadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-divider rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${
                          expiry.color === "urgent"
                            ? "bg-red-500"
                            : expiry.color === "amber"
                            ? "bg-amber-400"
                            : "bg-accent"
                        }`}
                        style={{ width: `${expiry.percentRemaining}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-divider flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                      <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Verified
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownload(l)}
                      disabled={downloadingId === l.id || expiry.isExpired}
                      className={`min-h-[38px] px-4 py-1.5 font-serif font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-2xs touch-manipulation disabled:opacity-50 ${
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
                          ? "Expired"
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

      {/* ── Request Audit History ── */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif font-bold text-base text-primary flex items-center gap-2">
          <span>Request History</span>
          <span className="text-xs font-mono font-normal text-muted">({requests.length})</span>
        </h3>

        {requests.length === 0 ? (
          <div className="bg-surface border border-divider rounded-xl p-4 text-center text-xs text-muted">
            No statement requests submitted yet.
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-2xl overflow-hidden divide-y divide-divider shadow-xs">
            {requests.map((r) => (
              <div key={r.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-serif font-semibold text-primary block">
                    {r.note || "General Account Statement"}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    Requested:{" "}
                    {new Date(r.requestedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <span
                  className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    r.status === "FULFILLED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {r.status === "FULFILLED" ? "✓ Fulfilled" : "⧖ Reviewing"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Request Modal ── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface border border-divider rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-3.5 right-3.5 text-muted hover:text-primary p-1.5 cursor-pointer touch-manipulation"
            >
              ✕
            </button>

            <div className="mb-4 pr-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold block mb-0.5">
                Accounts Desk
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-primary">
                Request Ledger Statement
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Select a period or describe the date range needed.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="mb-3.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5 font-semibold">
                Quick Select:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_STATEMENT_PERIODS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNote(preset)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-serif transition-colors text-left cursor-pointer border touch-manipulation ${
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

            <form onSubmit={handleRequestStatement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
                  Statement Period / Note
                </label>
                <textarea
                  required
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. FY26 Q2 Statement for GST reconciliation."
                  className="w-full bg-background border border-divider rounded-xl p-2.5 text-xs text-primary focus:outline-hidden focus:border-accent transition-colors placeholder:text-muted/60"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="min-h-[40px] px-4 py-2 rounded-full border border-divider text-xs font-serif font-medium text-muted hover:text-primary transition-colors cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !note.trim()}
                  className="min-h-[40px] px-6 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50 cursor-pointer touch-manipulation"
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

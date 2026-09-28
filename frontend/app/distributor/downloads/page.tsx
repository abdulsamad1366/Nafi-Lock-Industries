"use client";

import { useEffect, useState, useMemo } from "react";
import { getCatalogs, getCatalogDownloadUrl, Catalog } from "@/lib/api";
import { getUserAuthHeaders } from "@/lib/userAuth";

const HIGH_FIDELITY_CATALOGS: Catalog[] = [
  {
    id: "cat-snafi-2026",
    title: "S-Nafi Solid Brass Master Catalog (Edition 2026-27)",
    fileUrl: "uploads/catalogs/s-nafi-master-2026.pdf",
    brand: { id: "b-snafi", name: "S-Nafi", slug: "s-nafi" },
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "cat-greek-2026",
    title: "Greek Architectural Mortise & Pin Cylinder Specifications Book",
    fileUrl: "uploads/catalogs/greek-mortise-2026.pdf",
    brand: { id: "b-greek", name: "Greek", slug: "greek" },
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "cat-raksham-2026",
    title: "Raksham Grade-6 Armored Fortress Series Technical Manual",
    fileUrl: "uploads/catalogs/raksham-armored-2026.pdf",
    brand: { id: "b-raksham", name: "Raksham", slug: "raksham" },
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "cat-foundry-master",
    title: "Nafi Lock Industries Consolidated B2B Wholesale Price Book",
    fileUrl: "uploads/catalogs/nafi-master-pricebook.pdf",
    brand: null,
    uploadedAt: new Date().toISOString(),
  },
];

export default function DistributorDownloadsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState<string>("ALL");

  useEffect(() => {
    getCatalogs()
      .then((data) => {
        if (data && data.length > 0) {
          setCatalogs(data);
        } else {
          setCatalogs(HIGH_FIDELITY_CATALOGS);
        }
      })
      .catch((err) => {
        console.error(err);
        setCatalogs(HIGH_FIDELITY_CATALOGS);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = async (catalog: Catalog) => {
    setDownloadingId(catalog.id);
    try {
      const url = getCatalogDownloadUrl(catalog.id);
      const res = await fetch(url, {
        headers: getUserAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Download requires approved distributor credentials");
      }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${catalog.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(err.message || "Failed to download catalog. Please ensure account is approved.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredCatalogs = useMemo(() => {
    if (brandFilter === "ALL") return catalogs;
    if (brandFilter === "OVERALL") return catalogs.filter((c) => !c.brand);
    return catalogs.filter((c) => c.brand?.slug === brandFilter);
  }, [catalogs, brandFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Top Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Documentation
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Catalogs & Price Books
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Architectural lock specifications, dimensional drawings, and B2B wholesale price schedules.
          </p>
        </div>

        <span className="text-xs font-mono text-muted bg-surface border border-divider rounded-full px-3 py-1 self-start sm:self-auto">
          {catalogs.length} Documents
        </span>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "ALL", label: "All Literature" },
          { id: "s-nafi", label: "S-Nafi Brass" },
          { id: "greek", label: "Greek Mortise" },
          { id: "raksham", label: "Raksham Defense" },
          { id: "OVERALL", label: "Master Price Book" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setBrandFilter(tab.id)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all whitespace-nowrap cursor-pointer touch-manipulation ${
              brandFilter === tab.id
                ? "bg-accent text-background font-bold shadow-xs"
                : "bg-surface border border-divider text-muted hover:text-primary hover:border-accent/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Catalog Cards Grid ── */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider">
            Loading catalogs...
          </p>
        </div>
      ) : filteredCatalogs.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-8 text-center shadow-xs">
          <h4 className="font-serif font-bold text-sm sm:text-base text-primary mb-1">
            No Documents Found
          </h4>
          <p className="text-xs text-muted max-w-xs mx-auto">
            No catalogs available under this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {filteredCatalogs.map((catalog) => {
            const brandSlug = catalog.brand?.slug || "nafi";
            const brandColorClass =
              brandSlug === "greek"
                ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                : brandSlug === "raksham"
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-accent/15 text-accent border-accent/30";

            return (
              <div
                key={catalog.id}
                className="bg-surface border border-divider hover:border-accent/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${brandColorClass}`}
                    >
                      {catalog.brand?.name || "Master"}
                    </span>
                    <span className="text-[10px] font-mono text-muted">PDF Publication</span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-primary mb-1.5 leading-snug">
                    {catalog.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed mb-3">
                    {catalog.brand?.slug === "s-nafi"
                      ? "Pin tumbler configurations, brass metallurgy specs, and master-keying options."
                      : catalog.brand?.slug === "greek"
                      ? "Euro-profile dimensions, anti-pick cylinder schemas, and architectural drawings."
                      : catalog.brand?.slug === "raksham"
                      ? "Hardened shackle ratings, anti-drill carbide plates, and shutter lock schematics."
                      : "Master wholesale price schedule, SKU index, minimum quantities, and freight terms."}
                  </p>
                </div>

                <div className="pt-3 border-t border-divider flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted">
                    Updated{" "}
                    {new Date(catalog.uploadedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownload(catalog)}
                    disabled={downloadingId === catalog.id}
                    className="min-h-[38px] px-4 py-1.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 touch-manipulation"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>
                      {downloadingId === catalog.id ? "Downloading..." : "Download PDF"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

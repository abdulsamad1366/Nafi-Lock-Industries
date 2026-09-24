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
    <div className="space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              Technical Documentation Archive
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Official Catalogs & Price Books
          </h2>
          <p className="text-xs text-muted max-w-xl mt-1">
            Download high-resolution 300 DPI product catalogs, dimensional architectural drawings, keying schedules, and commercial price books.
          </p>
        </div>

        <span className="text-xs font-mono text-muted bg-surface border border-divider rounded-full px-4 py-1.5 self-start md:self-auto">
          {catalogs.length} Technical Documents Available
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Literature" },
          { id: "s-nafi", label: "S-Nafi Brass Series" },
          { id: "greek", label: "Greek Euro-Profile" },
          { id: "raksham", label: "Raksham Armored Defense" },
          { id: "OVERALL", label: "Consolidated Master" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setBrandFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-serif transition-all whitespace-nowrap cursor-pointer ${
              brandFilter === tab.id
                ? "bg-accent text-background font-bold shadow-xs"
                : "bg-surface border border-divider text-muted hover:text-primary hover:border-accent/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Catalog Cards Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider">
            Fetching technical documents...
          </p>
        </div>
      ) : filteredCatalogs.length === 0 ? (
        <div className="bg-surface border border-divider rounded-3xl p-12 text-center shadow-xs">
          <h4 className="font-serif font-bold text-base text-primary mb-1">
            No Documents Found
          </h4>
          <p className="text-xs text-muted max-w-sm mx-auto">
            There are currently no catalog publications under this brand category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="bg-surface border border-divider hover:border-accent/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${brandColorClass}`}
                    >
                      {catalog.brand?.name || "Consolidated Catalog"}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      Official PDF Publication
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors mb-2 leading-snug">
                    {catalog.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed mb-6">
                    {catalog.brand?.slug === "s-nafi"
                      ? "Complete technical specification sheets including pin configurations, brass metallurgy certifications, and master-keying options."
                      : catalog.brand?.slug === "greek"
                      ? "Engineering dimensional profiles, DIN standard ratings, anti-pick cylinder schemas, and architectural installation diagrams."
                      : catalog.brand?.slug === "raksham"
                      ? "Hardened boron shackle testing data, anti-drill carbide plate specifications, and heavy-duty shutter lock schematics."
                      : "Master commercial price schedule, SKU index, minimum order quantities, and factory dispatch parameters."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-background border border-divider rounded-2xl text-[11px] font-mono text-muted">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-muted/80">Format</span>
                      <span className="text-primary font-bold">PDF · 300 DPI Print</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-muted/80">Status</span>
                      <span className="text-accent font-bold">Factory Verified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-divider flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted">
                    Uploaded:{" "}
                    {new Date(catalog.uploadedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownload(catalog)}
                    disabled={downloadingId === catalog.id}
                    className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

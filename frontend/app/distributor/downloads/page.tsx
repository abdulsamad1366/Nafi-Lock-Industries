"use client";

import { useEffect, useState } from "react";
import { getCatalogs, getCatalogDownloadUrl, Catalog } from "@/lib/api";
import { getUserAuthHeaders } from "@/lib/userAuth";

const FALLBACK_CATALOGS: Catalog[] = [
  {
    id: "cat-snafi-2026",
    title: "S-Nafi Solid Brass Master Catalog (Edition 2026-27)",
    fileUrl: "uploads/catalogs/s-nafi-master-2026.pdf",
    brand: { id: "b-snafi", name: "S-Nafi", slug: "s-nafi" },
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
    id: "cat-greek-2026",
    title: "Greek Architectural Mortise & Pin Cylinder Specifications Book",
    fileUrl: "uploads/catalogs/greek-mortise-2026.pdf",
    brand: { id: "b-greek", name: "Greek", slug: "greek" },
    uploadedAt: new Date().toISOString(),
  },
];

export default function DistributorDownloadsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getCatalogs()
      .then((data) => {
        if (data && data.length > 0) {
          setCatalogs(data);
        } else {
          setCatalogs(FALLBACK_CATALOGS);
        }
      })
      .catch((err) => {
        console.error(err);
        setCatalogs(FALLBACK_CATALOGS);
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
        throw new Error("Download requires approved distributor status");
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-divider">
        <h2 className="font-serif text-2xl font-bold text-primary">
          Official PDF Catalogs & Price Books
        </h2>
        <p className="text-xs text-muted">
          Download high-resolution product catalogs, dimensional drawings, and technical cut-sheets
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted font-mono">
          Loading catalog documents...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="bg-surface border border-divider rounded-2xl p-6 flex flex-col justify-between hover:border-accent/40 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent">
                    {catalog.brand?.name || "Full House"}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    PDF Document · 300 DPI
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-primary mb-2">
                  {catalog.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  Complete technical specification sheets including pin configurations, metallurgy certifications, and master-keying options.
                </p>
              </div>

              <div className="pt-4 border-t border-divider flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted">
                  Released:{" "}
                  {new Date(catalog.uploadedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <button
                  type="button"
                  onClick={() => handleDownload(catalog)}
                  disabled={downloadingId === catalog.id}
                  className="px-5 py-2 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
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
          ))}
        </div>
      )}
    </div>
  );
}

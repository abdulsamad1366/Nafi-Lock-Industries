"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/lib/api";

interface CatalogAdminRow {
  id: string;
  title: string;
  fileUrl: string;
  uploadedAt: string;
  brand?: {
    id: string;
    name: string;
  } | null;
}

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<CatalogAdminRow[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Form state
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("http://localhost:5001/api/catalogs").catch(() => null),
        fetch("http://localhost:5001/api/brands").catch(() => null),
      ]);

      if (catRes && catRes.ok) {
        const cJson = await catRes.json();
        setCatalogs(cJson);
      }
      if (brandRes && brandRes.ok) {
        const bJson = await brandRes.json();
        setBrands(bJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      if (brandId) formData.append("brandId", brandId);

      const res = await fetch("http://localhost:5001/api/admin/catalogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to upload catalog PDF");
      }

      setTitle("");
      setBrandId("");
      setFile(null);
      setSuccessMsg("Catalog PDF uploaded and published successfully.");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this catalog PDF?")) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      await fetch(`http://localhost:5001/api/admin/catalogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-divider">
        <h1 className="font-serif text-2xl font-bold text-primary">
          Brand Catalog & PDF Price Books
        </h1>
        <p className="text-xs text-muted">
          Upload and manage official technical documents available for distributor download
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8">
        <h3 className="font-serif font-bold text-lg text-primary mb-1">
          Publish New PDF Catalog
        </h3>
        <p className="text-xs text-muted mb-6">
          PDF documents will be stored securely in the private backend storage and streamed exclusively to authenticated distributors.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-xs">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Catalog Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. S-Nafi Royal Brass Catalog 2026-27"
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Associated Brand (Optional)
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
              >
                <option value="">Full Manufacturing Line (All Brands)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Catalog PDF File (Max 30 MB) *
            </label>
            <input
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-background"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50"
            >
              {isUploading ? "Uploading PDF..." : "Upload & Publish Catalog"}
            </button>
          </div>
        </form>
      </div>

      {/* Catalog List Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-primary">
          Published Catalogs
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-muted font-mono">
            Loading catalogs...
          </div>
        ) : catalogs.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-8 text-center text-xs text-muted">
            No catalogs uploaded yet.
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {catalogs.map((c) => (
                  <tr key={c.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4 font-serif font-bold text-sm text-primary">
                      {c.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-background border border-divider text-accent">
                        {c.brand?.name || "All Brands"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-muted">
                      {new Date(c.uploadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

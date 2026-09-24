"use client";

import { useEffect, useState } from "react";
import { Brand, Category, Product, API_BASE } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("100% Solid Extruded Brass");
  const [size, setSize] = useState("50mm");
  const [finish, setFinish] = useState("Mirror Brass Polish");
  const [numberOfKeys, setNumberOfKeys] = useState(3);
  const [lockingMechanism, setLockingMechanism] = useState("Double Ball-Bearing");
  const [warranty, setWarranty] = useState("5 Years");
  const [dealerPrice, setDealerPrice] = useState<number | "">("");
  const [minOrderQty, setMinOrderQty] = useState<number | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, brandRes, catRes] = await Promise.all([
        fetch(`${API_BASE}/products`).catch(() => null),
        fetch(`${API_BASE}/brands`).catch(() => null),
        fetch(`${API_BASE}/categories`).catch(() => null),
      ]);

      if (prodRes && prodRes.ok) {
        const pJson = await prodRes.json();
        setProducts(pJson);
      }
      if (brandRes && brandRes.ok) {
        const bJson = await brandRes.json();
        setBrands(bJson);
        if (bJson.length > 0 && !brandId) setBrandId(bJson[0].id);
      }
      if (catRes && catRes.ok) {
        const cJson = await catRes.json();
        setCategories(cJson);
        if (cJson.length > 0 && !categoryId) setCategoryId(cJson[0].id);
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

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const payload = {
        name,
        slug,
        brandId,
        categoryId,
        description,
        material,
        size,
        finish,
        numberOfKeys: Number(numberOfKeys),
        lockingMechanism,
        warranty,
        dealerPrice: dealerPrice !== "" ? Number(dealerPrice) : null,
        minOrderQty: minOrderQty !== "" ? Number(minOrderQty) : null,
      };

      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to create product");
      }

      setMsg("Product and B2B pricing saved successfully.");
      setName("");
      setSlug("");
      setDescription("");
      setDealerPrice("");
      setMinOrderQty("");
      await fetchData();
    } catch (err: any) {
      setMsg(err.message || "Error saving product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-divider">
        <h1 className="font-serif text-2xl font-bold text-primary">
          Hardware Products & Wholesale Pricing Matrix
        </h1>
        <p className="text-xs text-muted">
          Configure product specifications, assign brand houses, and define gated dealer prices with minimum order quantities (MOQ)
        </p>
      </div>

      {/* Creation Form */}
      <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8">
        <h3 className="font-serif font-bold text-lg text-primary mb-1">
          Add New Catalog Item & B2B Thresholds
        </h3>
        <p className="text-xs text-muted mb-6">
          Pricing and batch thresholds configured here are gated on the server side and exclusively served to approved distributors.
        </p>

        {msg && (
          <div className="mb-4 p-3 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-xl text-xs">
            {msg}
          </div>
        )}

        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Commercial Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. S-Nafi Classic Solid Brass Padlock 60mm"
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="s-nafi-classic-padlock-60"
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary font-mono focus:outline-hidden focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Manufacturing Brand *
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Product Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gated Dealer Price & MOQ (Requested in prompt) */}
          <div className="p-4 bg-background border border-accent/40 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-accent">
                  Dealer Unit Price (₹ INR) *
                </label>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={dealerPrice}
                onChange={(e) =>
                  setDealerPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                placeholder="e.g. 480.00"
                className="w-full bg-surface border border-divider rounded-xl px-3.5 py-2 text-xs text-primary font-mono font-bold focus:outline-hidden focus:border-accent"
              />
              <span className="text-[10px] text-muted block mt-1">
                Gated: Stripped from public payloads, visible only to approved distributors.
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-accent">
                  Minimum Order Quantity (MOQ) *
                </label>
              </div>
              <input
                type="number"
                min="1"
                required
                value={minOrderQty}
                onChange={(e) =>
                  setMinOrderQty(e.target.value === "" ? "" : parseInt(e.target.value, 10))
                }
                placeholder="e.g. 24"
                className="w-full bg-surface border border-divider rounded-xl px-3.5 py-2 text-xs text-primary font-mono font-bold focus:outline-hidden focus:border-accent"
              />
              <span className="text-[10px] text-muted block mt-1">
                Enforced strictly during B2B order cart placement and server validation.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Engineering Specification Summary *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Hand-finished solid brass body with paracentric keyway and double ball-bearing shackle locking."
              className="w-full bg-background border border-divider rounded-xl p-3 text-xs text-primary focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3 py-1.5 text-xs text-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Size
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3 py-1.5 text-xs text-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Finish
              </label>
              <input
                type="text"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="w-full bg-background border border-divider rounded-xl px-3 py-1.5 text-xs text-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Keys Count
              </label>
              <input
                type="number"
                value={numberOfKeys}
                onChange={(e) => setNumberOfKeys(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-background border border-divider rounded-xl px-3 py-1.5 text-xs text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50"
            >
              {isSaving ? "Saving Product..." : "Save Product & Pricing"}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-primary">
          Master Products Matrix ({products.length})
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-muted font-mono">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-surface border border-divider rounded-2xl p-8 text-center text-xs text-muted">
            No products configured yet.
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Dealer Price</th>
                  <th className="p-4">Min. Batch (MOQ)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4 font-serif font-bold text-primary">
                      {p.name}
                      <span className="block text-[10px] font-mono text-muted font-normal">
                        {p.size} · {p.material}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-background border border-divider text-accent">
                        {p.brand?.name}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{p.category?.name}</td>
                    <td className="p-4 font-mono font-bold text-accent">
                      {p.dealerPrice ? `₹${Number(p.dealerPrice).toLocaleString("en-IN")}` : "Unset"}
                    </td>
                    <td className="p-4 font-mono text-primary font-semibold">
                      {p.minOrderQty ? `${p.minOrderQty} units` : "1 unit"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Active
                      </span>
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

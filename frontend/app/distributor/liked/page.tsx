"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLikedProducts, unlikeProduct, Product } from "@/lib/api";
import { useOrderCart } from "@/components/OrderCartProvider";

export default function DistributorLikedPage() {
  const { addItem } = useOrderCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiked = async () => {
    try {
      const data = await getLikedProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  const handleUnlike = async (id: string) => {
    try {
      await unlikeProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    const minQty = product.minOrderQty || 1;
    addItem({
      productId: product.id,
      name: product.name,
      modelCode: product.size,
      image: product.images && product.images[0] ? product.images[0] : undefined,
      unitPrice: Number(product.dealerPrice || 0),
      minOrderQty: minQty,
      quantity: minQty,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Saved Locks
          </h2>
          <p className="text-xs text-muted">
            Bookmarked catalog models for quick re-stocking.
          </p>
        </div>
        <span className="font-mono text-xs text-muted bg-surface px-3 py-1 rounded-full border border-divider">
          {products.length} Saved
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted font-mono">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-2" />
          Loading saved products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-base text-primary mb-1">
            No Bookmarked Locks
          </h3>
          <p className="text-xs text-muted max-w-xs mx-auto mb-5">
            Bookmark high-turnover lock models in the catalog for instant re-ordering.
          </p>
          <Link
            href="/#catalog"
            className="min-h-[42px] px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors inline-flex items-center justify-center touch-manipulation"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface border border-divider hover:border-accent/40 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="aspect-square bg-background p-3 sm:p-4 flex items-center justify-center relative border-b border-divider">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={110}
                      height={110}
                      className="object-contain max-h-24 sm:max-h-32"
                    />
                  ) : (
                    <span className="font-mono text-xs text-muted">LOCK</span>
                  )}
                  <button
                    onClick={() => handleUnlike(product.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface/90 border border-divider text-rose-500 shadow-xs flex items-center justify-center cursor-pointer touch-manipulation hover:bg-rose-50"
                    title="Remove from saved"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <div className="p-3 sm:p-3.5">
                  <span className="text-[9px] font-mono text-muted uppercase tracking-wider block mb-0.5 truncate">
                    {product.brand?.name || "Lock Series"}
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-primary mb-2 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs bg-background p-1.5 sm:p-2 rounded-xl border border-divider mb-2.5">
                    <span className="font-mono font-bold text-accent text-[11px] sm:text-xs">
                      ₹{Number(product.dealerPrice || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-muted">
                      MOQ: {product.minOrderQty || 1}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 pt-0 space-y-1.5">
                <Link
                  href={`/products/${product.slug}`}
                  className="w-full block py-1.5 px-2 rounded-xl border border-divider bg-background hover:bg-surface text-primary text-[11px] sm:text-xs font-serif font-medium transition-all text-center shadow-2xs hover:border-accent/60 touch-manipulation"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-1.5 sm:py-2 rounded-xl font-serif font-bold text-[11px] sm:text-xs transition-colors shadow-xs cursor-pointer touch-manipulation flex items-center justify-center gap-1 ${
                    addedId === product.id
                      ? "bg-emerald-600 text-white"
                      : "bg-accent text-background hover:bg-accent-hover"
                  }`}
                >
                  {addedId === product.id ? "✓ Added" : `+ Add MOQ (${product.minOrderQty || 1})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLikedProducts, unlikeProduct, Product } from "@/lib/api";

export default function AccountLikedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiked = async () => {
    setIsLoading(true);
    try {
      const data = await getLikedProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load liked products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  const handleUnlike = async (productId: string) => {
    try {
      await unlikeProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to unlike product", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-xl font-bold text-primary">
            Saved & Liked Products
          </h2>
          <p className="text-xs text-muted">
            Lock models you have bookmarked for quotation or reference
          </p>
        </div>
        <span className="font-mono text-xs text-muted bg-surface px-3 py-1 rounded-full border border-divider">
          {products.length} Items Saved
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-mono">Loading saved hardware...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-base text-primary mb-1">
            No Liked Products Yet
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            Click the heart icon on any lock model in our catalog to save it here for easy reference.
          </p>
          <Link
            href="/#catalog"
            className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors"
          >
            Browse Master Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-background p-6 flex items-center justify-center relative border-b border-divider">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="font-mono text-xs text-muted">LOCK</span>
                  )}
                  <button
                    onClick={() => handleUnlike(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-surface border border-divider text-red-500 hover:bg-red-50 transition-colors shadow-xs"
                    title="Remove from saved"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    {product.brand && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-divider text-accent font-semibold">
                        {product.brand.name}
                      </span>
                    )}
                    {product.category && (
                      <span className="text-[10px] font-mono text-muted">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-primary mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted line-clamp-2 mb-3">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/contact?product=${product.id}`}
                  className="w-full block py-2 text-center text-xs font-serif font-bold rounded-xl bg-background border border-divider text-primary hover:border-accent transition-colors"
                >
                  Request Technical Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

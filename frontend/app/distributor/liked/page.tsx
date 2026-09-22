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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">
            Saved Wholesale Products
          </h2>
          <p className="text-xs text-muted">
            Lock lines bookmarked for recurring dealer stock orders
          </p>
        </div>
        <span className="font-mono text-xs text-muted bg-surface px-3 py-1 rounded-full border border-divider">
          {products.length} Items Saved
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted font-mono">
          Loading saved products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <h3 className="font-serif font-bold text-base text-primary mb-1">
            No Bookmarked Products
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            Bookmark high-turnover lock models in the dealer catalog to reorder quickly from this tab.
          </p>
          <Link
            href="/distributor/catalog"
            className="px-5 py-2.5 bg-accent text-background rounded-full font-serif font-bold text-xs hover:bg-accent-hover transition-colors"
          >
            Browse Dealer Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-4/3 bg-background p-6 flex items-center justify-center relative border-b border-divider">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={140}
                      height={140}
                      className="object-contain"
                    />
                  ) : (
                    <span className="font-mono text-xs text-muted">LOCK</span>
                  )}
                  <button
                    onClick={() => handleUnlike(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-surface border border-divider text-red-500 shadow-xs"
                    title="Remove from saved"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">
                    {product.brand?.name}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-primary mb-2 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-divider mb-3">
                    <span className="font-mono font-bold text-accent">
                      ₹{Number(product.dealerPrice || 0).toLocaleString("en-IN")} / pc
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      MOQ: {product.minOrderQty || 1}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2 bg-accent text-background rounded-xl font-serif font-bold text-xs hover:bg-accent-hover transition-colors shadow-xs"
                >
                  Add Batch to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

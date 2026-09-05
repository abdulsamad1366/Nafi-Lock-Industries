import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import { ArrowLeft } from "lucide-react";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-steel-500 hover:text-graphite-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <span className="text-xs font-mono text-steel-400">
            Catalog / {product.category?.name || "Hardware"} / SKU: {product.sku}
          </span>
        </div>

        {/* Client Interactive Product View */}
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}

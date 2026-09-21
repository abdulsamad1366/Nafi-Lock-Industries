import Image from "next/image";

interface ProductCardProps {
  name: string;
  brand?: string;
  category?: string;
  material: string;
  size: string;
  finish: string;
  image: string;
}

/**
 * Product card — consistent grid item per design system:
 * image placeholder on top, name + brand tag + key spec below.
 */
export default function ProductCard({
  name,
  brand,
  category,
  material,
  size,
  finish,
  image,
}: ProductCardProps) {
  return (
    <div className="bg-surface border border-divider rounded-lg overflow-hidden">
      {/* Product image */}
      <div className="aspect-square bg-background flex items-center justify-center p-6">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">{name}</h3>
        {brand && (
          <span className="inline-block text-xs font-mono bg-background border border-divider rounded px-2 py-0.5 text-muted mb-2">
            {brand}
          </span>
        )}
        <div className="text-xs text-muted font-mono space-y-0.5 mt-2">
          <p>{material} · {size}</p>
          <p>{finish}</p>
        </div>
      </div>
    </div>
  );
}

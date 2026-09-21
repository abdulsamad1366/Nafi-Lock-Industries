import Image from "next/image";

/**
 * ============================================================================
 * Props Interface: ProductCardProps
 * ============================================================================
 * Type contract for rendering an individual lock item in the catalog.
 * - name: Commercial product title (e.g. "S-Nafi Brass Padlock 60mm")
 * - brand: Sister brand identifier ("S-Nafi", "Greek", or "Raksham")
 * - category: Product grouping (e.g. "Padlocks", "Mortise Locks", "Cylinders")
 * - material: Manufacturing metallurgy (e.g. "Solid Forged Brass", "Hardened Boron Steel")
 * - size: Dimensional specification (e.g. "50mm", "65mm", "70mm")
 * - finish: Protective surface treatment (e.g. "Satin Brass", "Chrome Plated", "Matte Black")
 * - image: Public image URL or optimized path
 */
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
 * ============================================================================
 * Component: ProductCard
 * ============================================================================
 * Standardized catalog display card adhering to the industrial design system.
 *
 * Structure:
 * - Square Image Stage: Aspect-square container with light background and padding.
 * - Card Body: Product title, monospace brand badge, and technical specifications.
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
    <div className="bg-surface border border-divider rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ── Product Imagery Stage ── */}
      <div className="aspect-square bg-background flex items-center justify-center p-6 border-b border-divider">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* ── Product Specification Details ── */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-medium text-sm mb-1 text-primary">{name}</h3>

        {/* Brand Badge */}
        {brand && (
          <span className="inline-block text-xs font-mono bg-background border border-divider rounded px-2 py-0.5 text-muted mb-2">
            {brand}
          </span>
        )}

        {/* Technical Specs (Monospace for engineering clarity) */}
        <div className="text-xs text-muted font-mono space-y-0.5 mt-2">
          <p>
            {material} · {size}
          </p>
          <p>{finish}</p>
        </div>
      </div>
    </div>
  );
}

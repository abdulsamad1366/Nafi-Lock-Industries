import React from "react";

interface ProductSpecTableProps {
  material?: string | null;
  size?: string | null;
  finish?: string | null;
  numberOfKeys?: number | string | null;
  lockingMechanism?: string | null;
  warranty?: string | null;
}

interface SpecRow {
  label: string;
  value: string;
}

export default function ProductSpecTable({
  material,
  size,
  finish,
  numberOfKeys,
  lockingMechanism,
  warranty,
}: ProductSpecTableProps) {
  const rows: SpecRow[] = [];

  if (material && material.trim()) {
    rows.push({ label: "Core Material", value: material.trim() });
  }

  if (size && size.trim()) {
    rows.push({ label: "Dimensions / Size", value: size.trim() });
  }

  if (finish && finish.trim()) {
    rows.push({ label: "Surface Finish", value: finish.trim() });
  }

  if (
    numberOfKeys !== undefined &&
    numberOfKeys !== null &&
    numberOfKeys !== "" &&
    Number(numberOfKeys) > 0
  ) {
    rows.push({
      label: "Number of Keys",
      value: `${numberOfKeys} ${Number(numberOfKeys) === 1 ? "Key" : "Keys"} (High-Security Precision)`,
    });
  }

  if (
    lockingMechanism &&
    lockingMechanism.trim() &&
    lockingMechanism.trim().toUpperCase() !== "N/A"
  ) {
    rows.push({ label: "Locking Mechanism", value: lockingMechanism.trim() });
  }

  if (warranty && warranty.trim()) {
    rows.push({ label: "Factory Warranty", value: warranty.trim() });
  }

  // If no specs exist, don't render anything
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-divider overflow-hidden bg-surface shadow-2xs">
      <div className="px-5 py-3.5 bg-background/50 border-b border-divider flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
          Technical Specifications
        </h4>
        <span className="text-[10px] font-mono text-muted uppercase">
          Standard Tolerances
        </span>
      </div>

      <div className="divide-y divide-divider/70 text-xs">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid grid-cols-1 sm:grid-cols-12 px-5 py-3.5 transition-colors ${
              index % 2 === 0 ? "bg-surface" : "bg-background/30"
            }`}
          >
            <div className="sm:col-span-5 text-muted font-medium flex items-center mb-1 sm:mb-0">
              {row.label}
            </div>
            <div className="sm:col-span-7 font-mono text-primary font-medium flex items-center">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

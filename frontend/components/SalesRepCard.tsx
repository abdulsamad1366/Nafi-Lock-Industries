"use client";

import { useState } from "react";
import Image from "next/image";
import { SalesRep } from "@/lib/api";

interface SalesRepCardProps {
  rep?: SalesRep | null;
  className?: string;
}

export default function SalesRepCard({ rep, className = "" }: SalesRepCardProps) {
  const [imageError, setImageError] = useState(false);

  if (!rep) {
    return (
      <div className={`bg-surface border border-divider rounded-2xl p-4 sm:p-6 shadow-xs ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">
            DEDICATED SALES REPRESENTATIVE
          </span>
        </div>
        <h4 className="font-serif font-bold text-base text-primary mb-1">
          Representative Assignment Pending
        </h4>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          A regional factory manager from our commercial wholesale division will be assigned to your account upon territory dispatch confirmation.
        </p>
        <div className="pt-2 border-t border-divider text-xs text-muted flex items-center justify-between">
          <span>Factory Central Hotline</span>
          <a
            href="tel:+919045582310"
            className="font-mono font-bold text-accent hover:underline"
          >
            +91 90455 82310
          </a>
        </div>
      </div>
    );
  }

  const initials =
    rep.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SR";

  return (
    <div className={`bg-surface border border-divider rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs ${className}`}>
      {/* Header Tagline & Assigned Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-muted font-bold">
            DEDICATED SALES REPRESENTATIVE
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          Factory Assigned
        </span>
      </div>

      {/* Rep Details */}
      <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
        {/* Photo or Monogram */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center text-accent font-serif font-bold text-lg sm:text-xl shrink-0 overflow-hidden shadow-2xs">
          {rep.photoUrl && !imageError ? (
            <Image
              src={rep.photoUrl}
              alt={rep.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="font-serif font-bold text-base sm:text-lg text-primary truncate">
            {rep.name}
          </h4>
          <p className="text-xs text-muted font-sans">Factory Commercial Executive</p>
          <div className="flex items-center gap-2 mt-1">
            <a
              href={`tel:${rep.phone.replace(/[^0-9+]/g, "")}`}
              className="font-mono text-xs sm:text-sm text-accent font-bold hover:underline tracking-wide touch-manipulation inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{rep.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t border-divider">
        <a
          href={`mailto:${rep.email}`}
          className="py-2.5 px-3 text-center rounded-xl bg-background border border-divider text-xs text-primary font-serif font-semibold hover:border-accent hover:text-accent transition-all truncate touch-manipulation shadow-2xs"
        >
          Email Rep
        </a>
        <a
          href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
            rep.name
          )},%20inquiring%20about%20my%20Nafi%20Lock%20distributor%20account`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-xs text-white font-serif font-bold transition-all flex items-center justify-center gap-1.5 touch-manipulation shadow-xs"
        >
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

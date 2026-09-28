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
      <div className={`bg-surface border border-divider rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
              Account Manager
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-500 font-semibold">Assigning Soon</span>
        </div>
        <p className="text-xs text-muted mb-3">
          Your dedicated commercial manager will be linked upon territory route scheduling.
        </p>
        <div className="pt-2.5 border-t border-divider flex items-center justify-between text-xs">
          <span className="text-muted">Factory Hotline:</span>
          <a
            href="tel:+919045582310"
            className="font-mono font-bold text-accent hover:underline touch-manipulation"
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

  const cleanPhone = rep.phone.replace(/[^0-9+]/g, "");

  return (
    <div className={`bg-surface border border-divider rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs ${className}`}>
      {/* Header Tagline & Assigned Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
            Dedicated Sales Executive
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Active
        </span>
      </div>

      {/* Rep Details */}
      <div className="flex items-center gap-3 sm:gap-4 mb-3.5">
        {/* Photo or Monogram */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-serif font-bold text-base sm:text-lg shrink-0 overflow-hidden shadow-2xs">
          {rep.photoUrl && !imageError ? (
            <Image
              src={rep.photoUrl}
              alt={rep.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-serif font-bold text-sm sm:text-base text-primary truncate">
            {rep.name}
          </h4>
          <p className="text-[11px] text-muted">Factory Wholesale Support</p>
          <a
            href={`tel:${cleanPhone}`}
            className="font-mono text-xs text-accent font-bold hover:underline tracking-wide touch-manipulation inline-flex items-center gap-1 mt-0.5"
          >
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{rep.phone}</span>
          </a>
        </div>
      </div>

      {/* Quick Action Buttons (Call, WhatsApp, Email) */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-divider">
        <a
          href={`tel:${cleanPhone}`}
          className="min-h-[44px] px-2 py-2 text-center rounded-xl bg-background border border-divider text-xs text-primary font-semibold hover:border-accent hover:text-accent active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 touch-manipulation shadow-2xs"
          title={`Call ${rep.name}`}
        >
          <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="font-medium whitespace-nowrap tracking-tight">Call</span>
        </a>

        <a
          href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
            rep.name
          )},%20inquiring%20about%20my%20Nafi%20Lock%20distributor%20account`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-2 py-2 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-xs text-white font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 touch-manipulation shadow-2xs"
          title={`WhatsApp ${rep.name}`}
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.861.899 2.796.899 3.182 0 5.769-2.587 5.77-5.767.001-3.182-2.585-5.769-5.766-5.769zm3.387 8.169c-.145.409-.844.757-1.164.805-.319.049-.733.073-2.385-.599-1.993-.81-3.266-2.825-3.366-2.957-.099-.133-.804-1.071-.804-2.043 0-.972.51-1.45.691-1.649.181-.199.395-.249.527-.249.132 0 .264.002.378.007.121.006.283-.046.443.338.166.398.568 1.385.618 1.487.05.102.083.221.016.353-.066.133-.1.215-.198.331-.099.116-.208.26-.297.35-.099.099-.202.207-.087.405.115.198.513.847 1.1 1.37.756.673 1.393.882 1.591.981.198.099.314.083.43-.05.116-.133.496-.579.628-.778.132-.199.264-.165.446-.099.182.066 1.155.545 1.353.644.198.099.33.149.379.232.049.083.049.48-.096.889z" />
          </svg>
          <span className="font-bold whitespace-nowrap tracking-tight">WhatsApp</span>
        </a>

        <a
          href={`mailto:${rep.email}`}
          className="min-h-[44px] px-2 py-2 text-center rounded-xl bg-background border border-divider text-xs text-primary font-semibold hover:border-accent hover:text-accent active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 touch-manipulation shadow-2xs"
          title={`Email ${rep.name}`}
        >
          <svg className="w-5 h-5 text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span className="font-medium whitespace-nowrap tracking-tight">Email</span>
        </a>
      </div>
    </div>
  );
}

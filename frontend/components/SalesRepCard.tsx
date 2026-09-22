import Image from "next/image";
import { SalesRep } from "@/lib/api";

interface SalesRepCardProps {
  rep?: SalesRep | null;
}

export default function SalesRepCard({ rep }: SalesRepCardProps) {
  if (!rep) {
    return (
      <div className="bg-surface border border-divider rounded-2xl p-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2">
          DEDICATED ACCOUNT EXECUTIVE
        </span>
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

  return (
    <div className="bg-surface border border-divider rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">
          DEDICATED SALES REPRESENTATIVE
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Photo or Monogram */}
        <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-serif font-bold text-lg shrink-0 overflow-hidden">
          {rep.photoUrl ? (
            <Image
              src={rep.photoUrl}
              alt={rep.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>{rep.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h4 className="font-serif font-bold text-base text-primary">
            {rep.name}
          </h4>
          <p className="text-xs text-muted">Factory Commercial Executive</p>
          <div className="flex items-center gap-2 mt-1">
            <a
              href={`tel:${rep.phone}`}
              className="font-mono text-xs text-accent font-semibold hover:underline"
            >
              {rep.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-divider">
        <a
          href={`mailto:${rep.email}`}
          className="py-2 px-3 text-center rounded-xl bg-background border border-divider text-xs text-primary font-medium hover:border-accent transition-colors truncate"
        >
          Email Rep
        </a>
        <a
          href={`https://wa.me/${rep.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
            rep.name
          )},%20inquiring%20about%20my%20Nafi%20Lock%20distributor%20account`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs text-white font-medium transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

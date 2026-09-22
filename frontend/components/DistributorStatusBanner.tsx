import Link from "next/link";
import { DistributorStatus } from "@/lib/userAuth";

interface DistributorStatusBannerProps {
  status: DistributorStatus | null;
  companyName?: string;
}

export default function DistributorStatusBanner({
  status,
  companyName,
}: DistributorStatusBannerProps) {
  if (status === "APPROVED") return null;

  if (status === "REJECTED") {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-500">
                  APPLICATION STATUS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white uppercase">
                  Not Approved
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mt-1">
                Wholesale Application Notice
              </h3>
              <p className="text-xs text-muted max-w-xl mt-1 leading-relaxed">
                Your application for wholesale distributorship under {companyName || "your business"} was not approved at this time. Please contact the factory administration desk to resolve missing documentation or territory inquiries.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-5 py-2.5 bg-background border border-divider hover:border-red-500 text-xs font-semibold rounded-full text-primary transition-colors text-center shrink-0"
          >
            Contact Factory Office
          </Link>
        </div>
      </div>
    );
  }

  // PENDING (Default fallback)
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                APPLICATION STATUS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase">
                Pending Factory Review
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mt-1">
              Distributor Account Under Verification
            </h3>
            <p className="text-xs text-muted max-w-xl mt-1 leading-relaxed">
              Your wholesale application for <span className="font-semibold text-primary">{companyName || "your business"}</span> is being audited by our Aligarh plant commercial team. Tier-1 dealer pricing, bulk ordering cart, and financial ledgers will activate immediately once approved.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/919045582310?text=Hi%20Nafi%20Lock%20Industries,%20checking%20status%20of%20distributor%20application"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-2"
          >
            <span>WhatsApp Priority Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}

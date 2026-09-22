"use client";

import Image from "next/image";
import Link from "next/link";

const DEALER_BENEFITS = [
  {
    title: "Direct Factory Margins",
    desc: "Bypass middlemen with competitive Tier-1 distributor pricing and volume rebates.",
    icon: "💎",
  },
  {
    title: "48-Hour Pan-India Dispatch",
    desc: "Robust logistics infrastructure with direct freight dispatches to 28+ states.",
    icon: "🚚",
  },
  {
    title: "OEM & Master Keying",
    desc: "Bespoke lock manufacturing, private labeling, and custom institutional key suites.",
    icon: "⚙️",
  },
  {
    title: "Dedicated Account Support",
    desc: "Direct access to factory representatives, sample kits, and retail merchandising displays.",
    icon: "🤝",
  },
];

export default function FactoryCTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Background Gold Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#C49A45]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Ambient Crest Watermark */}
      <div className="absolute -left-20 -bottom-20 w-96 h-96 pointer-events-none opacity-5 select-none invert">
        <Image
          src="/images/nafi-crest-watermark.png"
          alt="Crest"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Pre-title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs text-[#C49A45] text-[11px] font-mono uppercase tracking-widest mb-4 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-pulse" />
            <span>Factory Wholesale & Dealership Network</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
            Partner Directly with India’s Premier Lock Foundry
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Whether you are an established hardware distributor, a retail chain, or an architectural
            specifier, Nafi Lock Industries delivers unmatched manufacturing quality and lucrative B2B partnership terms.
          </p>
        </div>

        {/* 4 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {DEALER_BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-[#C49A45]/40 transition-all duration-300 backdrop-blur-xs"
            >
              <div className="text-2xl mb-3">{benefit.icon}</div>
              <h3 className="font-serif text-base font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Panel Container */}
        <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 rounded-3xl p-8 sm:p-10 text-center backdrop-blur-md">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3">
            Ready to Expand Your Lock & Hardware Inventory?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-8">
            Contact our factory sales office in Aligarh directly. Receive our official product
            catalogs, wholesale price matrix, and dealership application within hours.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
            <Link
              href="/contact?type=dealership"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C49A45] hover:bg-[#B8923F] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-102 text-center"
            >
              Apply for Dealership & Price Book
            </Link>

            <a
              href="https://wa.me/919045582310?text=Hello%2C%20I%20am%20interested%20in%20becoming%20an%20authorized%20dealer%20for%20Nafi%20Lock%20Industries."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {/* WhatsApp Icon */}
              <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Factory Info */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs text-gray-400 font-mono">
            <div>
              <span className="text-gray-500">Factory Office:</span> +91 90455 82310
            </div>
            <div>
              <span className="text-gray-500">Corporate:</span> +91 94125 61765
            </div>
            <div>
              <span className="text-gray-500">Email:</span> nafilocks@gmail.com
            </div>
            <div>
              <span className="text-gray-500">Location:</span> G.T. Road, Aligarh, U.P.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

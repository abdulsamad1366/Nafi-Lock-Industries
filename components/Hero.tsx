import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-graphite-900 text-white overflow-hidden border-b border-steel-100/20">
      <div className="max-w-7xl mx-auto min-h-[540px] lg:min-h-[620px] grid grid-cols-1 lg:grid-cols-12 relative items-center">
        {/* Overlapping Off-Center Headline & Content */}
        <div className="lg:col-span-7 z-10 px-6 sm:px-12 py-16 lg:py-24 bg-graphite-900/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-graphite-800 border border-graphite-700 rounded text-brass-500 text-xs font-mono mb-6">
            <Cpu className="w-3.5 h-3.5" /> Machined Brass & Hardened Steel — 0.02mm Tolerance
          </div>

          <h1 className="font-space font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-6">
            Solid brass mortise lock cylinders and architectural hardware.
          </h1>

          <p className="font-inter text-steel-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Computerised dimple keyways, anti-drill hardened pins, and 250,000-cycle endurance rating. Direct from factory for retail and wholesale dealers.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/category/door-locks"
              className="bg-brass-600 hover:bg-brass-500 text-white font-space font-semibold px-6 py-3.5 rounded-sm flex items-center gap-2 text-sm tracking-wide transition-colors"
            >
              Shop the Range <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dealer/apply"
              className="bg-transparent hover:bg-graphite-800 text-steel-300 hover:text-white font-space px-6 py-3.5 rounded-sm border border-steel-500/40 text-sm tracking-wide transition-colors"
            >
              Apply as Dealer (Tiered Rates)
            </Link>
          </div>

          {/* Quick Technical Specs Strip */}
          <div className="mt-12 pt-8 border-t border-graphite-800 grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-mono text-steel-400">MATERIAL</div>
              <div className="font-semibold text-white font-space mt-0.5">Grade 304 Brass</div>
            </div>
            <div>
              <div className="font-mono text-steel-400">EN STANDARDS</div>
              <div className="font-semibold text-white font-space mt-0.5">EN 1303 Class 6</div>
            </div>
            <div>
              <div className="font-mono text-steel-400">WARRANTY</div>
              <div className="font-semibold text-brass-500 font-space mt-0.5">10 Years Mechanical</div>
            </div>
          </div>
        </div>

        {/* Full-bleed Macro Product Photo (Right aligned, overlapping edge) */}
        <div className="lg:col-span-5 absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
          <div className="relative w-full h-full min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200"
              alt="Macro view of Mortise Lock Cylinder"
              fill
              priority
              className="object-cover object-center filter contrast-[1.08] brightness-[0.9]"
            />
            {/* Dark gradient overlay for text overlap blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-graphite-900 via-graphite-900/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "./theme.css";

/**
 * ============================================================================
 * Brand Showcase Page: Greek (Coming Soon Commissioning Screen)
 * ============================================================================
 * High-craft architectural aesthetic reflecting the classical Aegean identity.
 * Framed between the root layout Header and Footer.
 */
export default function GreekBrandPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
    }, 600);
  };

  const milestones = [
    {
      step: "01",
      title: "Metallurgical Formulation",
      desc: "Hardened boron alloy & high-density brass extrusion specifications validated.",
      progress: "100%",
      status: "COMPLETED",
    },
    {
      step: "02",
      title: "Precision Die Tooling",
      desc: "Architectural column contours and heavy mortise housings finalized at Aligarh plant.",
      progress: "94%",
      status: "CALIBRATION",
    },
    {
      step: "03",
      title: "Security & Anti-Pick Certification",
      desc: "Independent lab testing for hydraulic shear, drill resistance, and tumbler bypass.",
      progress: "82%",
      status: "TESTING",
    },
    {
      step: "04",
      title: "Commercial Dealership Launch",
      desc: "First batch priority allocation for authorized Indian wholesale stockists.",
      progress: "SOON",
      status: "Q3 2026",
    },
  ];

  const specs = [
    { label: "Core Metal", val: "Extruded Solid Brass & Cold-Forged Steel" },
    { label: "Locking Core", val: "6-Pin Computerized Anti-Pick Tumbler" },
    { label: "Shackle Hardness", val: "HRC 62+ Boron Alloy Heavy Shackle" },
    { label: "Corrosion Shield", val: "Marine-Grade 240hr Salt Spray Certified" },
    { label: "Factory Warranty", val: "5-Year Factory Replacement Assurance" },
    { label: "Origin", val: "Precision Engineered in Aligarh, India" },
  ];

  return (
    <div data-theme="greek" className="min-h-screen bg-background text-primary selection:bg-[#235F8E]/20 relative overflow-hidden">
      {/* ── Background Architectural Glows & Watermarks ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#235F8E]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-[#17476D]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Subtle Greek Watermark Crest */}
      <div
        className="absolute top-28 right-8 md:right-24 w-[420px] aspect-[1024/759] opacity-[0.035] pointer-events-none select-none -z-10"
        aria-hidden="true"
      >
        <Image
          src="/images/nafi-crest-watermark.png"
          alt="Watermark Crest"
          fill
          className="object-contain"
          priority={false}
        />
      </div>

      {/* ── Hero Section: The Classical Architecture ── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-divider overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#235F8E]/10 border border-[#235F8E]/30 text-[#235F8E] font-mono text-[11px] font-bold tracking-wider uppercase mb-6 backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#235F8E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#235F8E]" />
            </span>
            <span>Commissioning & Tooling Phase • Coming Soon</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-primary">
                Greek
                <span className="block font-serif font-normal italic text-2xl sm:text-3xl md:text-4xl text-[#235F8E] mt-2">
                  Classical Strength. Modern Security.
                </span>
              </h1>

              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-xl">
                Inspired by the monumental endurance of classical Hellenic architecture, the{" "}
                <strong className="text-primary font-semibold">Greek</strong> line of precision-engineered locks
                combines cold-forged internal tumblers with sculptural aesthetic excellence.
              </p>

              <div className="p-4 rounded-2xl bg-surface border border-divider flex items-center gap-4 text-xs font-mono text-muted max-w-lg shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#235F8E]/15 text-[#235F8E] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <span className="text-primary font-bold block">Aligarh Plant Production Status</span>
                  <span>Tooling calibration & mechanical stress validation in progress.</span>
                </div>
              </div>

              {/* VIP Notification Form */}
              <div className="pt-2">
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <div>
                        <strong className="font-semibold block font-serif text-sm">
                          You’re on the Greek Priority Register!
                        </strong>
                        <span>We will notify you immediately once dealership batches open for order.</span>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="space-y-3">
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-muted font-bold">
                        Receive First Batch Wholesale Allocation:
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="dealer@hardwarestore.com"
                          className="flex-1 bg-surface border border-divider rounded-xl px-4 py-3 text-xs text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-[#235F8E] focus:ring-1 focus:ring-[#235F8E] transition-all font-mono"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-[#235F8E] text-white font-serif font-bold text-xs rounded-xl hover:bg-[#17476D] active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {isSubmitting ? "Registering..." : "Notify Me →"}
                        </button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Visual Column Sculpture Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-divider shadow-xl bg-surface group">
                <Image
                  src="/images/hero-greek.jpg"
                  alt="Greek Architectural Locks Preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9] contrast-[1.05]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase border border-white/30 text-white font-bold inline-block mb-2">
                    Coming Q3 2026
                  </span>
                  <h3 className="font-serif text-2xl font-bold leading-tight">
                    The Doric & Corinthian Lock Series
                  </h3>
                  <p className="text-xs text-white/80 font-mono mt-1">
                    Heavy-duty architectural padlocks & mortise deadbolts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Launch Milestone Roadmap ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-divider bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#235F8E] font-bold block mb-2">
              Engineering Progression
            </span>
            <h2 className="font-serif text-3xl font-bold text-primary">
              The Path to Commercial Commissioning
            </h2>
            <p className="text-xs text-muted mt-2">
              Every Greek lock must satisfy stringent tensile, pry-resistance, and finish durability standards before field release.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <div
                key={m.step}
                className="bg-background border border-divider hover:border-[#235F8E]/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-[#235F8E]">
                      {m.step}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#235F8E]/10 text-[#235F8E] border border-[#235F8E]/20">
                      {m.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-primary mb-1.5 group-hover:text-[#235F8E] transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed mb-6">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-divider flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>Progress</span>
                  <span className="font-bold text-[#235F8E]">{m.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Sneak Peek Technical Specifications ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-divider">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#235F8E] font-bold block mb-1">
                Aligarh Plant Blueprint
              </span>
              <h2 className="font-serif text-3xl font-bold text-primary">
                Preview Engineering Standards
              </h2>
            </div>
            <p className="text-xs text-muted max-w-sm">
              Pre-release specifications subject to final verification upon batch certification.
            </p>
          </div>

          <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs divide-y divide-divider">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-background/50 transition-colors text-xs"
              >
                <span className="font-mono uppercase tracking-wider text-muted text-[11px]">
                  {spec.label}
                </span>
                <span className="font-serif font-bold text-sm text-primary">
                  {spec.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Explore Active Manufactured Brands CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent font-bold block">
            Available Immediately
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
            Explore Active Manufacturing Lines
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            While Greek prepares for official commissioning, our flagship{" "}
            <strong className="text-primary font-semibold">S-Nafi</strong> brass padlocks and{" "}
            <strong className="text-primary font-semibold">Raksham</strong> heavy armor lines are available for direct purchase and distributor dispatch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/brands/s-nafi"
              className="px-6 py-3 bg-[#9A7228] text-white rounded-full font-serif font-bold text-xs hover:bg-[#7E5B18] transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Explore S-Nafi Brass Locks</span>
              <span>→</span>
            </Link>

            <Link
              href="/brands/raksham"
              className="px-6 py-3 bg-surface border border-divider hover:border-primary text-primary rounded-full font-serif font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Explore Raksham Armor</span>
              <span>→</span>
            </Link>

            <Link
              href="/contact?brand=greek"
              className="px-6 py-3 bg-surface border border-[#235F8E]/30 text-[#235F8E] hover:bg-[#235F8E]/10 rounded-full font-serif font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              Contact Dealer Relations Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

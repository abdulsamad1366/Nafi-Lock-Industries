"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ============================================================================
 * Type Definitions & Data
 * ============================================================================
 */
interface Pillar {
  number: string;
  title: string;
  tag: string;
  description: string;
  specs: string[];
  icon: "casting" | "precision" | "armor" | "finish";
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Virgin Metallurgical Casting",
    tag: "100% Solid Extruded Brass",
    description:
      "Unlike sintered metal or hollow die-cast imitations, Nafi locks are cast using high-purity virgin copper and zinc alloys. Our in-house foundry guarantees zero internal porosity, microscopic grain density, and lifelong resistance to stress fractures.",
    specs: ["Zero-Porosity Guarantee", "60/40 Copper-Zinc Ratio", "Resists Brittle Fractures"],
    icon: "casting",
  },
  {
    number: "02",
    title: "Micron-Tolerance CNC Machining",
    tag: "±0.02mm Pin Accuracy",
    description:
      "Every tumbler cylinder, keyway broach, and pin chamber is computerized down to 20-micron tolerances. Our anti-bump spool pins and paracentric key profiles effectively neutralize lockpicking, bumping, and impressioning attacks.",
    specs: ["Anti-Pick Spool Pins", "Paracentric Key Profiles", "Computerized Core Milling"],
    icon: "precision",
  },
  {
    number: "03",
    title: "Multi-Stage Boron Armoring",
    tag: "60+ HRC Rockwell Hardness",
    description:
      "Our heavy-duty shackles and strike plates undergo cryogenic quenching and deep-case induction hardening. Boron-alloy enrichment makes shackles virtually impervious to manual bolt-cutters, cold-chisel shear, and hacksaw penetration.",
    specs: ["Resists 5-Ton Hydraulic Shear", "Hardened Boron Alloy", "Cryogenic Case Hardening"],
    icon: "armor",
  },
  {
    number: "04",
    title: "Tri-Layer Anti-Corrosive Plating",
    tag: "240h ASTM Salt Spray Certified",
    description:
      "Every lock component is sealed with automated multi-layer electroplating—copper undercoat, bright nickel barrier, and hard chrome or hand-rubbed antique patina—protected by baked micro-lacquer for coastal and industrial environments.",
    specs: ["240-Hour Neutral Salt Spray", "Micro-Lacquered Protection", "Marine & Industrial Grade"],
    icon: "finish",
  },
];

interface ManufacturingPhase {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  keyPoints: { label: string; value: string }[];
}

const MANUFACTURING_PHASES: ManufacturingPhase[] = [
  {
    id: "foundry",
    name: "01. Foundry & Ingot Pouring",
    subtitle: "High-Temperature Metallurgical Casting",
    description:
      "Liquid brass heated to 1,050°C in our induction furnaces is poured into machined graphite and sand molds. Each melt undergoes optical emission spectrometry testing to verify alloy purity before casting begins.",
    image: "/products/s-nafi-classic-50.jpg",
    keyPoints: [
      { label: "Melt Temperature", value: "1,050°C Continuous" },
      { label: "Alloy Purity", value: "99.8% Certified" },
      { label: "Spectrometer Verification", value: "Every Batch Tested" },
    ],
  },
  {
    id: "machining",
    name: "02. CNC Milling & Core Broaching",
    subtitle: "Micron-Level Robotics Precision",
    description:
      "Multi-axis automated CNC stations drill pin chambers and mill complex keyways with micron repeatability. This ensures smooth key insertion, positive tactile feedback, and flawless operational lifetime.",
    image: "/products/s-nafi-mortise-set.jpg",
    keyPoints: [
      { label: "Drilling Tolerance", value: "±0.02 mm" },
      { label: "Pin Chamber Angles", value: "Dual Radial Stagger" },
      { label: "Keyway Broaching", value: "Paracentric Anti-Pick" },
    ],
  },
  {
    id: "testing",
    name: "03. Destructive Stress & Cycle Lab",
    subtitle: "Rigorous ISO Quality Verification",
    description:
      "Automated robotic cycle rigs test shackle spring mechanisms past 100,000 cycles. Shackles are subjected to hydraulic tensile pull testing, torque destruction, and corrosive salt-fog chamber exposure.",
    image: "/products/greek-hasp-brass.jpg",
    keyPoints: [
      { label: "Endurance Testing", value: "100,000+ Cycles" },
      { label: "Tensile Shackle Load", value: "Up to 50 kN" },
      { label: "Corrosion Testing", value: "ASTM B117 Standard" },
    ],
  },
];

const METRICS = [
  { value: "35+", label: "Years Heritage", detail: "Unbroken lockmaking foundry history in Aligarh" },
  { value: "100K+", label: "Cycles Tested", detail: "Rigorous mechanical stress & spring testing" },
  { value: "10,000+", label: "Dealer Partners", detail: "Hardware distributors & stockists pan-India" },
  { value: "ISO 9001", label: "Quality Certified", detail: "Strict metallurgical & manufacturing audit" },
];

/**
 * ============================================================================
 * Component: WhyNafi
 * ============================================================================
 */
export default function WhyNafi() {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const activePhase = MANUFACTURING_PHASES[activePhaseIndex];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-divider relative overflow-hidden">
      {/* Ambient Crest Background Watermark */}
      <div className="absolute -right-24 top-20 w-96 h-96 pointer-events-none opacity-5 select-none">
        <Image
          src="/images/nafi-crest-watermark.png"
          alt="Nafi Crest"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ====================================================================
            1. SECTION EDITORIAL HEADER
            ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
            <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
            <span className="font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold text-[#8C7A5B]">
              Manufacturing Heritage & Rigor
            </span>
            <div className="h-px w-10 sm:w-16 bg-[#B8923F]/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-primary tracking-tight leading-tight mb-4">
            Engineered for Generations.{" "}
            <span className="text-[#C49A45] block sm:inline">Forged Without Compromise.</span>
          </h2>

          <p className="text-muted text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Behind every lock bearing the Nafi, Greek, or Raksham crest lies over three decades
            of in-house metallurgical mastery, captive foundries, and strict ISO 9001:2015 quality standards.
          </p>
        </div>

        {/* ====================================================================
            2. ARCHITECTURAL METRICS BANNER
            ==================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F5] border border-[#EBE7DF] rounded-2xl p-6 sm:p-7 text-center hover:border-[#C49A45]/40 transition-colors shadow-2xs group"
            >
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#A67C2E] block mb-1 group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </span>
              <span className="font-sans text-xs sm:text-sm font-bold text-primary uppercase tracking-wider block mb-1.5">
                {metric.label}
              </span>
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        {/* ====================================================================
            3. THE 4 PILLARS OF MANUFACTURING EXCELLENCE
            ==================================================================== */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#8C7A5B] block mb-2">
              Our Technical Benchmarks
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              The Four Pillars of Nafi Engineering
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="bg-white border border-[#EBEBEB] hover:border-[#C49A45]/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Top Row: Pillar Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#A98048]/30 group-hover:text-[#A98048] transition-colors">
                      {pillar.number}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#FAF7F2] text-[#A67C2E] border border-[#E8DFCF]">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#111827] leading-snug mb-3 group-hover:text-[#A67C2E] transition-colors">
                    {pillar.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-5">
                    {pillar.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-wrap gap-2">
                  {pillar.specs.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10.5px] font-medium px-2.5 py-1 rounded bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====================================================================
            4. INTERACTIVE PRODUCTION LINE SWITCHBOARD
            ==================================================================== */}
        <div className="bg-[#FAF9F5] border border-[#EBE7DF] rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-[10.5px] font-sans uppercase tracking-[0.2em] font-semibold text-[#8C7A5B] block mb-1">
              Factory Floor Inspection
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
              Inside Our Manufacturing Process
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Select a stage to inspect our automated foundry lines, CNC machining centers, and laboratory protocols.
            </p>
          </div>

          {/* Phase Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-[#EBE7DF]">
            {MANUFACTURING_PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseIndex(idx)}
                className={`text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  activePhaseIndex === idx
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-[#E2E8F0] hover:bg-gray-50"
                }`}
              >
                {phase.name}
              </button>
            ))}
          </div>

          {/* Active Phase Showcase Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Photo */}
            <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm">
              <Image
                src={activePhase.image}
                alt={activePhase.name}
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs font-bold text-primary shadow-xs">
                  {activePhase.subtitle}
                </span>
              </div>
            </div>

            {/* Description & Technical Points */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-3">
                  {activePhase.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  {activePhase.description}
                </p>

                {/* Key Technical Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activePhase.keyPoints.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs"
                    >
                      <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider block mb-1">
                        {pt.label}
                      </span>
                      <span className="text-xs sm:text-[13px] font-bold text-primary block">
                        {pt.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Trigger */}
              <div className="pt-4 border-t border-[#EBE7DF] flex items-center justify-between">
                <span className="text-xs text-muted font-medium">
                  Have specific technical tolerance or OEM requirements?
                </span>
                <Link
                  href="/contact?type=technical_inquiry"
                  className="text-xs font-bold text-[#A67C2E] hover:text-[#8C6420] flex items-center gap-1 group"
                >
                  <span>Consult Engineering Team</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

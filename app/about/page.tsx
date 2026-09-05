import React from "react";
import Link from "next/link";
import { ShieldCheck, Factory, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 py-12 text-graphite-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="bg-graphite-900 text-white p-10 hairline-border relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <h1 className="font-space font-bold text-3xl sm:text-4xl text-white mb-4">
              35 Years of Architectural Hardware Excellence
            </h1>
            <p className="font-inter text-steel-400 text-sm leading-relaxed">
              Founded in 1989, NAFI Lock Industries manufactures high-tolerance mortise locks, solid brass cylinders, lever handles, and heavy security door fittings for residential, commercial, and government infrastructure.
            </p>
          </div>
        </div>

        {/* Manufacturing Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white hairline-border p-6 space-y-3">
            <div className="w-10 h-10 bg-brass-600/10 text-brass-600 rounded flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-space font-bold text-lg text-graphite-900">0.02mm CNC Tolerance</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              Every mortise lock cylinder is machined on multi-axis Japanese CNC equipment to ensure zero key binding and maximum anti-pick security.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 space-y-3">
            <div className="w-10 h-10 bg-brass-600/10 text-brass-600 rounded flex items-center justify-center font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="font-space font-bold text-lg text-graphite-900">Forged Solid Brass</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              We never use hollow die-cast alloys. All lever handles and cylinder bodies are forged from virgin Grade 304 architectural brass.
            </p>
          </div>

          <div className="bg-white hairline-border p-6 space-y-3">
            <div className="w-10 h-10 bg-brass-600/10 text-brass-600 rounded flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-space font-bold text-lg text-graphite-900">250,000 Endurance Test</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              Tested to EN 1303 Class 6 and ANSI Grade 1 benchmarks. Guaranteed mechanical performance for over 10 years of continuous use.
            </p>
          </div>
        </div>

        {/* Factory Standards */}
        <div className="bg-white hairline-border p-8 space-y-4">
          <h2 className="font-space font-bold text-xl text-graphite-900 pb-2 border-b border-steel-100">
            Factory Certifications & Quality Compliance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-steel-600">
            <div className="p-3 bg-steel-50 hairline-border flex items-center justify-between">
              <span>ISO 9001:2015 Quality Systems</span>
              <span className="text-emerald-700 font-bold">Certified</span>
            </div>
            <div className="p-3 bg-steel-50 hairline-border flex items-center justify-between">
              <span>EN 1154 Overhead Door Closers</span>
              <span className="text-emerald-700 font-bold">Fire Rated</span>
            </div>
            <div className="p-3 bg-steel-50 hairline-border flex items-center justify-between">
              <span>EN 1303 Cylinder Locks</span>
              <span className="text-emerald-700 font-bold">Class 6</span>
            </div>
            <div className="p-3 bg-steel-50 hairline-border flex items-center justify-between">
              <span>RoHS & PVD Finish Compliance</span>
              <span className="text-emerald-700 font-bold">Pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

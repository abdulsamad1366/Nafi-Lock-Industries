import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface UseCaseTile {
  slug: string;
  name: string;
  recommendation: string;
  tag: string;
}

const USE_CASES: UseCaseTile[] = [
  {
    slug: "main-entrance",
    name: "Main Entrance",
    recommendation: "High Security Mortise Locks, Biometric Units & Heavy Deadbolts",
    tag: "Grade 1 Security",
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    recommendation: "Keyed Lever Handles & Smooth Double Cylinder Mortise Locks",
    tag: "Privacy & Keyed",
  },
  {
    slug: "bathroom",
    name: "Bathroom",
    recommendation: "Silent Magnetic Privacy Latches with Emergency Coin Release",
    tag: "Emergency Release",
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    recommendation: "Moisture-Resistant PVD Handles & Flush Cabinet Drawer Pulls",
    tag: "Anti-Corrosion",
  },
  {
    slug: "wardrobe",
    name: "Wardrobe",
    recommendation: "Solid Brass Cabinet Pulls, Concealed Hinges & Mini Cam Locks",
    tag: "Precision Hardware",
  },
  {
    slug: "office",
    name: "Office",
    recommendation: "UL Fire-Rated Hydraulic Closers, Access Latches & Master Keyed Systems",
    tag: "Fire & Access Rated",
  },
];

export default function UseCasesGrid() {
  return (
    <section className="py-16 bg-paper-50 border-b border-steel-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8">
          <h2 className="font-space font-bold text-2xl sm:text-3xl text-graphite-900">
            Shop by Use
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-case/${uc.slug}`}
              className="group bg-white hairline-border p-6 hover:border-brass-600 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-steel-500 bg-steel-100 px-2 py-0.5 rounded">
                    {uc.tag}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-steel-400 group-hover:text-brass-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="font-space font-bold text-xl text-graphite-900 group-hover:text-brass-600 transition-colors mb-2">
                  {uc.name}
                </h3>
                <p className="text-xs text-steel-500 leading-relaxed">
                  {uc.recommendation}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-steel-100 text-xs font-mono text-brass-600 group-hover:underline">
                View matched hardware →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

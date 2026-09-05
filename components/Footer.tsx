import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, Award, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-graphite-900 text-steel-400 text-sm border-t border-graphite-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        {/* Top Colophon Masthead */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-graphite-800 items-start">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brass-600 flex items-center justify-center font-space font-bold text-graphite-900 text-lg rounded-sm">
                N
              </div>
              <span className="font-space font-bold text-xl text-white tracking-wider">
                NAFI <span className="text-brass-500 font-light">LOCK</span> INDUSTRIES
              </span>
            </div>
            <p className="text-xs text-steel-400 leading-relaxed max-w-md">
              Precision-engineered architectural locksets, mortise lock cylinders, solid brass handles, and heavy security door fittings for residential and commercial infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brass-500">
              <span className="flex items-center gap-1.5 bg-graphite-800 px-3 py-1.5 rounded border border-graphite-700">
                <Award className="w-3.5 h-3.5 text-brass-500" /> ISO 9001:2015 Quality Systems
              </span>
              <span className="flex items-center gap-1.5 bg-graphite-800 px-3 py-1.5 rounded border border-graphite-700">
                <ShieldCheck className="w-3.5 h-3.5 text-brass-500" /> 10-Year Mechanical Warranty
              </span>
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 font-mono text-xs text-steel-400">
            <h4 className="font-space font-bold text-sm text-white uppercase tracking-wider mb-2">
              Factory Logistics & Desk
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
              <span>Plot 42, Industrial Hardware Zone, Aligarh / Mumbai, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brass-500 shrink-0" />
              <span>Technical Sales Desk: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brass-500 shrink-0" />
              <span>Factory Orders: orders@nafilocks.com</span>
            </div>
          </div>
        </div>

        {/* Inline Navigation Shelf */}
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs">
          <div className="flex flex-wrap items-center gap-6 font-space font-semibold text-steel-300">
            <Link href="/category/door-locks" className="hover:text-brass-500 transition-colors">
              Door Locks
            </Link>
            <Link href="/category/handles" className="hover:text-brass-500 transition-colors">
              Lever Handles
            </Link>
            <Link href="/category/bolts-latches" className="hover:text-brass-500 transition-colors">
              Bolts & Latches
            </Link>
            <Link href="/category/accessories" className="hover:text-brass-500 transition-colors">
              Accessories & Hinges
            </Link>
            <Link href="/dealer/apply" className="text-brass-500 hover:underline">
              Wholesale Dealer Account
            </Link>
            <Link href="/about" className="hover:text-brass-500 transition-colors">
              Manufacturing Specs
            </Link>
            <Link href="/contact" className="hover:text-brass-500 transition-colors">
              Contact Factory
            </Link>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hello%20NAFI%20Lock%20Industries,%20I%20have%20a%20hardware%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-graphite-800 px-3 py-1.5 rounded border border-graphite-700"
          >
            Direct WhatsApp Hotline <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-graphite-800 py-4 px-4 text-center text-xs text-steel-500 border-t border-graphite-700 font-mono">
        © {new Date().getFullYear()} NAFI Lock Industries. Precision Engineered Architectural Hardware.
      </div>
    </footer>
  );
}

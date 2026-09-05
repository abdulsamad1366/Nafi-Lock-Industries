import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-graphite-900 text-steel-400 text-sm border-t border-graphite-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brass-600 flex items-center justify-center font-space font-bold text-graphite-900 text-base rounded-sm">
              N
            </div>
            <span className="font-space font-bold text-lg text-white tracking-wider">
              NAFI <span className="text-brass-500 font-light">LOCK</span>
            </span>
          </div>
          <p className="text-xs text-steel-400 leading-relaxed">
            Precision-engineered architectural locksets, mortise lock cylinders, solid brass handles, and heavy security door fittings for residential and commercial infrastructure.
          </p>
          <div className="flex items-center gap-3 text-xs text-brass-500 font-mono">
            <Award className="w-4 h-4" /> ISO 9001:2015 Quality Certified
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-space text-white text-sm font-semibold tracking-wide uppercase">
            Hardware Catalog
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/category/door-locks" className="hover:text-brass-500 transition-colors">
                Mortise & Smart Door Locks
              </Link>
            </li>
            <li>
              <Link href="/category/handles" className="hover:text-brass-500 transition-colors">
                Solid Brass Lever Handles
              </Link>
            </li>
            <li>
              <Link href="/category/bolts-latches" className="hover:text-brass-500 transition-colors">
                Tower Bolts & Silent Latches
              </Link>
            </li>
            <li>
              <Link href="/category/accessories" className="hover:text-brass-500 transition-colors">
                Concealed Hinges & Door Closers
              </Link>
            </li>
          </ul>
        </div>

        {/* B2B / Dealer Links */}
        <div className="space-y-3">
          <h4 className="font-space text-white text-sm font-semibold tracking-wide uppercase">
            B2B & Dealer Network
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dealer/apply" className="hover:text-brass-500 transition-colors">
                Apply for Wholesale Account
              </Link>
            </li>
            <li>
              <Link href="/dealer/dashboard" className="hover:text-brass-500 transition-colors">
                Dealer Login & Tier Rates
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-brass-500 transition-colors">
                Request Bulk Quotation
              </Link>
            </li>
            <li>
              <span className="text-steel-500">PO Payment Terms: Net 30 Available</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-space text-white text-sm font-semibold tracking-wide uppercase">
            Technical Support & Factory
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
              <span>Plot 42, Industrial Hardware Zone, Aligarh / Mumbai, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brass-500 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brass-500 shrink-0" />
              <span>orders@nafilocks.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-graphite-800 py-4 px-4 text-center text-xs text-steel-500 border-t border-graphite-700 font-mono">
        © {new Date().getFullYear()} NAFI Lock Industries. All rights reserved. Built to Precision Tolerances.
      </div>
    </footer>
  );
}

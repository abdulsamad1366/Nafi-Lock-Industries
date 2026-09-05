"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, User, ChevronDown, Lock, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, role, isDealer, isAdmin, loginAs, logout } = useAuth();
  const { totalItems } = useCart();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-graphite-900 text-white border-b border-graphite-700">
      {/* Top Banner / Role Switcher Demo Bar */}
      <div className="bg-graphite-800 text-xs py-1.5 px-4 sm:px-8 border-b border-graphite-700 flex flex-wrap items-center justify-between text-steel-300">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-brass-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO 9001 Certified Manufacturing
          </span>
          <span className="hidden md:inline text-steel-400">|</span>
          <span className="hidden md:inline">Precision Hardware & Architectural Locksmithing</span>
        </div>

        {/* Demo Mode Role Switcher */}
        <div className="relative flex items-center gap-2">
          <span className="text-steel-400 font-mono text-[11px]">ACTIVE VIEW:</span>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 bg-graphite-900 px-2.5 py-0.5 rounded border border-graphite-700 text-white hover:border-brass-600 transition-colors"
          >
            <span className="capitalize font-semibold text-brass-500">{role}</span>
            {isDealer && <span className="text-[10px] bg-brass-600 text-white px-1 rounded">APPROVED</span>}
            <ChevronDown className="w-3 h-3 text-steel-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-graphite-900 border border-graphite-700 rounded shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-graphite-800 text-steel-400 text-[10px] uppercase tracking-wider font-mono">
                Switch Demo Persona
              </div>
              <button
                onClick={() => {
                  loginAs("retail");
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-graphite-800 flex items-center justify-between ${
                  role === "retail" ? "text-brass-500 font-semibold" : "text-steel-300"
                }`}
              >
                <span>Retail Customer</span>
                <span className="text-[10px] text-steel-400">Standard Price</span>
              </button>
              <button
                onClick={() => {
                  loginAs("dealer");
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-graphite-800 flex items-center justify-between ${
                  role === "dealer" ? "text-brass-500 font-semibold" : "text-steel-300"
                }`}
              >
                <span>Approved Dealer</span>
                <span className="text-[10px] bg-brass-600/20 text-brass-500 px-1 rounded">Tier Pricing</span>
              </button>
              <button
                onClick={() => {
                  loginAs("admin");
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-graphite-800 flex items-center justify-between ${
                  role === "admin" ? "text-brass-500 font-semibold" : "text-steel-300"
                }`}
              >
                <span>Store Admin</span>
                <span className="text-[10px] text-steel-400">Portal Access</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brass-600 flex items-center justify-center font-space font-bold text-lg text-graphite-900 rounded-sm group-hover:bg-brass-500 transition-colors">
            N
          </div>
          <div>
            <div className="font-space font-bold text-lg tracking-wider text-white uppercase leading-none">
              NAFI <span className="text-brass-500 font-light">LOCK</span>
            </div>
            <div className="text-[9px] font-mono text-steel-400 tracking-widest uppercase">INDUSTRIES</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-steel-300">
          <Link href="/" className="hover:text-brass-500 transition-colors">
            Home
          </Link>
          <Link href="/category/door-locks" className="hover:text-brass-500 transition-colors">
            Shop by Category
          </Link>
          <Link href="/use-case/main-entrance" className="hover:text-brass-500 transition-colors">
            Shop by Use
          </Link>
          <Link
            href="/dealer/apply"
            className="hover:text-brass-500 transition-colors flex items-center gap-1 text-brass-500"
          >
            <Building2 className="w-4 h-4" /> Become a Dealer
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-signal-red hover:underline font-mono text-xs uppercase tracking-wider">
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {isDealer ? (
            <Link
              href="/dealer/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs bg-brass-600/20 text-brass-500 border border-brass-600/40 px-3 py-1.5 rounded font-mono"
            >
              <Building2 className="w-3.5 h-3.5" /> Dealer Dashboard
            </Link>
          ) : (
            <Link
              href="/dealer/apply"
              className="hidden sm:flex items-center gap-1.5 text-xs text-steel-300 hover:text-white transition-colors"
            >
              Dealer Portal
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-graphite-800 hover:bg-graphite-700 text-white px-3.5 py-2 rounded border border-graphite-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-brass-500" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-brass-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

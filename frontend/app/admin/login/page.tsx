"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdmin } from "@/lib/api";
import { setAdminToken, setAdminUser } from "@/lib/adminAuth";

/**
 * ============================================================================
 * Admin / Factory Management Login Terminal
 * ============================================================================
 * Strictly isolated from customer & distributor public accounts.
 * Connects to POST /api/admin/auth/login.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAdmin({ email: email.trim(), password });
      setAdminToken(res.token);
      setAdminUser(res.admin);
      router.push("/admin/orders");
    } catch (err: any) {
      setError(
        err.message || "Invalid administrative clearance. Verify your email and master key."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@nafilockindustries.com");
    setPassword("NafiMasterAdmin2026!");
  };

  return (
    <div className="min-h-screen bg-[#070C16] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Dark Ambient Grid & Executive Red/Gold Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#B8923F]/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Watermark Crest */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] aspect-[1024/759] opacity-[0.03] pointer-events-none select-none"
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Factory Header Badge */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 mb-3 shadow-lg group-hover:border-[#DC2626] transition-colors backdrop-blur-md">
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Logo"
                width={36}
                height={36}
                className="object-contain filter brightness-110"
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Nafi <span className="text-[#DC2626] font-normal italic">Lock Industries</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-400 mt-1">
              Factory Operations Terminal
            </span>
          </Link>
        </div>

        {/* Executive Terminal Plaque */}
        <div className="bg-[#0D1524]/90 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md relative overflow-hidden">
          {/* Subtle Top Red Security Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DC2626] to-transparent" />

          {/* Clearance Notice */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-red-400 font-bold">
                Restricted Clearance
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">
              TIER 1 ADMIN
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-white mb-1 tracking-tight">
            Executive Authorization
          </h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Enter administrative master credentials to manage distributor approvals, dispatch orders, and catalog archives.
          </p>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-300 text-xs flex items-center gap-2.5 shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 tracking-wider uppercase mb-1.5 font-mono">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nafilockindustries.com"
                  className="w-full bg-[#131E33] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-300 tracking-wider uppercase font-mono">
                  Master Security Key
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#131E33] border border-white/10 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide key" : "Show key"}
                  aria-label={showPassword ? "Hide key" : "Show key"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-[#DC2626] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#B91C1C] active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Clearance...</span>
                </>
              ) : (
                <>
                  <span>Access Management Portal</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              Testing Clearance:
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-mono font-semibold text-red-400 bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-md hover:bg-red-900/50 hover:text-white transition-colors cursor-pointer"
            >
              Autofill Demo Admin
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <Link href="/login" className="hover:text-white transition-colors">
            ← Return to Public Distributor & Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

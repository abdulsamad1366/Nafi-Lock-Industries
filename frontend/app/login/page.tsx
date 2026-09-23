"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "@/lib/api";
import { setUserToken, setUser, setDistributorStatus } from "@/lib/userAuth";

export default function LoginPage() {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<"DISTRIBUTOR" | "CUSTOMER">("DISTRIBUTOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email: email.trim(), password });
      setUserToken(res.token);
      setUser(res.user);
      setDistributorStatus(res.status);

      if (res.user.role === "DISTRIBUTOR") {
        router.push("/distributor");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please verify your credentials or check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: "DISTRIBUTOR" | "CUSTOMER") => {
    setSelectedPersona(role);
    if (role === "DISTRIBUTOR") {
      setEmail("distributor@nafilock.com");
      setPassword("NafiDistributor2026!");
    } else {
      setEmail("customer@nafilock.com");
      setPassword("NafiCustomer2026!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-[#B8923F]/8 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-black/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Subtle Background Watermark Emblem */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] aspect-[1024/759] opacity-[0.035] pointer-events-none select-none -z-10"
        aria-hidden="true"
      >
        <Image
          src="/images/nafi-crest-watermark.png"
          alt="Watermark Emblem"
          fill
          className="object-contain"
          priority={false}
        />
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* Main Split Architecture Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] border border-[#EBE7DF] bg-white">
          
          {/* ==================================================================
              LEFT PANEL: Architectural Heritage & Trust Showcase (Desktop)
              ================================================================== */}
          <div className="lg:col-span-5 bg-[#0D1520] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle internal gradient & radial brass flare */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#B8923F]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Official Brand Logo */}
              <Link href="/" className="inline-flex items-center gap-3 group mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center backdrop-blur-sm group-hover:border-[#B8923F] transition-colors">
                  <Image
                    src="/logos/nafi-logo.svg"
                    alt="Nafi Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold tracking-tight text-white block leading-none">
                    Nafi <span className="text-[#D4AF37] font-normal italic">Lock Industries</span>
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gray-400 mt-1 block">
                    Security Gateway
                  </span>
                </div>
              </Link>

              {/* Editorial Statement */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4 backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-gray-300 font-semibold">
                    Foundry Direct Portal
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-3">
                  Forged for Generations. <br />
                  <span className="text-[#D4AF37]">Secured for the Future.</span>
                </h1>

                <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-normal">
                  Welcome to the official digital gateway for authorized dealers, institutional architects, and verified clients across India.
                </p>
              </div>

              {/* 3 Portal Trust Highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Wholesale Dealer Pricing</h4>
                    <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                      Approved distributors unlock direct factory wholesale tiers and bulk MOQs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Ledger & Statements</h4>
                    <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                      Request formal accounting statements and dispatch certificates with 1 click.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Fortified Session Security</h4>
                    <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                      Protected by 256-bit encryption and strict role isolation boundaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Support Badge */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 relative z-10">
              <span className="font-mono text-[10px] tracking-wider uppercase">
                ISO 9001:2015 CERTIFIED
              </span>
              <span className="text-[#D4AF37] font-semibold text-[11px]">
                Direct Factory Gateway
              </span>
            </div>
          </div>

          {/* ==================================================================
              RIGHT PANEL: Interactive Login Terminal
              ================================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Header Title Row */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-[28px] font-bold text-primary tracking-tight leading-tight">
                    Portal Sign In
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Enter your authorized credentials to access your account.
                  </p>
                </div>

                {/* Secure Lock Badge */}
                <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DFCF] flex items-center justify-center text-[#A67C2E] shrink-0 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              {/* Persona Tab Switcher */}
              <div className="bg-[#F5F3EF] p-1 rounded-xl flex items-center gap-1 mb-5 border border-[#EBE7DF]">
                <button
                  type="button"
                  onClick={() => setSelectedPersona("DISTRIBUTOR")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    selectedPersona === "DISTRIBUTOR"
                      ? "bg-white text-primary shadow-xs border border-black/5"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedPersona === "DISTRIBUTOR" ? "bg-[#B8923F]" : "bg-gray-300"
                    }`}
                  />
                  <span>Distributor / B2B Dealer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPersona("CUSTOMER")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    selectedPersona === "CUSTOMER"
                      ? "bg-white text-primary shadow-xs border border-black/5"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedPersona === "CUSTOMER" ? "bg-[#2A6F97]" : "bg-gray-300"
                    }`}
                  />
                  <span>Client / Customer</span>
                </button>
              </div>

              {/* Contextual Guidance Pill */}
              <div
                className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2.5 transition-colors border ${
                  selectedPersona === "DISTRIBUTOR"
                    ? "bg-[#FAF6EE] text-[#7A5B20] border-[#E8DFCF]"
                    : "bg-[#EEF4F8] text-[#1E4D6B] border-[#D6E3EC]"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  {selectedPersona === "DISTRIBUTOR"
                    ? "Distributor login automatically directs you to dealer pricing, orders, and ledger requests."
                    : "Customer login directs you to saved lock specifications, inquiries, and customer profile."}
                </span>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-xs"
                  >
                    <svg className="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Terminal */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-[11px] font-bold text-primary tracking-wider uppercase mb-1.5">
                    {selectedPersona === "DISTRIBUTOR" ? "Corporate Dealership Email" : "Registered Email Address"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
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
                      placeholder={
                        selectedPersona === "DISTRIBUTOR"
                          ? "distributor@hardwarecorp.com"
                          : "client@estatedesign.com"
                      }
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-primary tracking-wider uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-[#A67C2E] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
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
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl pl-10 pr-11 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-primary transition-colors cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#A67C2E] border-gray-300 focus:ring-[#A67C2E]"
                    />
                    <span className="text-xs text-muted font-medium">Remember this authorized workstation</span>
                  </label>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#A67C2E] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#8E6720] active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to {selectedPersona === "DISTRIBUTOR" ? "Distributor Portal" : "Client Account"}</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Helper Widget for Review / Testing */}
              <div className="mt-5 p-3 rounded-xl bg-black/[0.02] border border-black/5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
                  Quick Autofill (Demo Testing):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("DISTRIBUTOR")}
                    className="text-[10px] font-semibold text-[#A67C2E] bg-[#FAF6EE] border border-[#E8DFCF] px-2.5 py-1 rounded-md hover:bg-[#A67C2E] hover:text-white transition-colors cursor-pointer"
                  >
                    Distributor Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("CUSTOMER")}
                    className="text-[10px] font-semibold text-[#2A6F97] bg-[#EEF4F8] border border-[#D6E3EC] px-2.5 py-1 rounded-md hover:bg-[#2A6F97] hover:text-white transition-colors cursor-pointer"
                  >
                    Customer Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row: Signup Link & Factory Desk Note */}
            <div className="mt-6 pt-5 border-t border-[#EBE7DF]">
              <div className="text-center mb-3">
                <p className="text-xs text-muted">
                  Don't have an account or dealership yet?{" "}
                  <Link
                    href={`/signup?role=${selectedPersona.toLowerCase()}`}
                    className="text-[#A67C2E] font-bold hover:underline"
                  >
                    Apply for Dealership or Create Account →
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-muted">
                <span>Direct Factory Assistance:</span>
                <Link href="/contact" className="hover:text-primary font-medium underline">
                  Contact Factory Desk
                </Link>
                <span>•</span>
                <Link href="/admin/login" className="hover:text-primary font-mono text-[10px] text-gray-400">
                  Staff Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Guidance Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-divider relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#A67C2E] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">Credential Recovery</h3>
                  <p className="text-xs text-muted">Nafi Lock Industries Factory Security</p>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed mb-4">
                To maintain strict security for wholesale pricing agreements and dispatch ledgers, password resets require verification by our Factory Operations Desk.
              </p>

              <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E0DBD1] text-xs text-primary mb-5 space-y-1">
                <div className="font-semibold text-primary">Direct Factory Desk:</div>
                <div className="text-muted font-mono text-[11px]">support@nafilockindustries.com</div>
                <div className="text-muted font-mono text-[11px]">+91 98765 43210 (Mon–Sat 9AM–7PM IST)</div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-primary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#A67C2E] rounded-lg hover:bg-[#8E6720] transition-colors"
                >
                  Go to Contact Desk
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

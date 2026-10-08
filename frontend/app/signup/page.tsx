"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signupUser } from "@/lib/api";

function SignupForm() {
  // Dealership & Contact Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Business Profile Fields
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Please provide your full contact name.");
      setIsLoading(false);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid corporate dealership email.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      setIsLoading(false);
      return;
    }
    if (!companyName.trim()) {
      setError("Please enter your firm or company name.");
      setIsLoading(false);
      return;
    }
    if (!businessAddress.trim()) {
      setError("Please enter your registered business address.");
      setIsLoading(false);
      return;
    }
    if (!city.trim() || !state.trim()) {
      setError("Please specify both city and state.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role: "DISTRIBUTOR" as const,
        companyName: companyName.trim(),
        gstNumber: gstNumber.trim() || undefined,
        businessAddress: businessAddress.trim(),
        city: city.trim(),
        state: state.trim(),
      };

      await signupUser(payload);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit distributor application. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex bg-[#0F1117] select-none text-gray-900">
      {/* ====================================================================
          LEFT HERO PANEL: Strategic Partnership Handshake Visual
          ==================================================================== */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[54%] h-full relative overflow-hidden bg-black">
        <Image
          src="/images/signup-partnership.jpg"
          alt="Nafi Lock Industries Distributor Partnership Handshake"
          fill
          priority
          className="object-cover object-center scale-[1.01]"
        />
        {/* Soft edge gradient to blend smoothly into the right dark canvas */}
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0F1117] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

        {/* Partnership badge and watermark on bottom-left of hero */}
        <div className="absolute bottom-6 left-8 z-10 text-white/90">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8923F]/25 border border-[#B8923F]/40 text-[#E5C16C] font-mono text-[10px] tracking-wider uppercase mb-2 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8923F] animate-pulse" />
            Authorized Dealership Network
          </span>
          <p className="font-serif italic text-lg text-[#D4AF37]">
            Factory-Direct Commercial Partnership
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/60 mt-0.5">
            Since 1995 · Aligarh Foundry & Pan-India Distribution
          </p>
        </div>
      </div>

      {/* ====================================================================
          RIGHT PANEL: Floating White Form Card on Dark Canvas
          ==================================================================== */}
      <div className="w-full lg:w-[48%] xl:w-[46%] h-full flex flex-col justify-between items-center py-3 sm:py-5 px-4 sm:px-8 relative overflow-y-auto lg:overflow-hidden bg-[#0F1117]">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#B8923F]/15 rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="w-full max-w-[500px] sm:max-w-[540px] md:max-w-[580px] lg:max-w-[580px] xl:max-w-[620px] my-auto">
          {/* Main Floating White Card with Framer Motion Entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl relative border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Circular Close Button (Top-Right, matching /login format) */}
            <Link
              href="/"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B8923F] hover:bg-[#9B772E] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation z-20"
              title="Close to Store"
            >
              ✕
            </Link>

            {isSubmitted ? (
              /* Success / Confirmation State */
              <div className="p-7 sm:p-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF6EE] border border-[#E8DFCF] text-[#A67C2E] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-xs">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EE] text-[#7A5B20] border border-[#E8DFCF] text-xs font-mono uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#A67C2E]" />
                  Application Received
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Application Submitted
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-5">
                  Thank you for applying to the Nafi Lock Industries network. Our factory commercial desk will review your business credentials within 1–2 business days.
                </p>

                <div className="bg-[#FAF9F7] border border-[#E0DBD1] rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left text-xs sm:text-sm mb-6 space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Firm Name:</span>
                    <span className="font-semibold text-gray-900">{companyName || name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Primary Email:</span>
                    <span className="font-mono text-gray-900">{email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Account Status:</span>
                    <span className="font-bold text-[#A67C2E]">Pending Factory Approval</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-7 py-3 bg-[#B8923F] hover:bg-[#9B772E] text-white font-serif font-bold text-sm rounded-xl transition-all shadow-sm"
                  >
                    Go to Sign In
                  </Link>
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-7 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-all"
                  >
                    Return to Store
                  </Link>
                </div>
              </div>
            ) : (
              /* Unified Single-Screen Application Form */
              <div className="p-6 sm:p-8 xl:p-9 pb-5 sm:pb-6">
                {/* Brand Logo & Editorial Headline (Exact match to /login format) */}
                <div className="text-center pt-1 mb-4 sm:mb-5">
                  <div className="inline-flex items-center justify-center gap-3 sm:gap-3.5">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#B8923F]/15 border border-[#B8923F]/30 p-2 sm:p-2.5 flex items-center justify-center shrink-0 shadow-2xs">
                      <Image
                        src="/logos/nafi-logo.svg"
                        alt="Nafi Lock Industries"
                        width={32}
                        height={32}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8"
                      />
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 tracking-tight leading-none">
                      Nafi Lock Industries
                    </h1>
                  </div>

                  <p className="text-xs sm:text-sm lg:text-[15px] text-[#B8923F] font-serif italic font-semibold tracking-wider mt-1.5">
                    The Real Security
                  </p>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3.5 overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 shadow-2xs">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span className="font-medium leading-snug">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Unified Form - All Fields on Single Screen */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                  {/* Row 1: Full Name & Contact Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rajesh Kumar"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Corporate Email & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Dealership Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dealer@hardwarecorp.com"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Password (Min 6) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl pl-4 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
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
                  </div>

                  {/* Row 3: Company Name & GST Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Firm / Store Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Sharma Hardware & Trading Co."
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="09AAAAA0000A1Z5"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Row 4: Business Address */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Registered Business Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Shop No. 12, Main Hardware Market"
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                    />
                  </div>

                  {/* Row 5: City & State */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Aligarh"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Uttar Pradesh"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-1 focus:ring-[#B8923F] transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Action Button: Full Width */}
                  <div className="pt-2 sm:pt-2.5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 sm:py-3.5 bg-[#B8923F] hover:bg-[#9B772E] text-white font-serif font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer touch-manipulation"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <span>Submit Distributor Application</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Legal Disclaimers */}
                <p className="text-[11px] sm:text-xs text-gray-500 text-center mt-3 leading-snug">
                  By applying you agree to our{" "}
                  <Link href="/privacy" className="text-[#B8923F] font-semibold hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-[#B8923F] font-semibold hover:underline">
                    Wholesale Terms
                  </Link>
                </p>
              </div>
            )}

            {/* Bottom Featured Outlined Pill Tray */}
            <div className="bg-[#F5F6F9] border-t border-[#EAECEF] px-6 sm:px-8 py-3.5 sm:py-4">
              <Link
                href="/login"
                className="w-full py-3 sm:py-3.5 rounded-full border-2 border-[#B8923F] text-[#B8923F] hover:bg-[#B8923F] hover:text-white font-serif font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] touch-manipulation text-center"
              >
                Already Authorized? Sign In Here!
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Minimal Copyright Under the Card on Dark Canvas */}
        <p className="text-[11px] text-gray-500 text-center select-none py-1">
          Nafi Lock Industries all rights reserved ©
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1117]" />}>
      <SignupForm />
    </Suspense>
  );
}

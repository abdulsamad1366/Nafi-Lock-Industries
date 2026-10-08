"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "@/lib/api";
import { setUserToken, setUser, setDistributorStatus } from "@/lib/userAuth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/distributor";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await loginUser({ email: email.trim(), password });
      setUserToken(res.token);
      setUser(res.user);
      setDistributorStatus(res.status);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please verify your credentials or check connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("distributor@nafilock.com");
    setPassword("NafiDistributor2026!");
    setError(null);
    setInfoMessage("Demo credentials filled. Click 'Sign In' to proceed.");
    setTimeout(() => setInfoMessage(null), 4000);
  };

  const handleSocialClick = (provider: string) => {
    setInfoMessage(`${provider} SSO is reserved for verified enterprise dealers. Please use corporate email.`);
    setTimeout(() => setInfoMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1117] overflow-hidden flex select-none">
      {/* ====================================================================
          LEFT HERO PANEL: Cinematic Handcrafted Brass Lock Artistry
          ==================================================================== */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[54%] h-full relative overflow-hidden bg-black">
        <Image
          src="/images/login-hero.jpg"
          alt="Nafi Lock Handcrafted Brass Lock Heritage"
          fill
          priority
          className="object-cover object-center scale-[1.01]"
        />
        {/* Soft edge gradient to blend smoothly into the right dark panel */}
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent to-[#0F1117] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Heritage watermark text on the bottom-left of hero */}
        <div className="absolute bottom-6 left-8 z-10 text-white/80">
          <p className="font-serif italic text-base text-[#D4AF37]">
            Foundry Artistry & Precision Security
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/60 mt-0.5">
            Since 1995 · Aligarh Foundry Works
          </p>
        </div>
      </div>

      {/* ====================================================================
          RIGHT PANEL: Floating White Card on Dark Canvas (Exact Reference Match)
          ==================================================================== */}
      <div className="w-full lg:w-[48%] xl:w-[46%] h-full flex flex-col justify-between items-center py-4 sm:py-6 px-4 sm:px-8 relative overflow-y-auto lg:overflow-hidden bg-[#0F1117]">
        {/* Ambient background glow behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#B8923F]/15 rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="w-full max-w-[500px] sm:max-w-[540px] md:max-w-[580px] lg:max-w-[570px] xl:max-w-[620px] my-auto">
          {/* Main Floating White Card with Framer Motion Entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl relative border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Circular Close Button (Top-Right) */}
            <Link
              href="/"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B8923F] hover:bg-[#9B772E] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation z-20"
              title="Close to Store"
            >
              ✕
            </Link>

            {/* Main Form Body */}
            <div className="p-6 sm:p-8 xl:p-10 pb-5 sm:pb-6">
              {/* Brand Logo & Editorial Headline (Top-Center) */}
              <div className="text-center pt-1 mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#B8923F]/15 border border-[#B8923F]/30 p-2.5 sm:p-3 mx-auto flex items-center justify-center shadow-2xs mb-2.5 sm:mb-3">
                  <Image
                    src="/logos/nafi-logo.svg"
                    alt="Nafi Lock Industries"
                    width={44}
                    height={44}
                    className="object-contain w-9 h-9 sm:w-11 sm:h-11"
                  />
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 tracking-tight leading-none">
                  Nafi Lock Industries
                </h1>
                <p className="text-xs sm:text-sm lg:text-[15px] text-gray-500 font-medium tracking-tight mt-1.5 sm:mt-2">
                  Precision <span className="font-bold text-gray-700">Security</span>, Engineered <span className="font-bold text-[#B8923F]">Since 1995!</span>
                </p>
              </div>

              {/* Status / Alert Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3.5 overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span className="font-medium leading-snug">{error}</span>
                    </div>
                  </motion.div>
                )}
                {infoMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3.5 overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
                      <span className="font-medium leading-snug">{infoMessage}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="distributor@dealership.com"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-2 focus:ring-[#B8923F]/20 transition-all"
                  />
                </div>

                {/* Password Input with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl sm:rounded-2xl pl-4 sm:pl-5 pr-11 sm:pr-12 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8923F] focus:bg-white focus:ring-2 focus:ring-[#B8923F]/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Side-by-Side Action Buttons (Gold Sign In + Dark Phone/Demo Fill) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 sm:py-3.5 bg-[#B8923F] hover:bg-[#9B772E] text-white font-serif font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer touch-manipulation"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="w-full py-3 sm:py-3.5 bg-[#23272F] hover:bg-[#1A1D23] text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer touch-manipulation"
                  >
                    <span>Quick Demo Fill</span>
                  </button>
                </div>
              </form>

              {/* Social / SSO Single Sign-on Buttons */}
              <div className="space-y-2.5 sm:space-y-3 mt-3.5 sm:mt-4 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => handleSocialClick("Google")}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-5 border border-[#E5E5E5] hover:bg-[#F9FAFB] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick("Apple")}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-5 border border-[#E5E5E5] hover:bg-[#F9FAFB] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                  </svg>
                  <span>Sign in with Apple</span>
                </button>
              </div>

              {/* Legal Disclaimers */}
              <p className="text-[11px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-3.5 leading-snug">
                By continuing you are agreeing to our{" "}
                <Link href="/privacy" className="text-[#B8923F] font-semibold hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-[#B8923F] font-semibold hover:underline">
                  Terms of Service
                </Link>
              </p>

              {/* Link Row (Forgot Password & Sign Up) */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 sm:pt-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-gray-600 hover:text-[#B8923F] font-semibold transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>

                <Link
                  href="/signup"
                  className="text-gray-900 hover:text-[#B8923F] font-semibold transition-colors"
                >
                  New here? <span className="text-[#B8923F] font-bold">Sign Up</span>
                </Link>
              </div>
            </div>

            {/* Bottom Featured Tray (Matching Reference gray tray with outlined button) */}
            <div className="bg-[#F5F6F9] border-t border-[#EAECEF] px-6 sm:px-8 xl:px-10 py-4 sm:py-5">
              <Link
                href="/signup"
                className="w-full py-3 sm:py-3.5 rounded-full border-2 border-[#B8923F] text-[#B8923F] hover:bg-[#B8923F] hover:text-white font-serif font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] touch-manipulation text-center"
              >
                Apply as Authorized Distributor!
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Minimal Copyright Under the Card on Dark Canvas */}
        <p className="text-xs text-gray-500 text-center select-none py-1">
          Nafi Lock Industries all rights reserved ©
        </p>
      </div>

      {/* Forgot Password Guidance Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-divider relative text-gray-900"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#B8923F]/15 text-[#B8923F] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-gray-900">Password Recovery</h3>
                  <p className="text-[11px] text-gray-500">Factory Desk Verification</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-3.5">
                To protect wholesale pricing agreements, password resets are verified directly by our plant operations desk.
              </p>

              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-gray-900 mb-4 space-y-1">
                <div className="font-semibold text-gray-900">Operations Desk:</div>
                <div className="text-gray-500 font-mono text-[11px]">support@nafilockindustries.com</div>
                <div className="text-gray-500 font-mono text-[11px]">+91 90455 82310 (Mon–Sat)</div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B8923F] rounded-lg hover:bg-[#9B772E] transition-colors"
                >
                  Contact Desk
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-[#0F1117] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#B8923F] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

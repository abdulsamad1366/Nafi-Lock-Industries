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
      router.push(redirectUrl);
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please verify your credentials or check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("distributor@nafilock.com");
    setPassword("NafiDistributor2026!");
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100dvh-5.5rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-accent/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle Background Watermark Crest */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] aspect-[1024/759] opacity-[0.03] pointer-events-none select-none -z-10"
        aria-hidden="true"
      >
        <Image
          src="/images/nafi-crest-watermark.png"
          alt=""
          fill
          className="object-contain"
          priority={false}
        />
      </div>

      {/* Main Glassmorphic Login Card with Smooth Framer Motion Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-surface/95 backdrop-blur-xl border border-divider rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
            <Image
              src="/logos/nafi-logo.svg"
              alt="Nafi Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary tracking-tight">
            Distributor Portal
          </h1>
          <p className="text-xs text-muted mt-1">
            Sign in to access wholesale catalog, pricing & orders
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 shadow-2xs ${
                  error.includes("pending review")
                    ? "bg-amber-50/80 border-amber-200 text-amber-900"
                    : "bg-red-50/80 border-red-200 text-red-700"
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="flex-1 leading-snug">
                  <span className="font-semibold block">{error}</span>
                  {error.includes("pending review") && (
                    <span className="text-[11px] text-amber-800/80 mt-0.5 block">
                      Your dealership registration is undergoing factory verification.
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Corporate Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-bold mb-1.5">
              Corporate Email
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
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="distributor@dealership.com"
                className="w-full bg-background border border-divider rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-bold">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-accent hover:underline font-medium cursor-pointer"
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
                className="w-full bg-background border border-divider rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors cursor-pointer"
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

          {/* Remember Workstation & Subtle Demo Button */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-accent border-divider focus:ring-accent accent-accent cursor-pointer"
              />
              <span className="text-muted text-[11px]">Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-mono font-semibold text-accent hover:underline cursor-pointer"
            >
              Demo Login
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-accent text-background font-serif font-bold text-xs sm:text-sm rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer touch-manipulation"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-background" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer Links Inside Card */}
        <div className="mt-5 pt-4 border-t border-divider text-center space-y-2">
          <p className="text-xs text-muted">
            New dealership?{" "}
            <Link href="/signup" className="text-accent font-bold hover:underline">
              Apply for Distributorship →
            </Link>
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-muted">
            <Link href="/contact" className="hover:text-primary transition-colors">
              Factory Support
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-primary font-mono text-[10px] text-muted">
              Staff Portal
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Guidance Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-divider relative"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-primary">Password Recovery</h3>
                  <p className="text-[11px] text-muted">Direct Factory Verification</p>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed mb-4">
                To protect wholesale pricing agreements and account records, password resets are processed by the plant operations desk.
              </p>

              <div className="p-3 rounded-xl bg-background border border-divider text-xs text-primary mb-4 space-y-1">
                <div className="font-semibold text-primary">Operations Desk:</div>
                <div className="text-muted font-mono text-[11px]">support@nafilockindustries.com</div>
                <div className="text-muted font-mono text-[11px]">+91 90455 82310 (Mon–Sat)</div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-primary bg-background border border-divider rounded-lg hover:bg-surface transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  className="px-3.5 py-1.5 text-xs font-semibold text-background bg-accent rounded-lg hover:bg-accent-hover transition-colors"
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
        <div className="min-h-[calc(100dvh-5.5rem)] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

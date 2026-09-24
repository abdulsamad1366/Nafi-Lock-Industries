"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signupUser } from "@/lib/api";
import { setUserToken, setUser, setDistributorStatus } from "@/lib/userAuth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "distributor" ? "DISTRIBUTOR" : "CUSTOMER";

  const [role, setRole] = useState<"CUSTOMER" | "DISTRIBUTOR">(initialRole);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "distributor") {
      setRole("DISTRIBUTOR");
    } else if (r === "customer") {
      setRole("CUSTOMER");
    }
  }, [searchParams]);

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Distributor-Only Fields
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

    try {
      const payload: any = {
        name,
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role,
      };

      if (role === "DISTRIBUTOR") {
        payload.companyName = companyName.trim();
        payload.gstNumber = gstNumber.trim() || undefined;
        payload.businessAddress = businessAddress.trim();
        payload.city = city.trim();
        payload.state = state.trim();
      }

      const res = await signupUser(payload);

      if (role === "DISTRIBUTOR") {
        setIsSubmitted(true);
      } else {
        setUserToken(res.token);
        setUser(res.user);
        setDistributorStatus(res.status);
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#B8923F]/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Subtle Background Watermark Emblem */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] aspect-[1024/759] opacity-[0.035] pointer-events-none select-none -z-10"
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

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Crest */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#EBE7DF] p-2.5 mb-3 shadow-md group-hover:border-[#B8923F] transition-colors flex items-center justify-center">
              <Image
                src="/logos/nafi-logo.svg"
                alt="Nafi Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Nafi <span className="text-[#B8923F] font-normal italic">Lock Industries</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted mt-1">
              Account Registration & Dealership
            </span>
          </Link>
        </div>

        {/* Card */}
        {isSubmitted ? (
          <div className="bg-white border border-[#EBE7DF] rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF6EE] border border-[#E8DFCF] text-[#A67C2E] flex items-center justify-center mx-auto mb-6 shadow-xs">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6EE] text-[#7A5B20] border border-[#E8DFCF] text-xs font-mono uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#A67C2E]" />
              Application Submitted
            </div>

            <h2 className="font-serif text-2xl font-bold text-primary mb-3">
              Application submitted — you&apos;ll be able to log in once it&apos;s reviewed.
            </h2>

            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed mb-6">
              Thank you for applying to join the Nafi Lock Industries authorized distributor network. Our factory administration team reviews all commercial credentials within 1–2 business days.
            </p>

            <div className="bg-[#FAF9F7] border border-[#E0DBD1] rounded-2xl p-4 max-w-md mx-auto text-left text-xs mb-8 space-y-2">
              <div className="flex justify-between py-1 border-b border-divider/60">
                <span className="text-muted">Registered Firm:</span>
                <span className="font-semibold text-primary">{companyName || name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-divider/60">
                <span className="text-muted">Primary Email:</span>
                <span className="font-mono text-primary">{email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Status:</span>
                <span className="font-mono font-bold text-[#A67C2E]">Pending Review</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 bg-[#A67C2E] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#8E6720] transition-colors shadow-sm"
              >
                Go to Sign In
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-surface border border-divider text-primary font-sans font-semibold text-sm rounded-xl hover:bg-background transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-[#F5F3EF] p-1 border border-[#EBE7DF] mb-6">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                role === "CUSTOMER"
                  ? "bg-white text-primary shadow-xs border border-black/5"
                  : "text-muted hover:text-primary"
              }`}
            >
              Create Customer Account
            </button>
            <button
              type="button"
              onClick={() => setRole("DISTRIBUTOR")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                role === "DISTRIBUTOR"
                  ? "bg-white text-[#A67C2E] shadow-xs border border-black/5"
                  : "text-muted hover:text-[#A67C2E]"
              }`}
            >
              Apply as Distributor (B2B)
            </button>
          </div>

          {/* Description banner */}
          <div
            className={`p-3.5 rounded-xl text-xs mb-6 border ${
              role === "CUSTOMER"
                ? "bg-[#EEF4F8] text-[#1E4D6B] border-[#D6E3EC]"
                : "bg-[#FAF6EE] text-[#7A5B20] border-[#E8DFCF]"
            }`}
          >
            {role === "CUSTOMER" ? (
              <span>
                <strong>Customer Account:</strong> Instant activation. Save lock specifications, track personal product inquiries, and access architectural cut-sheets.
              </span>
            ) : (
              <span>
                <strong>Distributor Application:</strong> For authorized dealers & wholesale stockists. Requires admin review for B2B pricing, purchase orders, and ledgers.
              </span>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@hardware.com"
                  className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors font-mono"
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
            </div>

            {/* Additional fields for DISTRIBUTOR */}
            {role === "DISTRIBUTOR" && (
              <div className="space-y-4 pt-4 border-t border-[#EBE7DF]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                      Company / Hardware Firm *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Sharma Hardware & Trading Co."
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="09AAAAA0000A1Z5"
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                    Registered Business Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Shop No. 12, Hardware Market"
                    className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lucknow"
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary tracking-wider uppercase mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full bg-[#FAF9F7] border border-[#E0DBD1] rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted/50 focus:outline-hidden focus:border-[#B8923F] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-[#A67C2E] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#8E6720] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Submitting Registration...</span>
              ) : role === "CUSTOMER" ? (
                <>
                  <span>Create Account</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Submit Distributor Application</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-[#EBE7DF] text-center">
            <p className="text-xs text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-[#A67C2E] font-semibold hover:underline">
                Sign in to your portal →
              </Link>
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCFB]" />}>
      <SignupForm />
    </Suspense>
  );
}

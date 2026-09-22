"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/api";
import { setUserToken, setUser, setDistributorStatus } from "@/lib/userAuth";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "DISTRIBUTOR">("CUSTOMER");

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Distributor-Only Fields
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: any = {
        name,
        email,
        phone,
        password,
        role,
      };

      if (role === "DISTRIBUTOR") {
        payload.companyName = companyName;
        payload.gstNumber = gstNumber;
        payload.businessAddress = businessAddress;
        payload.city = city;
        payload.state = state;
      }

      const res = await signupUser(payload);
      setUserToken(res.token);
      setUser(res.user);
      setDistributorStatus(res.status);

      if (role === "DISTRIBUTOR") {
        router.push("/distributor");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Crest */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full bg-surface border border-accent/30 flex items-center justify-center p-2 mb-3 shadow-md group-hover:border-accent transition-colors">
              <Image
                src="/images/nafi-crest.png"
                alt="Nafi Crest"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Nafi <span className="text-accent font-normal italic">Lock Industries</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xs">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-background p-1 border border-divider mb-6">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-serif font-bold transition-all ${
                role === "CUSTOMER"
                  ? "bg-surface text-primary shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              Create Customer Account
            </button>
            <button
              type="button"
              onClick={() => setRole("DISTRIBUTOR")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-serif font-bold transition-all ${
                role === "DISTRIBUTOR"
                  ? "bg-accent text-background shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              Apply as Distributor
            </button>
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-xl font-bold text-primary mb-1">
              {role === "CUSTOMER"
                ? "Join Nafi Lock Industries"
                : "Distributor Network Application"}
            </h2>
            <p className="text-xs text-muted">
              {role === "CUSTOMER"
                ? "Save custom specifications, request quotes, and track inquiries."
                : "Unlock factory-direct wholesale pricing, minimum order quantities, and dedicated account ledger access."}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@hardware.com"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                />
              </div>
            </div>

            {/* Additional fields for DISTRIBUTOR */}
            {role === "DISTRIBUTOR" && (
              <div className="space-y-4 pt-4 border-t border-divider">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      Company / Hardware Firm *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Sharma Hardware & Trading Co."
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="09AAAAA0000A1Z5"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                    Registered Business Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Shop No. 12, Hardware Market"
                    className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lucknow"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-accent text-background font-serif font-bold text-sm rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="mt-6 pt-6 border-t border-divider text-center">
            <p className="text-xs text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Sign in to your portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { setUserToken, setUser, setDistributorStatus } from "@/lib/userAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });
      setUserToken(res.token);
      setUser(res.user);
      setDistributorStatus(res.status);

      if (res.user.role === "DISTRIBUTOR") {
        router.push("/distributor");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mt-1">
              Client & Distributor Portal
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface border border-divider rounded-2xl p-8 shadow-xl backdrop-blur-xs">
          <h2 className="font-serif text-xl font-bold text-primary mb-1 text-center">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-muted text-center mb-6">
            Access your B2B pricing, wholesale order history, or saved lock specifications.
          </p>

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
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Corporate or Personal Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dealer@hardwarecorp.com"
                className="w-full bg-background border border-divider rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-muted uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-background border border-divider rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-accent text-background font-serif font-bold text-sm rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-6 border-t border-divider text-center">
            <p className="text-xs text-muted">
              Don't have an account yet?{" "}
              <Link
                href="/signup"
                className="text-accent font-semibold hover:underline"
              >
                Create Account or Apply as Distributor →
              </Link>
            </p>
          </div>
        </div>

        {/* B2B Support Note */}
        <div className="mt-8 text-center text-xs text-muted">
          Need wholesale assistance?{" "}
          <Link href="/contact" className="hover:text-primary underline">
            Contact Factory Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

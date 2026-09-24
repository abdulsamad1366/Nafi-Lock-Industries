import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-background text-center">
      <div className="max-w-md w-full bg-surface border border-divider rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <line x1="9" y1="16" x2="15" y2="16" />
          </svg>
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">
          Error 404
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-8">
          The lock catalog route or specification page you requested does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-xl hover:bg-accent-hover transition-colors shadow-xs"
          >
            Return to Home
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-2.5 bg-background border border-divider text-primary font-serif font-semibold text-xs rounded-xl hover:bg-surface transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

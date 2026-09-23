"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin layout — auth-gated wrapper for all /admin/* routes.
 * Hides administrative navigation bar on the /admin/login page.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-divider bg-surface px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-serif font-bold text-lg text-accent">
              Nafi Factory Admin
            </span>
            <div className="flex items-center gap-4 text-xs font-serif overflow-x-auto py-1">
              <Link href="/admin/distributors" className="text-muted hover:text-accent font-semibold transition-colors">
                Distributors
              </Link>
              <Link href="/admin/orders" className="text-muted hover:text-accent font-semibold transition-colors">
                Orders
              </Link>
              <Link href="/admin/ledger-requests" className="text-muted hover:text-accent font-semibold transition-colors">
                Ledger Queue
              </Link>
              <Link href="/admin/products" className="text-muted hover:text-accent font-semibold transition-colors">
                Products & MOQ
              </Link>
              <Link href="/admin/sales-reps" className="text-muted hover:text-accent font-semibold transition-colors">
                Sales Reps
              </Link>
              <Link href="/admin/catalogs" className="text-muted hover:text-accent font-semibold transition-colors">
                Catalog PDFs
              </Link>
              <Link href="/admin/inquiries" className="text-muted hover:text-accent font-semibold transition-colors">
                Inquiries
              </Link>
            </div>
          </div>

          <div>
            <Link
              href="/"
              className="text-xs font-mono text-muted hover:text-primary transition-colors"
            >
              Exit to Public Site ↗
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

/**
 * Admin layout — auth-gated wrapper for all /admin/* routes.
 * Not visible in public navigation.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-divider px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <span className="font-headline text-lg text-accent">Admin Panel</span>
          <a href="/admin/brands" className="text-muted hover:text-primary text-sm">Brands</a>
          <a href="/admin/products" className="text-muted hover:text-primary text-sm">Products</a>
          <a href="/admin/inquiries" className="text-muted hover:text-primary text-sm">Inquiries</a>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}

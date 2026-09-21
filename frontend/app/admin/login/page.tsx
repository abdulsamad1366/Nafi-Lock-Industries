/**
 * Admin login page — JWT-based authentication.
 */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-surface border border-divider rounded-lg p-8 w-full max-w-sm">
        <h1 className="font-headline text-2xl mb-6 text-center">Admin Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
              placeholder="admin@nafilockindustries.com"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-background border border-divider rounded px-3 py-2 text-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-background font-medium py-2 rounded hover:bg-accent-hover transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

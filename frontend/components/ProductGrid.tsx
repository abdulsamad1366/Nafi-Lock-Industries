/**
 * ============================================================================
 * Component: ProductGrid
 * ============================================================================
 * Interactive product catalog container featuring category/brand filter tabs.
 *
 * Requirements & Architecture (05-SITE-MAP-AND-PAGES.md):
 * - Homepage View: Displays unified catalog with tabs: All | S-Nafi | Greek | Raksham.
 * - Brand Pages: Automatically filtered to display the specific brand's products.
 * - Responsive Grid: 1 column on mobile, 2 columns on tablet, 3 columns on desktop.
 */
export default function ProductGrid() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Section Heading ── */}
      <h2 className="font-headline text-2xl mb-6">Full Product Catalog</h2>

      {/* ── Filter Tabs Bar ── */}
      <div className="flex gap-4 mb-8 border-b border-divider pb-4 overflow-x-auto">
        <button className="text-accent text-sm font-medium border-b-2 border-accent pb-2">
          All
        </button>
        <button className="text-muted text-sm hover:text-primary pb-2 transition-colors">
          S-Nafi
        </button>
        <button className="text-muted text-sm hover:text-primary pb-2 transition-colors">
          Greek
        </button>
        <button className="text-muted text-sm hover:text-primary pb-2 transition-colors">
          Raksham
        </button>
      </div>

      {/* ── Responsive Product Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder state until products are fetched from database/API */}
        <p className="text-muted col-span-full py-8 text-center bg-surface border border-divider rounded-lg">
          Products will be loaded from the backend API.
        </p>
      </div>
    </div>
  );
}

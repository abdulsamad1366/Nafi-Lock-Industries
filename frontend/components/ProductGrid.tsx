/**
 * Product grid — displays all products with filter tabs.
 * Home page: All | S-Nafi | Greek | Raksham (per 05-SITE-MAP-AND-PAGES.md).
 * Brand pages: filtered to only that brand's products.
 */
export default function ProductGrid() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-headline text-2xl mb-6">Full Product Catalog</h2>

      {/* Filter tabs */}
      <div className="flex gap-4 mb-8 border-b border-divider pb-4">
        <button className="text-accent text-sm font-medium">All</button>
        <button className="text-muted text-sm hover:text-primary">S-Nafi</button>
        <button className="text-muted text-sm hover:text-primary">Greek</button>
        <button className="text-muted text-sm hover:text-primary">Raksham</button>
      </div>

      {/* Grid — populated from API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <p className="text-muted col-span-full">Products will be loaded from the API.</p>
      </div>
    </div>
  );
}

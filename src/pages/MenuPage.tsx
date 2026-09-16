import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import MenuItemRow from '@/components/MenuItemRow';
import { LoadingState, EmptyState, ErrorState } from '@/components/StateViews';
import { getFullMenu, searchMenuItems } from '@/services/menuService';
import type { CategoryWithItems, MenuItemWithRelations } from '@/types/menu';
import { BRAND } from '@/types/menu';

export default function MenuPage() {
  const [menu, setMenu] = useState<CategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItemWithRelations[] | null>(null);

  useEffect(() => {
    let active = true;
    getFullMenu()
      .then((data) => {
        if (active) {
          setMenu(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      searchMenuItems(search).then((results) => {
        if (active) setSearchResults(results);
      });
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  const categories = useMemo(() => menu.map((c) => ({ id: c.id, name: c.name, slug: c.slug, sort_order: c.sort_order, active: c.active })), [menu]);

  if (loading) return (
    <div className="min-h-screen">
      <LoadingState message="Loading your nutrition menu..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen">
      <ErrorState />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            <img
              src={BRAND.logoUrl}
              alt="Health Fuel monogram"
              className="w-16 h-16 sm:w-22 sm:h-22 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              <span className="text-avocado-500">Health</span>{' '}
              <span className="text-cream-100">Fuel</span>
            </h1>
          </div>
          <p className="text-cream-100/50 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mt-2">
            {BRAND.tagline}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      {/* Category Nav (hidden during search) */}
      {!search && <CategoryNav categories={categories} hasHeader={false} />}

      {/* Content */}
      <main className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Results */}
        {search && searchResults !== null && (
          <div className="animate-fade-in">
            <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              {searchResults.length > 0
                ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                : 'No results'}
            </h2>
            {searchResults.length > 0 ? (
              <div>
                {searchResults.map((item) => (
                  <MenuItemRow key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching items"
                message={`No items found for "${search}". Try a different search.`}
              />
            )}
          </div>
        )}

        {/* Full Menu */}
        {!search && (
          <div className="space-y-12 sm:space-y-16">
            {menu.map((cat) => (
              <section key={cat.id} id={cat.slug} className="animate-slide-up scroll-mt-32">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-cream-50 text-xl sm:text-2xl font-bold tracking-tight">
                    {cat.name}
                  </h2>
                  <Link
                    to={`/menu/${cat.slug}`}
                    className="text-avocado-400 text-xs font-semibold tracking-wider uppercase hover:text-avocado-300 transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="w-full h-px bg-avocado-500/15 mb-2" />
                {cat.items.length > 0 ? (
                  <div>
                    {cat.items.map((item) => (
                      <MenuItemRow key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-cream-100/30 text-sm py-4">Items coming soon.</p>
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-charcoal-700/30">
        <p className="text-sm font-bold tracking-[0.15em] uppercase text-center">
          <span className="text-avocado-500">HEALTH</span>{' '}
          <span className="text-cream-100">FUEL</span>
        </p>
        <p className="text-cream-100/30 text-xs font-medium tracking-[0.2em] uppercase text-center mt-1.5">
          {BRAND.tagline}
        </p>
      </footer>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import monogram from '@/assets/HF_Monogram.png';
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
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <img
            src={monogram}
            alt="Health Fuel monogram"
            className="w-[76px] sm:w-[120px] h-auto flex-shrink-0 object-contain"
          />
          <div className="min-w-0 text-center">
            <h1 className="text-[2rem] sm:text-4xl lg:text-5xl font-bold leading-none tracking-tight whitespace-nowrap">
              <span className="text-avocado-500">Health</span>{' '}
              <span className="text-cream-100">Fuel</span>
            </h1>
            <p className="text-cream-100 text-[0.55rem] sm:text-xs lg:text-sm font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase mt-2 whitespace-nowrap">
              {BRAND.tagline}
            </p>
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-3 sm:mt-4">
              <span className="h-px w-12 sm:w-20 bg-avocado-500" />
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-avocado-500" strokeWidth={1.5} />
              <span className="h-px w-12 sm:w-20 bg-avocado-500" />
            </div>
          </div>
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
          <div className="space-y-10 sm:space-y-14">
            {menu.map((cat) => (
              <section key={cat.id} id={cat.slug} className="animate-slide-up scroll-mt-32">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-cream-50 text-lg sm:text-xl font-bold tracking-tight uppercase">
                    {cat.name}
                  </h2>
                  {cat.items.length > 3 && (
                    <Link
                      to={`/menu/${cat.slug}`}
                      className="text-avocado-400 text-2xs font-semibold tracking-wider uppercase hover:text-avocado-300 transition-colors"
                    >
                      View all
                    </Link>
                  )}
                </div>
                <div className="w-full h-px bg-avocado-500/15 mb-1" />
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

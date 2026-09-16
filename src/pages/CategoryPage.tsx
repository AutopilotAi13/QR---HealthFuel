import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuItemRow from '@/components/MenuItemRow';
import { LoadingState, EmptyState, ErrorState, NotFoundState } from '@/components/StateViews';
import { getAllCategories, getMenuItemsByCategorySlug, getCategoryBySlug } from '@/services/menuService';
import type { Category, MenuItemWithRelations } from '@/types/menu';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<Category | null>(null);
  const [items, setItems] = useState<MenuItemWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setNotFound(false);

    Promise.all([
      getAllCategories(),
      getCategoryBySlug(category!),
      getMenuItemsByCategorySlug(category!),
    ])
      .then(([cats, categoryData, menuItems]) => {
        if (!active) return;
        setCategories(cats);
        setCat(categoryData);
        setItems(menuItems);
        if (!categoryData) setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [category]);

  if (loading) return (
    <div className="min-h-screen">
      <Header showBack />
      <LoadingState message="Loading category..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen">
      <Header showBack />
      <ErrorState />
    </div>
  );

  if (notFound || !cat) return (
    <div className="min-h-screen">
      <Header showBack />
      <NotFoundState
        title="Category not found"
        message="This menu category doesn't exist or may have been removed."
      />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header showBack />
      <CategoryNav categories={categories} activeSlug={cat.slug} />

      <main className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
        <h1 className="text-cream-50 text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          {cat.name}
        </h1>
        <p className="text-cream-100/40 text-sm mb-6">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </p>

        {items.length > 0 ? (
          <div>
            {items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items available"
            message="Items in this category are coming soon."
          />
        )}
      </main>
    </div>
  );
}

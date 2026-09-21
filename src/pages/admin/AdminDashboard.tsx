import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, FolderTree, Settings, FileWarning, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminGetMenuItems, adminGetCategories } from '@/services/adminRepository';

type ItemRow = {
  id: string;
  name: string;
  active: boolean;
  published: boolean;
  price: number;
  category_id: string;
  updated_at: string;
};

type CatRow = {
  id: string;
  name: string;
  active: boolean;
  published: boolean;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [cats, setCats] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetMenuItems(), adminGetCategories()])
      .then(([i, c]) => {
        setItems(i as unknown as ItemRow[]);
        setCats(c as unknown as CatRow[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const draftCount = items.filter((i) => !i.published).length;
  const inactiveCount = items.filter((i) => !i.active).length;
  const catCount = cats.length;
  const inactiveCats = cats.filter((c) => !c.active).length;

  const stats = [
    { label: 'Menu Items', value: items.length, icon: UtensilsCrossed, link: '/admin/items' },
    { label: 'Categories', value: catCount, icon: FolderTree, link: '/admin/categories' },
    { label: 'Draft (unpublished)', value: draftCount, icon: FileWarning, link: '/admin/items' },
    { label: 'Inactive items', value: inactiveCount, icon: CheckCircle2, link: '/admin/items' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-cream-50 text-xl font-bold tracking-tight mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-cream-100/40 text-sm">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  to={s.link}
                  className="bg-charcoal-800/50 border border-charcoal-700/30 rounded-xl p-4 hover:border-avocado-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-avocado-400/60" />
                    <span className="text-cream-100/40 text-2xs font-semibold tracking-wider uppercase">{s.label}</span>
                  </div>
                  <p className="text-cream-50 text-2xl font-bold">{s.value}</p>
                </Link>
              );
            })}
          </div>

          {draftCount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-amber-300/80 text-sm font-medium">
                {draftCount} item{draftCount !== 1 ? 's' : ''} have unpublished changes. Review and publish to make them visible to customers.
              </p>
            </div>
          )}

          {inactiveCats > 0 && (
            <div className="bg-charcoal-700/30 border border-charcoal-600/30 rounded-xl p-4">
              <p className="text-cream-100/40 text-sm">
                {inactiveCats} categor{inactiveCats !== 1 ? 'ies are' : 'y is'} currently inactive.
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Link to="/admin/items" className="text-avocado-400 hover:text-avocado-300 text-sm font-medium transition-colors">
              Manage menu items →
            </Link>
            <span className="text-cream-100/20">·</span>
            <Link to="/admin/settings" className="text-avocado-400 hover:text-avocado-300 text-sm font-medium transition-colors">
              Edit settings →
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

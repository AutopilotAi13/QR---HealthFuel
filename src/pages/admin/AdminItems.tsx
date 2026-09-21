import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, EyeOff, CheckCircle2, Circle, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminGetMenuItems, adminGetCategories, adminPublishMenuItem, adminUnpublishMenuItem } from '@/services/adminRepository';

type ItemRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category_id: string;
  active: boolean;
  published: boolean;
  updated_at: string;
};

type CatRow = { id: string; name: string };

export default function AdminItems() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [cats, setCats] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  useEffect(() => {
    Promise.all([adminGetMenuItems(), adminGetCategories()])
      .then(([i, c]) => {
        setItems(i as unknown as ItemRow[]);
        setCats(c as unknown as CatRow[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? '—';

  const filtered = useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterCat) list = list.filter((i) => i.category_id === filterCat);
    if (filterStatus === 'active') list = list.filter((i) => i.active && i.published);
    if (filterStatus === 'inactive') list = list.filter((i) => !i.active);
    if (filterStatus === 'draft') list = list.filter((i) => !i.published);
    return list;
  }, [items, search, filterCat, filterStatus]);

  async function togglePublish(id: string, current: boolean) {
    try {
      if (current) await adminUnpublishMenuItem(id);
      else await adminPublishMenuItem(id);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, published: !current } : i)));
    } catch (e) {
      alert('Failed to update publish status');
    }
  }

  function formatDate(ts: string) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-cream-50 text-xl font-bold tracking-tight">Menu Items</h1>
        <Link
          to="/admin/items/new"
          className="inline-flex items-center gap-1.5 bg-avocado-500 hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-lg px-3 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg pl-9 pr-3 py-2 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3 py-2 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'draft')}
          className="bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3 py-2 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-cream-100/40 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-cream-100/40 text-sm py-8 text-center">No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-charcoal-700/30">
                <th className="py-2 pr-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase">Name</th>
                <th className="py-2 px-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase hidden sm:table-cell">Category</th>
                <th className="py-2 px-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase">Price</th>
                <th className="py-2 px-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase">Status</th>
                <th className="py-2 px-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase hidden md:table-cell">Updated</th>
                <th className="py-2 pl-3 text-cream-100/40 text-2xs font-semibold tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-charcoal-700/20 hover:bg-charcoal-700/20 transition-colors">
                  <td className="py-2.5 pr-3">
                    <Link to={`/admin/items/${item.id}`} className="text-cream-50 text-sm font-medium hover:text-avocado-300 transition-colors">
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-cream-100/50 text-sm hidden sm:table-cell">{catName(item.category_id)}</td>
                  <td className="py-2.5 px-3 text-cream-100/70 text-sm tabular-nums">₹{item.price}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {item.active ? (
                        <span className="inline-flex items-center gap-1 text-avocado-400 text-xs"><CheckCircle2 className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-cream-100/30 text-xs"><Circle className="w-3 h-3" /> Inactive</span>
                      )}
                    </div>
                    {!item.published && (
                      <span className="inline-flex items-center gap-1 text-amber-400/70 text-xs mt-0.5"><Clock className="w-3 h-3" /> Draft</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-cream-100/40 text-xs hidden md:table-cell">{formatDate(item.updated_at)}</td>
                  <td className="py-2.5 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => togglePublish(item.id, item.published)}
                        className="text-cream-100/40 hover:text-avocado-400 transition-colors"
                        title={item.published ? 'Unpublish' : 'Publish'}
                      >
                        {item.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link
                        to={`/admin/items/${item.id}`}
                        className="text-cream-100/40 hover:text-avocado-400 transition-colors text-xs font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

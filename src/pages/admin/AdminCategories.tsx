import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminPublishCategory,
  adminUnpublishCategory,
} from '@/services/adminRepository';
import type { Category } from '@/types/menu';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    adminGetCategories()
      .then(setCats)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    const created = await adminCreateCategory({
      name: newName.trim(),
      slug: slugify(newName),
      sort_order: cats.length + 1,
      active: true,
      published: true,
    });
    setCats([...cats, created]);
    setNewName('');
    setCreating(false);
  }

  async function handleSaveEdit(id: string) {
    await adminUpdateCategory(id, { name: editName, slug: editSlug || slugify(editName) });
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, name: editName, slug: editSlug || slugify(editName) } : c)));
    setEditingId(null);
  }

  async function handleToggleActive(id: string, current: boolean) {
    await adminUpdateCategory(id, { active: !current });
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, active: !current } : c)));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    if (current) await adminUnpublishCategory(id);
    else await adminPublishCategory(id);
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, published: !current } : c)));
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? All menu items in this category will also be deleted.`)) return;
    await adminDeleteCategory(id);
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    const idx = cats.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cats.length) return;
    const a = cats[idx];
    const b = cats[swapIdx];
    const newA = a.sort_order;
    const newB = b.sort_order;
    await Promise.all([
      adminUpdateCategory(a.id, { sort_order: newB }),
      adminUpdateCategory(b.id, { sort_order: newA }),
    ]);
    setCats((prev) => {
      const next = [...prev];
      next[idx] = { ...a, sort_order: newB };
      next[swapIdx] = { ...b, sort_order: newA };
      return next.sort((x, y) => x.sort_order - y.sort_order);
    });
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-cream-50 text-xl font-bold tracking-tight">Categories</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 bg-avocado-500 hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-lg px-3 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {creating && (
        <div className="bg-charcoal-800/50 border border-avocado-500/20 rounded-xl p-4 mb-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
            placeholder="Category name"
            className="w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3 py-2 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreate} className="bg-avocado-500 hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors">Create</button>
            <button onClick={() => { setCreating(false); setNewName(''); }} className="text-cream-100/40 hover:text-cream-100 text-sm px-3 py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-cream-100/40 text-sm">Loading...</p>
      ) : cats.length === 0 ? (
        <p className="text-cream-100/40 text-sm py-8 text-center">No categories yet.</p>
      ) : (
        <div className="space-y-1.5">
          {cats.map((cat, idx) => (
            <div key={cat.id} className="bg-charcoal-800/30 border border-charcoal-700/30 rounded-xl px-4 py-3 flex items-center gap-3">
              {/* Move buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(cat.id, 'up')}
                  disabled={idx === 0}
                  className="text-cream-100/30 hover:text-avocado-400 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(cat.id, 'down')}
                  disabled={idx === cats.length - 1}
                  className="text-cream-100/30 hover:text-avocado-400 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name / edit */}
              <div className="flex-1 min-w-0">
                {editingId === cat.id ? (
                  <div className="flex gap-2">
                    <input value={editName} onChange={(e) => { setEditName(e.target.value); if (!editSlug) setEditSlug(slugify(e.target.value)); }} className="flex-1 bg-charcoal-800 border border-charcoal-700/50 rounded px-2.5 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50" />
                    <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} placeholder="slug" className="w-32 bg-charcoal-800 border border-charcoal-700/50 rounded px-2.5 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50" />
                    <button onClick={() => handleSaveEdit(cat.id)} className="text-avocado-400 hover:text-avocado-300"><Save className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div>
                    <p className="text-cream-50 text-sm font-medium">{cat.name}</p>
                    <p className="text-cream-100/30 text-xs">/{cat.slug}</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(cat.id, cat.active)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors ${cat.active ? 'text-avocado-400 bg-avocado-500/10' : 'text-cream-100/30 bg-charcoal-700/30'}`}
                >
                  {cat.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleTogglePublish(cat.id, cat.published ?? true)}
                  className={`transition-colors ${cat.published ? 'text-avocado-400 hover:text-avocado-300' : 'text-amber-400/70 hover:text-amber-400'}`}
                  title={cat.published ? 'Published' : 'Unpublished'}
                >
                  {cat.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {editingId !== cat.id && (
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditSlug(cat.slug); }} className="text-cream-100/40 hover:text-avocado-400 text-xs font-medium transition-colors">
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-cream-100/30 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

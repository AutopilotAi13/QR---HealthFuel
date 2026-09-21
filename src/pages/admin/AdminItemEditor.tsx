import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, Plus, X, ArrowLeft, Eye, Upload, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  adminGetMenuItem,
  adminGetCategories,
  adminGetServings,
  adminGetNutrition,
  adminGetMicronutrients,
  adminGetIngredients,
  adminGetDietaryTags,
  adminGetAllergens,
  adminUpdateMenuItem,
  adminCreateMenuItem,
  adminDeleteMenuItem,
  adminCreateServing,
  adminUpdateServing,
  adminDeleteServing,
  adminUpsertNutrition,
  adminCreateMicronutrient,
  adminUpdateMicronutrient,
  adminDeleteMicronutrient,
  adminCreateIngredient,
  adminUpdateIngredient,
  adminDeleteIngredient,
  adminCreateDietaryTag,
  adminDeleteDietaryTag,
  adminCreateAllergen,
  adminDeleteAllergen,
  adminPublishMenuItem,
} from '@/services/adminRepository';
import type { Category, Serving, Nutrition, Micronutrient, Ingredient, DietaryTag, Allergen } from '@/types/menu';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminItemEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');

  // Relations
  const [servings, setServings] = useState<Serving[]>([]);
  const [nutrition, setNutrition] = useState<Nutrition[]>([]);
  const [micronutrients, setMicronutrients] = useState<Micronutrient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const [newIngredient, setNewIngredient] = useState('');
  const [newDietaryTag, setNewDietaryTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  const loadAll = useCallback(async () => {
    if (!id || isNew) return;
    const [item, categories, srvs, nuts, micros, ings, tags, algs] = await Promise.all([
      adminGetMenuItem(id),
      adminGetCategories(),
      adminGetServings(id),
      adminGetNutrition(id),
      adminGetMicronutrients(id),
      adminGetIngredients(id),
      adminGetDietaryTags(id),
      adminGetAllergens(id),
    ]);
    setCats(categories);
    setName(item.name);
    setSlug(item.slug);
    setCategoryId(item.category_id);
    setPrice(item.price);
    setDescription(item.description ?? '');
    setImageUrl(item.image_url ?? '');
    setActive(item.active);
    setSortOrder(item.sort_order);
    setPublished(item.published);
    setUpdatedAt(item.updated_at);
    setServings(srvs);
    setNutrition(nuts);
    setMicronutrients(micros);
    setIngredients(ings);
    setDietaryTags(tags);
    setAllergens(algs);
    setLoading(false);
  }, [id, isNew]);

  useEffect(() => {
    if (isNew) {
      adminGetCategories().then(setCats).catch(() => {});
    } else {
      loadAll();
    }
  }, [id, isNew, loadAll]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        category_id: categoryId,
        price: Number(price),
        description: description || null,
        image_url: imageUrl || null,
        active,
        sort_order: Number(sortOrder),
        published,
      };

      if (isNew) {
        const created = await adminCreateMenuItem(payload);
        navigate(`/admin/items/${created.id}`, { replace: true });
      } else {
        await adminUpdateMenuItem(id!, payload);
        await loadAll();
      }
    } catch (e) {
      alert('Failed to save item');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id || isNew) return;
    if (!confirm(`Delete "${name}"? This will also delete all servings, nutrition, and related data.`)) return;
    await adminDeleteMenuItem(id);
    navigate('/admin/items');
  }

  async function handlePublish() {
    if (!id || isNew) return;
    await adminPublishMenuItem(id);
    setPublished(true);
    await loadAll();
  }

  // ── Servings ──────────────────────────────────────────────

  async function addServing() {
    if (!id || isNew) return;
    const newSort = servings.length + 1;
    const created = await adminCreateServing({
      menu_item_id: id,
      name: 'New Serving',
      multiplier: 1,
      price: Number(price),
      sort_order: newSort,
    });
    setServings([...servings, created]);
  }

  async function updateServingField(srvId: string, field: keyof Serving, value: string | number) {
    setServings((prev) => prev.map((s) => (s.id === srvId ? { ...s, [field]: value } : s)));
    await adminUpdateServing(srvId, { [field]: value } as Partial<Serving>);
  }

  async function removeServing(srvId: string) {
    if (!confirm('Delete this serving?')) return;
    await adminDeleteServing(srvId);
    setServings((prev) => prev.filter((s) => s.id !== srvId));
    setNutrition((prev) => prev.filter((n) => n.serving_id !== srvId));
  }

  // ── Nutrition ─────────────────────────────────────────────

  function getNutritionForServing(servingId: string): Nutrition | undefined {
    return nutrition.find((n) => n.serving_id === servingId);
  }

  async function updateNutritionField(servingId: string, field: keyof Nutrition, value: number) {
    const existing = getNutritionForServing(servingId);
    if (!existing || !id) return;
    const updated = { ...existing, [field]: value, is_mock: false };
    setNutrition((prev) => prev.map((n) => (n.id === existing.id ? updated : n)));
    await adminUpsertNutrition(updated);
  }

  // ── Micronutrients ────────────────────────────────────────

  async function addMicronutrient(servingId: string) {
    if (!id) return;
    const created = await adminCreateMicronutrient({
      menu_item_id: id,
      serving_id: servingId,
      nutrient_name: 'New Nutrient',
      amount: 0,
      unit: 'mg',
    });
    setMicronutrients([...micronutrients, created]);
  }

  async function updateMicroField(microId: string, field: keyof Micronutrient, value: string | number) {
    setMicronutrients((prev) => prev.map((m) => (m.id === microId ? { ...m, [field]: value } : m)));
    await adminUpdateMicronutrient(microId, { [field]: value } as Partial<Micronutrient>);
  }

  async function removeMicro(microId: string) {
    await adminDeleteMicronutrient(microId);
    setMicronutrients((prev) => prev.filter((m) => m.id !== microId));
  }

  // ── Ingredients ──────────────────────────────────────────

  async function addIngredient() {
    if (!id || !newIngredient.trim()) return;
    const created = await adminCreateIngredient({
      menu_item_id: id,
      ingredient_name: newIngredient.trim(),
      sort_order: ingredients.length + 1,
    });
    setIngredients([...ingredients, created]);
    setNewIngredient('');
  }

  async function removeIngredient(ingId: string) {
    await adminDeleteIngredient(ingId);
    setIngredients((prev) => prev.filter((i) => i.id !== ingId));
  }

  // ── Dietary Tags ─────────────────────────────────────────

  async function addDietaryTag() {
    if (!id || !newDietaryTag.trim()) return;
    const created = await adminCreateDietaryTag({ menu_item_id: id, tag: newDietaryTag.trim() });
    setDietaryTags([...dietaryTags, created]);
    setNewDietaryTag('');
  }

  async function removeDietaryTag(tagId: string) {
    await adminDeleteDietaryTag(tagId);
    setDietaryTags((prev) => prev.filter((d) => d.id !== tagId));
  }

  // ── Allergens ─────────────────────────────────────────────

  async function addAllergen() {
    if (!id || !newAllergen.trim()) return;
    const created = await adminCreateAllergen({ menu_item_id: id, allergen: newAllergen.trim() });
    setAllergens([...allergens, created]);
    setNewAllergen('');
  }

  async function removeAllergen(algId: string) {
    await adminDeleteAllergen(algId);
    setAllergens((prev) => prev.filter((a) => a.id !== algId));
  }

  const inputClass = 'w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3 py-2 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors';
  const labelClass = 'block text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-1.5';
  const cardClass = 'bg-charcoal-800/30 border border-charcoal-700/30 rounded-xl p-4';

  if (loading) return <AdminLayout><p className="text-cream-100/40 text-sm">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/items')} className="text-cream-100/40 hover:text-avocado-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-cream-50 text-xl font-bold tracking-tight">
            {isNew ? 'New Menu Item' : name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !published && (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 bg-avocado-500 hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-lg px-3 py-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> Publish
            </button>
          )}
          {!isNew && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-red-400/60 hover:text-red-400 text-sm font-medium rounded-lg px-3 py-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-avocado-500 hover:bg-avocado-400 disabled:opacity-50 text-cream-50 text-sm font-semibold rounded-lg px-3 py-2 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {!isNew && !published && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400/70" />
          <p className="text-amber-300/80 text-sm">This item is currently a draft and not visible to customers.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic info */}
        <div className={cardClass}>
          <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input value={name} onChange={(e) => { setName(e.target.value); if (isNew || !slug) setSlug(slugify(e.target.value)); }} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                <option value="">Select category</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Image URL</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-avocado-500" />
                <span className="text-cream-100/70 text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-avocado-500" />
                <span className="text-cream-100/70 text-sm">Published</span>
              </label>
            </div>
          </div>
          {!isNew && updatedAt && (
            <p className="text-cream-100/30 text-xs mt-4">Last updated: {new Date(updatedAt).toLocaleString()}</p>
          )}
        </div>

        {/* Servings + Nutrition */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase">Servings & Nutrition</h2>
            {!isNew && (
              <button onClick={addServing} className="inline-flex items-center gap-1 text-avocado-400 hover:text-avocado-300 text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Add Serving
              </button>
            )}
          </div>

          {isNew ? (
            <p className="text-cream-100/30 text-sm">Save the item first to add servings and nutrition.</p>
          ) : servings.length === 0 ? (
            <p className="text-cream-100/30 text-sm">No servings yet.</p>
          ) : (
            <div className="space-y-4">
              {servings.map((srv) => {
                const nut = getNutritionForServing(srv.id);
                const micros = micronutrients.filter((m) => m.serving_id === srv.id);
                return (
                  <div key={srv.id} className="bg-charcoal-700/20 border border-charcoal-600/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        value={srv.name}
                        onChange={(e) => updateServingField(srv.id, 'name', e.target.value)}
                        className="flex-1 bg-charcoal-800 border border-charcoal-700/50 rounded px-2.5 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
                      />
                      <input
                        type="number"
                        value={srv.multiplier}
                        onChange={(e) => updateServingField(srv.id, 'multiplier', Number(e.target.value))}
                        className="w-16 bg-charcoal-800 border border-charcoal-700/50 rounded px-2.5 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
                        title="Multiplier"
                      />
                      <input
                        type="number"
                        value={srv.price ?? 0}
                        onChange={(e) => updateServingField(srv.id, 'price', Number(e.target.value))}
                        className="w-20 bg-charcoal-800 border border-charcoal-700/50 rounded px-2.5 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
                        title="Price"
                      />
                      <button onClick={() => removeServing(srv.id)} className="text-red-400/40 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Macro nutrition */}
                    {nut && (
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                        {(['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar', 'sodium'] as const).map((field) => (
                          <div key={field}>
                            <label className="text-cream-100/30 text-2xs font-medium uppercase tracking-wider">{field.replace('carbohydrates', 'carbs')}</label>
                            <input
                              type="number"
                              value={nut[field]}
                              onChange={(e) => updateNutritionField(srv.id, field, Number(e.target.value))}
                              className="w-full bg-charcoal-800 border border-charcoal-700/50 rounded px-2 py-1.5 text-cream-50 text-sm focus:outline-none focus:border-avocado-500/50"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Micronutrients */}
                    {micros.length > 0 && (
                      <div className="space-y-1.5 mb-2">
                        <p className="text-cream-100/40 text-2xs font-semibold uppercase tracking-wider">Micronutrients</p>
                        {micros.map((m) => (
                          <div key={m.id} className="flex items-center gap-2">
                            <input
                              value={m.nutrient_name}
                              onChange={(e) => updateMicroField(m.id, 'nutrient_name', e.target.value)}
                              className="flex-1 bg-charcoal-800 border border-charcoal-700/50 rounded px-2 py-1 text-cream-50 text-xs focus:outline-none focus:border-avocado-500/50"
                            />
                            <input
                              type="number"
                              value={m.amount}
                              onChange={(e) => updateMicroField(m.id, 'amount', Number(e.target.value))}
                              className="w-16 bg-charcoal-800 border border-charcoal-700/50 rounded px-2 py-1 text-cream-50 text-xs focus:outline-none focus:border-avocado-500/50"
                            />
                            <input
                              value={m.unit}
                              onChange={(e) => updateMicroField(m.id, 'unit', e.target.value)}
                              className="w-12 bg-charcoal-800 border border-charcoal-700/50 rounded px-2 py-1 text-cream-50 text-xs focus:outline-none focus:border-avocado-500/50"
                            />
                            <button onClick={() => removeMicro(m.id)} className="text-red-400/40 hover:text-red-400 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => addMicronutrient(srv.id)} className="text-avocado-400/60 hover:text-avocado-300 text-xs font-medium">
                      + Add micronutrient
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className={cardClass}>
          <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-4">Ingredients</h2>
          {isNew ? (
            <p className="text-cream-100/30 text-sm">Save the item first to add ingredients.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {ingredients.map((ing) => (
                  <span key={ing.id} className="inline-flex items-center gap-1.5 bg-charcoal-700/40 border border-charcoal-600/30 rounded-lg px-2.5 py-1 text-cream-100/70 text-sm">
                    {ing.ingredient_name}
                    <button onClick={() => removeIngredient(ing.id)} className="text-cream-100/30 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  className={inputClass}
                  placeholder="Add ingredient..."
                />
                <button onClick={addIngredient} className="bg-avocado-500/20 hover:bg-avocado-500/30 text-avocado-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                  Add
                </button>
              </div>
            </>
          )}
        </div>

        {/* Dietary Tags + Allergens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={cardClass}>
            <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-4">Dietary Tags</h2>
            {isNew ? (
              <p className="text-cream-100/30 text-sm">Save first.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dietaryTags.map((d) => (
                    <span key={d.id} className="inline-flex items-center gap-1.5 bg-avocado-500/10 border border-avocado-500/20 rounded-lg px-2.5 py-1 text-avocado-300 text-sm">
                      {d.tag}
                      <button onClick={() => removeDietaryTag(d.id)} className="text-avocado-300/50 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newDietaryTag} onChange={(e) => setNewDietaryTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryTag())} className={inputClass} placeholder="Add tag..." />
                  <button onClick={addDietaryTag} className="bg-avocado-500/20 hover:bg-avocado-500/30 text-avocado-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap">Add</button>
                </div>
              </>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-4">Allergens</h2>
            {isNew ? (
              <p className="text-cream-100/30 text-sm">Save first.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {allergens.map((a) => (
                    <span key={a.id} className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1 text-red-300/80 text-sm">
                      {a.allergen}
                      <button onClick={() => removeAllergen(a.id)} className="text-red-300/50 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newAllergen} onChange={(e) => setNewAllergen(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())} className={inputClass} placeholder="Add allergen..." />
                  <button onClick={addAllergen} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap">Add</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import type {
  Allergen,
  Category,
  DietaryTag,
  Ingredient,
  Micronutrient,
  Nutrition,
  Serving,
  Settings,
} from '@/types/menu';
import { supabase } from '@/lib/supabase';

// ──────────────────────────────────────────────────────────────
// Admin Repository — CRUD operations for the CMS
// All operations require an authenticated admin session.
// RLS enforces admin-only access server-side.
// ──────────────────────────────────────────────────────────────

function requireClient() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

// ── Categories ─────────────────────────────────────────────────

export async function adminGetCategories(): Promise<Category[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data as Category[];
}

export async function adminCreateCategory(cat: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const sb = requireClient();
  const { data, error } = await sb.from('categories').insert(cat).select().single();
  if (error) throw error;
  return data as Category;
}

export async function adminUpdateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const sb = requireClient();
  const { data, error } = await sb.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Category;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ── Menu Items ────────────────────────────────────────────────

type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  published: boolean;
  draft_data: Record<string, unknown> | null;
  temporarily_unavailable: boolean;
  created_at: string;
  updated_at: string;
};

export async function adminGetMenuItems(): Promise<MenuItemRow[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('menu_items')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data as MenuItemRow[];
}

export async function adminGetMenuItem(id: string) {
  const sb = requireClient();
  const { data, error } = await sb
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as MenuItemRow;
}

export async function adminCreateMenuItem(item: Partial<MenuItemRow>): Promise<MenuItemRow> {
  const sb = requireClient();
  const { data, error } = await sb.from('menu_items').insert(item).select().single();
  if (error) throw error;
  return data as MenuItemRow;
}

export async function adminUpdateMenuItem(id: string, updates: Partial<MenuItemRow>): Promise<MenuItemRow> {
  const sb = requireClient();
  const { data, error } = await sb.from('menu_items').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as MenuItemRow;
}

export async function adminDeleteMenuItem(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}

// ── Servings ──────────────────────────────────────────────────

export async function adminGetServings(menuItemId: string): Promise<Serving[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('servings')
    .select('*')
    .eq('menu_item_id', menuItemId)
    .order('sort_order');
  if (error) throw error;
  return data as Serving[];
}

export async function adminCreateServing(serving: Partial<Serving>): Promise<Serving> {
  const sb = requireClient();
  const { data, error } = await sb.from('servings').insert(serving).select().single();
  if (error) throw error;
  return data as Serving;
}

export async function adminUpdateServing(id: string, updates: Partial<Serving>): Promise<Serving> {
  const sb = requireClient();
  const { data, error } = await sb.from('servings').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Serving;
}

export async function adminDeleteServing(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('servings').delete().eq('id', id);
  if (error) throw error;
}

// ── Nutrition ─────────────────────────────────────────────────

export async function adminGetNutrition(menuItemId: string): Promise<Nutrition[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('nutrition')
    .select('*')
    .eq('menu_item_id', menuItemId);
  if (error) throw error;
  return data as Nutrition[];
}

export async function adminUpsertNutrition(n: Partial<Nutrition>): Promise<Nutrition> {
  const sb = requireClient();
  if (n.id) {
    const { data, error } = await sb.from('nutrition').update(n).eq('id', n.id).select().single();
    if (error) throw error;
    return data as Nutrition;
  }
  const { data, error } = await sb.from('nutrition').insert(n).select().single();
  if (error) throw error;
  return data as Nutrition;
}

export async function adminDeleteNutrition(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('nutrition').delete().eq('id', id);
  if (error) throw error;
}

// ── Micronutrients ────────────────────────────────────────────

export async function adminGetMicronutrients(menuItemId: string): Promise<Micronutrient[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('micronutrients')
    .select('*')
    .eq('menu_item_id', menuItemId);
  if (error) throw error;
  return data as Micronutrient[];
}

export async function adminCreateMicronutrient(m: Partial<Micronutrient>): Promise<Micronutrient> {
  const sb = requireClient();
  const { data, error } = await sb.from('micronutrients').insert(m).select().single();
  if (error) throw error;
  return data as Micronutrient;
}

export async function adminUpdateMicronutrient(id: string, updates: Partial<Micronutrient>): Promise<Micronutrient> {
  const sb = requireClient();
  const { data, error } = await sb.from('micronutrients').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Micronutrient;
}

export async function adminDeleteMicronutrient(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('micronutrients').delete().eq('id', id);
  if (error) throw error;
}

// ── Ingredients ───────────────────────────────────────────────

export async function adminGetIngredients(menuItemId: string): Promise<Ingredient[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('ingredients')
    .select('*')
    .eq('menu_item_id', menuItemId)
    .order('sort_order');
  if (error) throw error;
  return data as Ingredient[];
}

export async function adminCreateIngredient(i: Partial<Ingredient>): Promise<Ingredient> {
  const sb = requireClient();
  const { data, error } = await sb.from('ingredients').insert(i).select().single();
  if (error) throw error;
  return data as Ingredient;
}

export async function adminUpdateIngredient(id: string, updates: Partial<Ingredient>): Promise<Ingredient> {
  const sb = requireClient();
  const { data, error } = await sb.from('ingredients').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Ingredient;
}

export async function adminDeleteIngredient(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('ingredients').delete().eq('id', id);
  if (error) throw error;
}

// ── Dietary Tags ──────────────────────────────────────────────

export async function adminGetDietaryTags(menuItemId: string): Promise<DietaryTag[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('dietary_tags')
    .select('*')
    .eq('menu_item_id', menuItemId);
  if (error) throw error;
  return data as DietaryTag[];
}

export async function adminCreateDietaryTag(d: Partial<DietaryTag>): Promise<DietaryTag> {
  const sb = requireClient();
  const { data, error } = await sb.from('dietary_tags').insert(d).select().single();
  if (error) throw error;
  return data as DietaryTag;
}

export async function adminDeleteDietaryTag(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('dietary_tags').delete().eq('id', id);
  if (error) throw error;
}

// ── Allergens ─────────────────────────────────────────────────

export async function adminGetAllergens(menuItemId: string): Promise<Allergen[]> {
  const sb = requireClient();
  const { data, error } = await sb
    .from('allergens')
    .select('*')
    .eq('menu_item_id', menuItemId);
  if (error) throw error;
  return data as Allergen[];
}

export async function adminCreateAllergen(a: Partial<Allergen>): Promise<Allergen> {
  const sb = requireClient();
  const { data, error } = await sb.from('allergens').insert(a).select().single();
  if (error) throw error;
  return data as Allergen;
}

export async function adminDeleteAllergen(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('allergens').delete().eq('id', id);
  if (error) throw error;
}

// ── Settings ──────────────────────────────────────────────────

export async function adminGetSettings(): Promise<Settings> {
  const sb = requireClient();
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as Settings;
}

export async function adminUpdateSettings(updates: Partial<Settings>): Promise<Settings> {
  const sb = requireClient();
  const { data, error } = await sb.from('settings').update(updates).eq('id', 1).select().single();
  if (error) throw error;
  return data as Settings;
}

// ── Publish / Unpublish ───────────────────────────────────────

export async function adminPublishMenuItem(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('menu_items').update({ published: true, draft_data: null }).eq('id', id);
  if (error) throw error;
}

export async function adminUnpublishMenuItem(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('menu_items').update({ published: false }).eq('id', id);
  if (error) throw error;
}

export async function adminPublishCategory(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('categories').update({ published: true }).eq('id', id);
  if (error) throw error;
}

export async function adminUnpublishCategory(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('categories').update({ published: false }).eq('id', id);
  if (error) throw error;
}

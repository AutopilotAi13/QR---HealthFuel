import type {
  Allergen,
  Category,
  CategoryWithItems,
  DietaryTag,
  Ingredient,
  MenuItemWithRelations,
  Micronutrient,
  Nutrition,
  Serving,
} from '@/types/menu';
import { supabase } from '@/lib/supabase';
import { LocalMenuRepository } from '@/services/localMenuRepository';
import type { MenuRepository } from '@/services/menuRepository';

// ──────────────────────────────────────────────────────────────
// SupabaseMenuRepository — Supabase is the ONLY source of truth
//
// When the Supabase client is available, all data comes from
// Supabase. Query errors propagate to the UI (error state).
// The local fallback is used ONLY when the Supabase client is
// not initialized (development without env vars).
// ──────────────────────────────────────────────────────────────

const localFallback = new LocalMenuRepository();

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
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
};

export class SupabaseMenuRepository implements MenuRepository {
  async getAllCategories(): Promise<Category[]> {
    if (!supabase) return localFallback.getAllCategories();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, active')
      .eq('active', true)
      .order('sort_order');
    if (error) throw error;
    return data as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!supabase) return localFallback.getCategoryBySlug(slug);
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, active')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (error) throw error;
    return (data as Category) ?? null;
  }

  async getAllMenuItems(): Promise<MenuItemWithRelations[]> {
    if (!supabase) return localFallback.getAllMenuItems();
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
      .eq('active', true)
      .order('sort_order');
    if (error) throw error;
    return await this.assembleItems(items as MenuItemRow[]);
  }

  async getMenuItemsByCategorySlug(slug: string): Promise<MenuItemWithRelations[]> {
    if (!supabase) return localFallback.getMenuItemsByCategorySlug(slug);
    const { data: cat, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (catError) throw catError;
    if (!cat) return [];

    const { data: items, error } = await supabase
      .from('menu_items')
      .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
      .eq('category_id', cat.id)
      .eq('active', true)
      .order('sort_order');
    if (error) throw error;
    return await this.assembleItems(items as MenuItemRow[]);
  }

  async getMenuItemBySlug(slug: string): Promise<MenuItemWithRelations | null> {
    if (!supabase) return localFallback.getMenuItemBySlug(slug);
    const { data: item, error } = await supabase
      .from('menu_items')
      .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (error) throw error;
    if (!item) return null;
    const assembled = await this.assembleItems([item as MenuItemRow]);
    return assembled[0] ?? null;
  }

  async getFullMenu(): Promise<CategoryWithItems[]> {
    if (!supabase) return localFallback.getFullMenu();
    const { data: cats, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, active')
      .eq('active', true)
      .order('sort_order');
    if (catError) throw catError;

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
      .eq('active', true)
      .order('sort_order');
    if (itemError) throw itemError;

    const itemIds = (items as MenuItemRow[]).map((i) => i.id);
    const relations = await this.fetchRelations(itemIds);

    const assembledByCategory = new Map<string, MenuItemWithRelations[]>();
    for (const item of items as MenuItemRow[]) {
      const assembled = this.assembleSingle(item, relations);
      const list = assembledByCategory.get(item.category_id) ?? [];
      list.push(assembled);
      assembledByCategory.set(item.category_id, list);
    }

    return (cats as CategoryRow[]).map((cat) => ({
      ...cat,
      items: assembledByCategory.get(cat.id) ?? [],
    }));
  }

  async searchMenuItems(query: string): Promise<MenuItemWithRelations[]> {
    const q = query.trim();
    if (!q) return [];
    if (!supabase) return localFallback.searchMenuItems(query);

    const { data: items, error } = await supabase
      .from('menu_items')
      .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
      .eq('active', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order('sort_order');
    if (error) throw error;

    const itemIds = (items as MenuItemRow[]).map((i) => i.id);
    const relations = await this.fetchRelations(itemIds);

    return (items as MenuItemRow[]).map((item) => this.assembleSingle(item, relations));
  }

  // ── Relation fetching ────────────────────────────────────────

  private async fetchRelations(itemIds: string[]) {
    if (itemIds.length === 0) {
      return {
        servings: [] as Serving[],
        nutrition: [] as Nutrition[],
        micronutrients: [] as Micronutrient[],
        ingredients: [] as Ingredient[],
        dietaryTags: [] as DietaryTag[],
        allergens: [] as Allergen[],
        categories: [] as CategoryRow[],
      };
    }

    const sb = supabase!;
    const [
      { data: servings, error: e1 },
      { data: nutrition, error: e2 },
      { data: micronutrients, error: e3 },
      { data: ingredients, error: e4 },
      { data: dietaryTags, error: e5 },
      { data: allergens, error: e6 },
      { data: categories, error: e7 },
    ] = await Promise.all([
      sb.from('servings').select('*').in('menu_item_id', itemIds).order('sort_order'),
      sb.from('nutrition').select('*').in('menu_item_id', itemIds),
      sb.from('micronutrients').select('*').in('menu_item_id', itemIds),
      sb.from('ingredients').select('*').in('menu_item_id', itemIds).order('sort_order'),
      sb.from('dietary_tags').select('*').in('menu_item_id', itemIds),
      sb.from('allergens').select('*').in('menu_item_id', itemIds),
      sb.from('categories').select('id, name, slug, sort_order, active'),
    ]);

    if (e1) throw e1;
    if (e2) throw e2;
    if (e3) throw e3;
    if (e4) throw e4;
    if (e5) throw e5;
    if (e6) throw e6;
    if (e7) throw e7;

    return {
      servings: (servings ?? []) as Serving[],
      nutrition: (nutrition ?? []) as Nutrition[],
      micronutrients: (micronutrients ?? []) as Micronutrient[],
      ingredients: (ingredients ?? []) as Ingredient[],
      dietaryTags: (dietaryTags ?? []) as DietaryTag[],
      allergens: (allergens ?? []) as Allergen[],
      categories: (categories ?? []) as CategoryRow[],
    };
  }

  private async assembleItems(items: MenuItemRow[]): Promise<MenuItemWithRelations[]> {
    const itemIds = items.map((i) => i.id);
    const relations = await this.fetchRelations(itemIds);
    return items.map((item) => this.assembleSingle(item, relations));
  }

  private assembleSingle(
    item: MenuItemRow,
    rel: {
      servings: Serving[];
      nutrition: Nutrition[];
      micronutrients: Micronutrient[];
      ingredients: Ingredient[];
      dietaryTags: DietaryTag[];
      allergens: Allergen[];
      categories: CategoryRow[];
    },
  ): MenuItemWithRelations {
    const category = rel.categories.find((c) => c.id === item.category_id);
    return {
      ...item,
      category,
      servings: rel.servings.filter((s) => s.menu_item_id === item.id),
      nutrition: rel.nutrition.filter((n) => n.menu_item_id === item.id),
      micronutrients: rel.micronutrients.filter((m) => m.menu_item_id === item.id),
      ingredients: rel.ingredients.filter((i) => i.menu_item_id === item.id),
      dietary_tags: rel.dietaryTags.filter((d) => d.menu_item_id === item.id),
      allergens: rel.allergens.filter((a) => a.menu_item_id === item.id),
    };
  }
}

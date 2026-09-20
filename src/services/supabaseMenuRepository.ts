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
// SupabaseMenuRepository — reads from Supabase with local fallback
//
// Implements the same MenuRepository interface as LocalMenuRepository.
// If a Supabase query fails (network error, missing table, etc.),
// the method falls back to the local repository so the app stays
// functional during development.
//
// NUTRITION VALUES IN THE DATABASE ARE MOCK V1 PLACEHOLDERS (is_mock=true).
// ──────────────────────────────────────────────────────────────

const localFallback = new LocalMenuRepository();

function requireSupabase() {
  if (!supabase) throw new Error('Supabase client not initialized');
  return supabase;
}

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
    try {
      const { data, error } = await requireSupabase()
        .from('categories')
        .select('id, name, slug, sort_order, active')
        .eq('active', true)
        .order('sort_order');

      if (error || !data) throw new Error(error?.message ?? 'No data');
      return data as Category[];
    } catch {
      return localFallback.getAllCategories();
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await requireSupabase()
        .from('categories')
        .select('id, name, slug, sort_order, active')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return (data as Category) ?? null;
    } catch {
      return localFallback.getCategoryBySlug(slug);
    }
  }

  async getAllMenuItems(): Promise<MenuItemWithRelations[]> {
    try {
      const { data: items, error } = await requireSupabase()
        .from('menu_items')
        .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
        .eq('active', true)
        .order('sort_order');

      if (error || !items) throw new Error(error?.message ?? 'No data');
      return await this.assembleItems(items as MenuItemRow[]);
    } catch {
      return localFallback.getAllMenuItems();
    }
  }

  async getMenuItemsByCategorySlug(slug: string): Promise<MenuItemWithRelations[]> {
    try {
      const { data: cat, error: catError } = await requireSupabase()
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (catError) throw new Error(catError.message);
      if (!cat) return [];

      const { data: items, error } = await requireSupabase()
        .from('menu_items')
        .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
        .eq('category_id', cat.id)
        .eq('active', true)
        .order('sort_order');

      if (error || !items) throw new Error(error?.message ?? 'No data');
      return await this.assembleItems(items as MenuItemRow[]);
    } catch {
      return localFallback.getMenuItemsByCategorySlug(slug);
    }
  }

  async getMenuItemBySlug(slug: string): Promise<MenuItemWithRelations | null> {
    try {
      const { data: item, error } = await requireSupabase()
        .from('menu_items')
        .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!item) return null;
      const assembled = await this.assembleItems([item as MenuItemRow]);
      return assembled[0] ?? null;
    } catch {
      return localFallback.getMenuItemBySlug(slug);
    }
  }

  async getFullMenu(): Promise<CategoryWithItems[]> {
    try {
      const { data: cats, error: catError } = await requireSupabase()
        .from('categories')
        .select('id, name, slug, sort_order, active')
        .eq('active', true)
        .order('sort_order');

      if (catError || !cats) throw new Error(catError?.message ?? 'No data');

      const { data: items, error: itemError } = await requireSupabase()
        .from('menu_items')
        .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
        .eq('active', true)
        .order('sort_order');

      if (itemError || !items) throw new Error(itemError?.message ?? 'No data');

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
    } catch {
      return localFallback.getFullMenu();
    }
  }

  async searchMenuItems(query: string): Promise<MenuItemWithRelations[]> {
    const q = query.trim();
    if (!q) return [];

    try {
      const { data: items, error } = await requireSupabase()
        .from('menu_items')
        .select('id, category_id, name, slug, description, price, image_url, active, sort_order')
        .eq('active', true)
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .order('sort_order');

      if (error || !items) throw new Error(error?.message ?? 'No data');

      const itemIds = (items as MenuItemRow[]).map((i) => i.id);
      const relations = await this.fetchRelations(itemIds);

      return (items as MenuItemRow[]).map((item) => this.assembleSingle(item, relations));
    } catch {
      return localFallback.searchMenuItems(query);
    }
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

    const [
      { data: servings },
      { data: nutrition },
      { data: micronutrients },
      { data: ingredients },
      { data: dietaryTags },
      { data: allergens },
      { data: categories },
    ] = await Promise.all([
      requireSupabase().from('servings').select('*').in('menu_item_id', itemIds).order('sort_order'),
      requireSupabase().from('nutrition').select('*').in('menu_item_id', itemIds),
      requireSupabase().from('micronutrients').select('*').in('menu_item_id', itemIds),
      requireSupabase().from('ingredients').select('*').in('menu_item_id', itemIds).order('sort_order'),
      requireSupabase().from('dietary_tags').select('*').in('menu_item_id', itemIds),
      requireSupabase().from('allergens').select('*').in('menu_item_id', itemIds),
      requireSupabase().from('categories').select('id, name, slug, sort_order, active'),
    ]);

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

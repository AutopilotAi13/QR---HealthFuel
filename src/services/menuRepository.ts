import type {
  Category,
  CategoryWithItems,
  MenuItemWithRelations,
} from '@/types/menu';
import {
  allergens,
  categories,
  dietaryTags,
  ingredients,
  menuItems,
  micronutrients,
  nutrition,
  servings,
} from '@/data/mockData';
import { SupabaseMenuRepository } from '@/services/supabaseMenuRepository';

// ──────────────────────────────────────────────────────────────
// Menu Repository — Data Provider Interface
//
// This interface defines the contract between the application
// and its data source. The local implementation reads from
// in-memory mock data. When Supabase is connected, a new
// SupabaseMenuRepository class implementing this same interface
// replaces the local one — no service or UI code changes.
//
// NUTRITION VALUES IN THE LOCAL DATA ARE MOCK V1 PLACEHOLDERS.
// They are realistic estimates, not verified values, and will
// be replaced with calculated data from the nutrition database.
// ──────────────────────────────────────────────────────────────

export interface MenuRepository {
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getAllMenuItems(): Promise<MenuItemWithRelations[]>;
  getMenuItemsByCategorySlug(slug: string): Promise<MenuItemWithRelations[]>;
  getMenuItemBySlug(slug: string): Promise<MenuItemWithRelations | null>;
  getFullMenu(): Promise<CategoryWithItems[]>;
  searchMenuItems(query: string): Promise<MenuItemWithRelations[]>;
}

// ──────────────────────────────────────────────────────────────
// Local Implementation — reads from in-memory mock data
// ──────────────────────────────────────────────────────────────

const delay = (ms: number = 300) => new Promise((r) => setTimeout(r, ms));

function assembleMenuItem(item: (typeof menuItems)[number]): MenuItemWithRelations {
  const category = categories.find((c) => c.id === item.category_id);
  const itemServings = servings
    .filter((s) => s.menu_item_id === item.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const itemNutrition = nutrition.filter((n) => n.menu_item_id === item.id);
  const itemMicros = micronutrients.filter((m) => m.menu_item_id === item.id);
  const itemIngredients = ingredients
    .filter((i) => i.menu_item_id === item.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const itemDietary = dietaryTags.filter((d) => d.menu_item_id === item.id);
  const itemAllergens = allergens.filter((a) => a.menu_item_id === item.id);

  return {
    ...item,
    category,
    servings: itemServings,
    nutrition: itemNutrition,
    micronutrients: itemMicros,
    ingredients: itemIngredients,
    dietary_tags: itemDietary,
    allergens: itemAllergens,
  };
}

export class LocalMenuRepository implements MenuRepository {
  async getAllCategories(): Promise<Category[]> {
    await delay(100);
    return categories
      .filter((c) => c.active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(100);
    return categories.find((c) => c.slug === slug && c.active) ?? null;
  }

  async getAllMenuItems(): Promise<MenuItemWithRelations[]> {
    await delay(200);
    return menuItems
      .filter((m) => m.active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(assembleMenuItem);
  }

  async getMenuItemsByCategorySlug(slug: string): Promise<MenuItemWithRelations[]> {
    await delay(200);
    const cat = categories.find((c) => c.slug === slug && c.active);
    if (!cat) return [];
    return menuItems
      .filter((m) => m.category_id === cat.id && m.active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(assembleMenuItem);
  }

  async getMenuItemBySlug(slug: string): Promise<MenuItemWithRelations | null> {
    await delay(200);
    const item = menuItems.find((m) => m.slug === slug && m.active);
    if (!item) return null;
    return assembleMenuItem(item);
  }

  async getFullMenu(): Promise<CategoryWithItems[]> {
    await delay(300);
    const cats = categories
      .filter((c) => c.active)
      .sort((a, b) => a.sort_order - b.sort_order);
    return cats.map((cat) => ({
      ...cat,
      items: menuItems
        .filter((m) => m.category_id === cat.id && m.active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(assembleMenuItem),
    }));
  }

  async searchMenuItems(query: string): Promise<MenuItemWithRelations[]> {
    await delay(150);
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return menuItems
      .filter((m) => m.active)
      .map((m) => {
        const cat = categories.find((c) => c.id === m.category_id);
        return {
          item: m,
          catName: cat?.name.toLowerCase() ?? '',
        };
      })
      .filter(
        ({ item, catName }) =>
          item.name.toLowerCase().includes(q) ||
          (item.description?.toLowerCase().includes(q) ?? false) ||
          catName.includes(q),
      )
      .map(({ item }) => assembleMenuItem(item));
  }
}

// ──────────────────────────────────────────────────────────────
// Active provider — swap this single line to switch to Supabase
// ──────────────────────────────────────────────────────────────

export const menuRepository: MenuRepository = new SupabaseMenuRepository();

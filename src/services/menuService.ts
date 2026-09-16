import type {
  Category,
  CategoryWithItems,
  ComputedMicronutrient,
  ComputedNutrition,
  MenuItemWithRelations,
  Serving,
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

// ──────────────────────────────────────────────────────────────
// Menu Service — Data Access Layer
//
// This module is the single point of contact between the UI
// and the data source. Today it reads from local mock data.
// When Supabase is connected, only the function bodies change
// to use Supabase queries — the function signatures and return
// types stay identical, so no UI code needs to change.
// ──────────────────────────────────────────────────────────────

// Simulate async latency for realistic loading states
const delay = (ms: number = 300) => new Promise((r) => setTimeout(r, ms));

export async function getAllCategories(): Promise<Category[]> {
  await delay(100);
  return categories
    .filter((c) => c.active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(100);
  return categories.find((c) => c.slug === slug && c.active) ?? null;
}

export async function getAllMenuItems(): Promise<MenuItemWithRelations[]> {
  await delay(200);
  return menuItems
    .filter((m) => m.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(assembleMenuItem);
}

export async function getMenuItemsByCategorySlug(
  slug: string,
): Promise<MenuItemWithRelations[]> {
  await delay(200);
  const cat = categories.find((c) => c.slug === slug && c.active);
  if (!cat) return [];
  return menuItems
    .filter((m) => m.category_id === cat.id && m.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(assembleMenuItem);
}

export async function getMenuItemBySlug(
  slug: string,
): Promise<MenuItemWithRelations | null> {
  await delay(200);
  const item = menuItems.find((m) => m.slug === slug && m.active);
  if (!item) return null;
  return assembleMenuItem(item);
}

export async function getFullMenu(): Promise<CategoryWithItems[]> {
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

export async function searchMenuItems(
  query: string,
): Promise<MenuItemWithRelations[]> {
  await delay(150);
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return menuItems
    .filter(
      (m) =>
        m.active &&
        (m.name.toLowerCase().includes(q) ||
          (m.description?.toLowerCase().includes(q) ?? false)),
    )
    .map(assembleMenuItem);
}

// ── Helpers ──────────────────────────────────────────────────

function assembleMenuItem(item: (typeof menuItems)[number]): MenuItemWithRelations {
  const category = categories.find((c) => c.id === item.category_id);
  const itemServings = servings
    .filter((s) => s.menu_item_id === item.id)
    .sort((a, b) => a.multiplier - b.multiplier);
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

// ── Nutrition computation ─────────────────────────────────────

export function computeNutrition(
  item: MenuItemWithRelations,
  serving: Serving,
): ComputedNutrition {
  const base = item.nutrition.find((n) => n.serving_id === serving.id);
  if (!base) {
    // Fallback: find any nutrition record and scale by multiplier
    const any = item.nutrition[0];
    if (!any) {
      return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
    }
    return scaleNutrition(any, serving.multiplier / 1);
  }
  return scaleNutrition(base, 1);
}

function scaleNutrition(
  n: ComputedNutrition & { id?: string; menu_item_id?: string; serving_id?: string },
  multiplier: number,
): ComputedNutrition {
  return {
    calories: Math.round(n.calories * multiplier),
    protein: Math.round(n.protein * multiplier),
    carbohydrates: Math.round(n.carbohydrates * multiplier),
    fat: Math.round(n.fat * multiplier),
    fiber: Math.round(n.fiber * multiplier),
    sugar: Math.round(n.sugar * multiplier),
    sodium: Math.round(n.sodium * multiplier),
  };
}

export function computeMicronutrients(
  item: MenuItemWithRelations,
  serving: Serving,
): ComputedMicronutrient[] {
  const base = item.micronutrients.filter((m) => m.serving_id === serving.id);
  if (base.length === 0) return [];
  return base.map((m) => ({
    nutrient_name: m.nutrient_name,
    amount: Math.round(m.amount * serving.multiplier * 10) / 10,
    unit: m.unit,
  }));
}

export function getDefaultServing(item: MenuItemWithRelations): Serving {
  return item.servings[0];
}

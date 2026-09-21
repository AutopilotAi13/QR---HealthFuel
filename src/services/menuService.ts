import type {
  ComputedMicronutrient,
  ComputedNutrition,
  MenuItemWithRelations,
  Serving,
} from '@/types/menu';
import { menuRepository } from '@/services/menuRepository';

// ──────────────────────────────────────────────────────────────
// Menu Service — Public API
//
// This module is the single point of contact between the UI and
// the data source. It delegates all data operations to the
// active MenuRepository implementation (currently local mock data).
//
// When Supabase is connected, only the repository provider in
// menuRepository.ts changes — this service and all UI components
// stay exactly as they are.
//
// NUTRITION VALUES IN THE LOCAL DATA ARE MOCK V1 PLACEHOLDERS.
// ──────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return menuRepository.getAllCategories();
}

export async function getCategoryBySlug(slug: string) {
  return menuRepository.getCategoryBySlug(slug);
}

export async function getAllMenuItems() {
  return menuRepository.getAllMenuItems();
}

export async function getMenuItemsByCategorySlug(slug: string) {
  return menuRepository.getMenuItemsByCategorySlug(slug);
}

export async function getMenuItemBySlug(slug: string) {
  return menuRepository.getMenuItemBySlug(slug);
}

export async function getFullMenu() {
  return menuRepository.getFullMenu();
}

export async function searchMenuItems(query: string) {
  return menuRepository.searchMenuItems(query);
}

// ── Nutrition computation ─────────────────────────────────────
// These are pure functions that operate on the assembled
// MenuItemWithRelations. They do not depend on the data source.

export function computeNutrition(
  item: MenuItemWithRelations,
  serving: Serving,
): ComputedNutrition {
  const base = item.nutrition.find((n) => n.serving_id === serving.id);
  if (!base) {
    const any = item.nutrition[0];
    if (!any) {
      return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
    }
    return scaleNutrition(any, serving.multiplier);
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

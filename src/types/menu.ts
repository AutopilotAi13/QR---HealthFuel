import logoAsset from '@/assets/Logo_Health_Fuel.jpg';

// ──────────────────────────────────────────────────────────────
// Health Fuel — Domain Types
// These interfaces mirror the Supabase schema 1:1 so the UI
// can switch from mock data to live Supabase queries without
// any restructuring. Every field name matches its DB column.
// ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  published?: boolean;
  draft_data?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface Serving {
  id: string;
  menu_item_id: string;
  name: string;
  multiplier: number;
  price: number | null;
  sort_order: number;
}

export interface Nutrition {
  id: string;
  menu_item_id: string;
  serving_id: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  is_mock?: boolean;
}

export interface Micronutrient {
  id: string;
  menu_item_id: string;
  serving_id: string;
  nutrient_name: string;
  amount: number;
  unit: string;
}

export interface Ingredient {
  id: string;
  menu_item_id: string;
  ingredient_name: string;
  sort_order: number;
}

export interface DietaryTag {
  id: string;
  menu_item_id: string;
  tag: string;
}

export interface Allergen {
  id: string;
  menu_item_id: string;
  allergen: string;
}

// ──────────────────────────────────────────────────────────────
// Composite types — convenience aggregates built from the
// raw table rows. The data service assembles these; the UI only
// ever consumes them.
// ──────────────────────────────────────────────────────────────

export interface MenuItemWithRelations extends MenuItem {
  category?: Category;
  servings: Serving[];
  nutrition: Nutrition[];
  micronutrients: Micronutrient[];
  ingredients: Ingredient[];
  dietary_tags: DietaryTag[];
  allergens: Allergen[];
}

export interface CategoryWithItems extends Category {
  items: MenuItemWithRelations[];
}

// Computed nutrition for a specific serving selection
export interface ComputedNutrition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface ComputedMicronutrient {
  nutrient_name: string;
  amount: number;
  unit: string;
}

export interface Settings {
  id: number;
  brand_name: string;
  tagline: string;
  currency: string;
  oil_statement: string;
  nutrition_disclaimer: string;
  nutrition_last_updated: string;
  updated_at?: string;
}

// Brand constant — fallback values, overridden by Supabase settings at runtime
export const BRAND = {
  name: 'Health Fuel',
  tagline: 'CURATED NUTRITION. CRAFTED FRESH.',
  logoUrl: logoAsset,
  bottomNote: 'Prepared exclusively with Olive & Coconut Oil',
  nutritionDisclaimer:
    'Nutrition values are estimates based on the current recipe and serving size and may vary.',
  lastUpdated: 'September 2026',
} as const;

import type {
  Category,
  CategoryWithItems,
  MenuItemWithRelations,
} from '@/types/menu';
import { SupabaseMenuRepository } from '@/services/supabaseMenuRepository';

// ──────────────────────────────────────────────────────────────
// Menu Repository — Data Provider Interface
//
// This interface defines the contract between the application
// and its data source. The active implementation (SupabaseMenuRepository)
// reads from Supabase with automatic fallback to LocalMenuRepository.
//
// NUTRITION VALUES IN THE LOCAL DATA ARE MOCK V1 PLACEHOLDERS.
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

export { LocalMenuRepository } from '@/services/localMenuRepository';

// ──────────────────────────────────────────────────────────────
// Active provider — Supabase with local fallback
// ──────────────────────────────────────────────────────────────

export const menuRepository: MenuRepository = new SupabaseMenuRepository();

/*
# Admin CMS Schema — Draft/Publish, Settings, Admin RLS

## Changes

1. Draft/Publish system:
   - menu_items: add `published` boolean (default true), `draft_data` jsonb (nullable)
   - categories: add `published` boolean (default true)
   - When published=false, customer RLS hides the row

2. Settings table:
   - Singleton key-value store for brand settings

3. Admin authorization:
   - is_admin() checks auth.users.raw_app_meta_data for role='admin'
   - Admin RLS policies: full CRUD on all tables when is_admin()
   - Customer RLS: SELECT only, active=true AND published=true
*/

-- ── is_admin() helper function ──────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth
AS $$
  SELECT COALESCE(
    (SELECT (raw_app_meta_data->>'role') = 'admin'
     FROM auth.users
     WHERE id = auth.uid()),
    false
  )
$$;

-- ── Add published columns ────────────────────────────────────
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

-- ── Add draft_data jsonb for menu_items ──────────────────────
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS draft_data jsonb;

-- ── Settings table (singleton) ──────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  brand_name text NOT NULL DEFAULT 'Health Fuel',
  tagline text NOT NULL DEFAULT 'CURATED NUTRITION. CRAFTED FRESH.',
  currency text NOT NULL DEFAULT '₹',
  oil_statement text NOT NULL DEFAULT 'Prepared exclusively with Olive & Coconut Oil',
  nutrition_disclaimer text NOT NULL DEFAULT 'Nutrition values are estimates based on the current recipe and serving size and may vary.',
  nutrition_last_updated text NOT NULL DEFAULT 'September 2026',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT settings_singleton CHECK (id = 1)
);

INSERT INTO settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

-- ── Index for published columns ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_menu_items_published ON menu_items(published);
CREATE INDEX IF NOT EXISTS idx_categories_published ON categories(published);

-- ── RLS for settings ─────────────────────────────────────────
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customer_read_settings" ON settings;
CREATE POLICY "customer_read_settings"
  ON settings FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_all_settings" ON settings;
CREATE POLICY "admin_all_settings"
  ON settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Update existing customer SELECT policies to check published ──
DROP POLICY IF EXISTS "customer_read_active_categories" ON categories;
CREATE POLICY "customer_read_active_categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (active = true AND published = true);

DROP POLICY IF EXISTS "customer_read_active_menu_items" ON menu_items;
CREATE POLICY "customer_read_menu_items" ON menu_items
  FOR SELECT TO anon, authenticated
  USING (
    active = true
    AND published = true
    AND EXISTS (SELECT 1 FROM categories c WHERE c.id = menu_items.category_id AND c.active = true AND c.published = true)
  );

-- ── Admin RLS policies: full CRUD on all tables ──────────────
DROP POLICY IF EXISTS "admin_all_categories" ON categories;
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_menu_items" ON menu_items;
CREATE POLICY "admin_all_menu_items"
  ON menu_items FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_servings" ON servings;
CREATE POLICY "admin_all_servings"
  ON servings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_nutrition" ON nutrition;
CREATE POLICY "admin_all_nutrition"
  ON nutrition FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_micronutrients" ON micronutrients;
CREATE POLICY "admin_all_micronutrients"
  ON micronutrients FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_ingredients" ON ingredients;
CREATE POLICY "admin_all_ingredients"
  ON ingredients FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_dietary_tags" ON dietary_tags;
CREATE POLICY "admin_all_dietary_tags"
  ON dietary_tags FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_allergens" ON allergens;
CREATE POLICY "admin_all_allergens"
  ON allergens FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

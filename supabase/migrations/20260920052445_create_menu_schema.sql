/*
# Health Fuel Menu Schema

Creates the full production schema for the Health Fuel nutrition menu app.

## 1. New Tables

- **categories**: Top-level menu categories (Meals, Salads, etc.)
  - id (uuid PK), name, slug (unique), sort_order, active, created_at, updated_at
- **menu_items**: Individual menu items belonging to a category
  - id (uuid PK), category_id (FK → categories), name, slug (unique), description, price, image_url, active, sort_order, created_at, updated_at
- **servings**: Serving size options for a menu item (e.g. One Serving, Two Servings)
  - id (uuid PK), menu_item_id (FK → menu_items), name, multiplier, price (nullable), sort_order, created_at
- **nutrition**: Per-serving macro nutrition values (calories, protein, etc.)
  - id (uuid PK), menu_item_id (FK), serving_id (FK → servings), calories, protein, carbohydrates, fat, fiber, sugar, sodium, is_mock (boolean flag for placeholder data)
- **micronutrients**: Per-serving micro nutrition (vitamins, minerals)
  - id (uuid PK), menu_item_id (FK), serving_id (FK), nutrient_name, amount, unit
- **ingredients**: Ordered ingredient list per menu item
  - id (uuid PK), menu_item_id (FK), ingredient_name, sort_order
- **dietary_tags**: Dietary labels per menu item (Vegan, High Protein, etc.)
  - id (uuid PK), menu_item_id (FK), tag
- **allergens**: Allergen warnings per menu item (Dairy, Gluten, etc.)
  - id (uuid PK), menu_item_id (FK), allergen

## 2. Indexes

- categories: slug, active
- menu_items: slug, category_id, active
- servings: menu_item_id
- nutrition: menu_item_id, serving_id
- micronutrients: menu_item_id, serving_id
- ingredients: menu_item_id
- dietary_tags: menu_item_id
- allergens: menu_item_id

## 3. Security (Row Level Security)

- RLS enabled on ALL tables.
- Customer-facing reads (SELECT): allowed for anon + authenticated, but ONLY for active categories and active menu items. Child rows (servings, nutrition, etc.) are visible only if their parent menu_item is active.
- No write access (INSERT/UPDATE/DELETE) for anon or authenticated — admin write access will be added in a later phase with authenticated admin policies.

## 4. Important Notes

- All primary keys use UUID with gen_random_uuid() default.
- Foreign keys have ON DELETE CASCADE so deleting a parent removes children.
- is_mock boolean on nutrition marks placeholder V1 data — will be set to true for all migrated nutrition rows.
- No user_id columns — this is a single-tenant customer-facing app with no sign-in.
- updated_at trigger auto-updates on row change (categories, menu_items).
*/

-- ── Extensions ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── updated_at trigger function ───────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── Categories ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Menu Items ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(active);

DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON menu_items;
CREATE TRIGGER trg_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Servings ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS servings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  multiplier numeric(4, 2) NOT NULL DEFAULT 1.0,
  price numeric(10, 2),
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_servings_menu_item_id ON servings(menu_item_id);

-- ── Nutrition ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  serving_id uuid NOT NULL REFERENCES servings(id) ON DELETE CASCADE,
  calories integer NOT NULL DEFAULT 0,
  protein integer NOT NULL DEFAULT 0,
  carbohydrates integer NOT NULL DEFAULT 0,
  fat integer NOT NULL DEFAULT 0,
  fiber integer NOT NULL DEFAULT 0,
  sugar integer NOT NULL DEFAULT 0,
  sodium integer NOT NULL DEFAULT 0,
  is_mock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nutrition_menu_item_id ON nutrition(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_serving_id ON nutrition(serving_id);

-- ── Micronutrients ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS micronutrients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  serving_id uuid NOT NULL REFERENCES servings(id) ON DELETE CASCADE,
  nutrient_name text NOT NULL,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  unit text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_micronutrients_menu_item_id ON micronutrients(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_micronutrients_serving_id ON micronutrients(serving_id);

-- ── Ingredients ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_menu_item_id ON ingredients(menu_item_id);

-- ── Dietary Tags ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dietary_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dietary_tags_menu_item_id ON dietary_tags(menu_item_id);

-- ── Allergens ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allergens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_allergens_menu_item_id ON allergens(menu_item_id);

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE servings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE micronutrients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;

-- ── Categories: only active categories are visible to customers ──
DROP POLICY IF EXISTS "customer_read_active_categories" ON categories;
CREATE POLICY "customer_read_active_categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- ── Menu items: only active items in active categories ──
DROP POLICY IF EXISTS "customer_read_active_menu_items" ON menu_items;
CREATE POLICY "customer_read_active_menu_items"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM categories c
      WHERE c.id = menu_items.category_id AND c.active = true
    )
  );

-- ── Servings: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_servings" ON servings;
CREATE POLICY "customer_read_servings"
  ON servings FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = servings.menu_item_id AND m.active = true
    )
  );

-- ── Nutrition: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_nutrition" ON nutrition;
CREATE POLICY "customer_read_nutrition"
  ON nutrition FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = nutrition.menu_item_id AND m.active = true
    )
  );

-- ── Micronutrients: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_micronutrients" ON micronutrients;
CREATE POLICY "customer_read_micronutrients"
  ON micronutrients FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = micronutrients.menu_item_id AND m.active = true
    )
  );

-- ── Ingredients: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_ingredients" ON ingredients;
CREATE POLICY "customer_read_ingredients"
  ON ingredients FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = ingredients.menu_item_id AND m.active = true
    )
  );

-- ── Dietary tags: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_dietary_tags" ON dietary_tags;
CREATE POLICY "customer_read_dietary_tags"
  ON dietary_tags FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = dietary_tags.menu_item_id AND m.active = true
    )
  );

-- ── Allergens: visible only if parent menu_item is active ──
DROP POLICY IF EXISTS "customer_read_allergens" ON allergens;
CREATE POLICY "customer_read_allergens"
  ON allergens FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_items m
      WHERE m.id = allergens.menu_item_id AND m.active = true
    )
  );

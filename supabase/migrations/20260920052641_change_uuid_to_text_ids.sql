/*
# Change primary key types from uuid to text

The existing Health Fuel menu data uses string-based IDs (e.g. 'cat-meals',
'mi-001', 'srv-010a'). This migration changes all PK and FK columns
from uuid to text so the existing data can be inserted without ID remapping.

## Changes
- All 8 tables: id column changed from uuid to text
- All FK columns: uuid → text
- Removed gen_random_uuid() defaults
*/

-- Drop the updated_at triggers temporarily (will recreate after)
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON menu_items;

-- Drop RLS policies temporarily (will recreate)
DROP POLICY IF EXISTS "customer_read_active_categories" ON categories;
DROP POLICY IF EXISTS "customer_read_active_menu_items" ON menu_items;
DROP POLICY IF EXISTS "customer_read_servings" ON servings;
DROP POLICY IF EXISTS "customer_read_nutrition" ON nutrition;
DROP POLICY IF EXISTS "customer_read_micronutrients" ON micronutrients;
DROP POLICY IF EXISTS "customer_read_ingredients" ON ingredients;
DROP POLICY IF EXISTS "customer_read_dietary_tags" ON dietary_tags;
DROP POLICY IF EXISTS "customer_read_allergens" ON allergens;

-- Disable RLS to alter columns
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE servings DISABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition DISABLE ROW LEVEL SECURITY;
ALTER TABLE micronutrients DISABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE allergens DISABLE ROW LEVEL SECURITY;

-- Drop foreign key constraints (they reference uuid columns)
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_id_fkey;
ALTER TABLE servings DROP CONSTRAINT IF EXISTS servings_menu_item_id_fkey;
ALTER TABLE nutrition DROP CONSTRAINT IF EXISTS nutrition_menu_item_id_fkey;
ALTER TABLE nutrition DROP CONSTRAINT IF EXISTS nutrition_serving_id_fkey;
ALTER TABLE micronutrients DROP CONSTRAINT IF EXISTS micronutrients_menu_item_id_fkey;
ALTER TABLE micronutrients DROP CONSTRAINT IF EXISTS micronutrients_serving_id_fkey;
ALTER TABLE ingredients DROP CONSTRAINT IF EXISTS ingredients_menu_item_id_fkey;
ALTER TABLE dietary_tags DROP CONSTRAINT IF EXISTS dietary_tags_menu_item_id_fkey;
ALTER TABLE allergens DROP CONSTRAINT IF EXISTS allergens_menu_item_id_fkey;

-- Alter id columns from uuid to text
ALTER TABLE categories ALTER COLUMN id TYPE text;
ALTER TABLE categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE menu_items ALTER COLUMN id TYPE text;
ALTER TABLE menu_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE servings ALTER COLUMN id TYPE text;
ALTER TABLE servings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE nutrition ALTER COLUMN id TYPE text;
ALTER TABLE nutrition ALTER COLUMN id DROP DEFAULT;
ALTER TABLE micronutrients ALTER COLUMN id TYPE text;
ALTER TABLE micronutrients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE ingredients ALTER COLUMN id TYPE text;
ALTER TABLE ingredients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE dietary_tags ALTER COLUMN id TYPE text;
ALTER TABLE dietary_tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE allergens ALTER COLUMN id TYPE text;
ALTER TABLE allergens ALTER COLUMN id DROP DEFAULT;

-- Alter FK columns from uuid to text
ALTER TABLE menu_items ALTER COLUMN category_id TYPE text;
ALTER TABLE servings ALTER COLUMN menu_item_id TYPE text;
ALTER TABLE nutrition ALTER COLUMN menu_item_id TYPE text;
ALTER TABLE nutrition ALTER COLUMN serving_id TYPE text;
ALTER TABLE micronutrients ALTER COLUMN menu_item_id TYPE text;
ALTER TABLE micronutrients ALTER COLUMN serving_id TYPE text;
ALTER TABLE ingredients ALTER COLUMN menu_item_id TYPE text;
ALTER TABLE dietary_tags ALTER COLUMN menu_item_id TYPE text;
ALTER TABLE allergens ALTER COLUMN menu_item_id TYPE text;

-- Recreate foreign key constraints
ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
ALTER TABLE servings ADD CONSTRAINT servings_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE nutrition ADD CONSTRAINT nutrition_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE nutrition ADD CONSTRAINT nutrition_serving_id_fkey
  FOREIGN KEY (serving_id) REFERENCES servings(id) ON DELETE CASCADE;
ALTER TABLE micronutrients ADD CONSTRAINT micronutrients_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE micronutrients ADD CONSTRAINT micronutrients_serving_id_fkey
  FOREIGN KEY (serving_id) REFERENCES servings(id) ON DELETE CASCADE;
ALTER TABLE ingredients ADD CONSTRAINT ingredients_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE dietary_tags ADD CONSTRAINT dietary_tags_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE allergens ADD CONSTRAINT allergens_menu_item_id_fkey
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;

-- Recreate updated_at triggers
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Re-enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE servings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE micronutrients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "customer_read_active_categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "customer_read_active_menu_items"
  ON menu_items FOR SELECT TO anon, authenticated
  USING (
    active = true
    AND EXISTS (SELECT 1 FROM categories c WHERE c.id = menu_items.category_id AND c.active = true)
  );

CREATE POLICY "customer_read_servings"
  ON servings FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = servings.menu_item_id AND m.active = true));

CREATE POLICY "customer_read_nutrition"
  ON nutrition FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = nutrition.menu_item_id AND m.active = true));

CREATE POLICY "customer_read_micronutrients"
  ON micronutrients FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = micronutrients.menu_item_id AND m.active = true));

CREATE POLICY "customer_read_ingredients"
  ON ingredients FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = ingredients.menu_item_id AND m.active = true));

CREATE POLICY "customer_read_dietary_tags"
  ON dietary_tags FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = dietary_tags.menu_item_id AND m.active = true));

CREATE POLICY "customer_read_allergens"
  ON allergens FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM menu_items m WHERE m.id = allergens.menu_item_id AND m.active = true));

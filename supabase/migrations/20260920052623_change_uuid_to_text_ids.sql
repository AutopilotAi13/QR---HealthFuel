/*
# Change primary key types from uuid to text

The existing Health Fuel menu data uses string-based IDs (e.g. 'cat-meals',
'mi-001', 'srv-010a'). The schema was created with uuid PKs, which cannot
accept these string values. This migration changes all PK and FK columns
from uuid to text so the existing data can be inserted without ID remapping.

## Changes

- All 8 tables: id column changed from uuid to text
- menu_items.category_id: uuid → text
- servings.menu_item_id: uuid → text
- nutrition.menu_item_id, serving_id: uuid → text
- micronutrients.menu_item_id, serving_id: uuid → text
- ingredients.menu_item_id: uuid → text
- dietary_tags.menu_item_id: uuid → text
- allergens.menu_item_id: uuid → text
- Removed gen_random_uuid() defaults (text PKs use explicit IDs)
- Removed pgcrypto extension (no longer needed for gen_random_uuid)

## Security

- RLS policies unchanged — they reference columns by name, not type.
- All policies still enforce active-only reads for customer-facing data.
*/

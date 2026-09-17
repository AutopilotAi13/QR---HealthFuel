import type {
  Category,
  MenuItem,
  Serving,
  Nutrition,
  Micronutrient,
  Ingredient,
  DietaryTag,
  Allergen,
} from '@/types/menu';

// ──────────────────────────────────────────────────────────────
// MOCK DATA — Health Fuel Menu
//
// This data is structured to mirror exactly what Supabase will
// return. When the database is connected, these arrays will be
// replaced by fetch() calls to Supabase; the interfaces stay
// the same.
//
// NUTRITION VALUES ARE PLACEHOLDERS — they are realistic
// estimates and will be replaced with calculated/verified
// values from the nutrition database.
// ──────────────────────────────────────────────────────────────

// ── Categories ────────────────────────────────────────────────

export const categories: Category[] = [
  { id: 'cat-meals', name: 'Meals', slug: 'meals', sort_order: 1, active: true },
  { id: 'cat-salads', name: 'Salads', slug: 'salads', sort_order: 2, active: true },
  { id: 'cat-protein-bowls', name: 'Protein Bowls', slug: 'protein-bowls', sort_order: 3, active: true },
  { id: 'cat-sprout-bowls', name: 'Sprout Bowls', slug: 'sprout-bowls', sort_order: 4, active: true },
  { id: 'cat-protein-sandwiches', name: 'Protein Sandwiches', slug: 'protein-sandwiches', sort_order: 5, active: true },
  { id: 'cat-smoothies', name: 'Smoothies', slug: 'smoothies', sort_order: 6, active: true },
  { id: 'cat-corn', name: 'Corn', slug: 'corn', sort_order: 7, active: true },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', sort_order: 8, active: true },
  { id: 'cat-dessert-bar', name: 'No-Bake Dessert Bar', slug: 'no-bake-dessert-bar', sort_order: 9, active: true },
  { id: 'cat-detox-shots', name: 'Detox Shots', slug: 'detox-shots', sort_order: 10, active: true },
];

// ── Menu Items ────────────────────────────────────────────────
// Only the five items below have descriptions. All others are null.

export const menuItems: MenuItem[] = [
  // Meals
  { id: 'mi-001', category_id: 'cat-meals', name: 'Corn Cheese Wrap', slug: 'corn-cheese-wrap', description: null, price: 110, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-002', category_id: 'cat-meals', name: 'Egg Roll', slug: 'egg-roll', description: null, price: 90, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-003', category_id: 'cat-meals', name: 'Hummus Bowl', slug: 'hummus-bowl', description: 'Tahini • Paneer • Fresh Greens', price: 210, image_url: null, active: true, sort_order: 3 },
  { id: 'mi-004', category_id: 'cat-meals', name: 'Falafel', slug: 'falafel', description: null, price: 120, image_url: null, active: true, sort_order: 4 },
  { id: 'mi-005', category_id: 'cat-meals', name: 'Peri peri Paneer Steak', slug: 'peri-peri-paneer-steak', description: null, price: 160, image_url: null, active: true, sort_order: 5 },
  { id: 'mi-006', category_id: 'cat-meals', name: 'Fattoush Plate', slug: 'fattoush-plate', description: 'Hummus • Lettuce • Sesame', price: 250, image_url: null, active: true, sort_order: 6 },
  { id: 'mi-007', category_id: 'cat-meals', name: 'Paneer Cheese Roll', slug: 'paneer-cheese-roll', description: null, price: 150, image_url: null, active: true, sort_order: 7 },

  // Salads
  { id: 'mi-010', category_id: 'cat-salads', name: 'Paneer Corn Salad', slug: 'paneer-corn-salad', description: null, price: 130, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-011', category_id: 'cat-salads', name: 'Chimichurri Chickpeas Salad', slug: 'chimichurri-chickpeas-salad', description: null, price: 160, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-012', category_id: 'cat-salads', name: 'Mediterranean Salad', slug: 'mediterranean-salad', description: 'Walnut • Zest • Fresh Greens', price: 140, image_url: null, active: true, sort_order: 3 },
  { id: 'mi-013', category_id: 'cat-salads', name: 'Crispy and Creamy Chickpeas Salad', slug: 'crispy-and-creamy-chickpeas-salad', description: 'Avocado • Lettuce • Tahini', price: 190, image_url: null, active: true, sort_order: 4 },

  // Protein Bowls
  { id: 'mi-020', category_id: 'cat-protein-bowls', name: 'Signature Bowl', slug: 'signature-bowl', description: 'Lettuce • Chickpea • Paneer', price: 210, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-021', category_id: 'cat-protein-bowls', name: 'Lettuce Bowl', slug: 'lettuce-bowl', description: null, price: 170, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-022', category_id: 'cat-protein-bowls', name: 'Quinoa Bowl', slug: 'quinoa-bowl', description: null, price: 160, image_url: null, active: true, sort_order: 3 },
  { id: 'mi-023', category_id: 'cat-protein-bowls', name: 'Oatmeal', slug: 'oatmeal', description: null, price: 100, image_url: null, active: true, sort_order: 4 },

  // Sprout Bowls
  { id: 'mi-030', category_id: 'cat-sprout-bowls', name: 'Ragi Sprouts', slug: 'ragi-sprouts', description: null, price: 90, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-031', category_id: 'cat-sprout-bowls', name: 'Black Pea Sprouts', slug: 'black-pea-sprouts', description: null, price: 90, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-032', category_id: 'cat-sprout-bowls', name: 'Mung Bean Sprouts', slug: 'mung-bean-sprouts', description: null, price: 90, image_url: null, active: true, sort_order: 3 },

  // Protein Sandwiches
  { id: 'mi-040', category_id: 'cat-protein-sandwiches', name: 'Peri Peri Paneer', slug: 'peri-peri-paneer', description: null, price: 80, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-041', category_id: 'cat-protein-sandwiches', name: 'Greek Sandwich', slug: 'greek-sandwich', description: null, price: 110, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-042', category_id: 'cat-protein-sandwiches', name: 'Poached Sandwich', slug: 'poached-sandwich', description: null, price: 100, image_url: null, active: true, sort_order: 3 },
  { id: 'mi-043', category_id: 'cat-protein-sandwiches', name: 'Cheese Omelette', slug: 'cheese-omelette', description: null, price: 70, image_url: null, active: true, sort_order: 4 },

  // Smoothies
  { id: 'mi-050', category_id: 'cat-smoothies', name: 'Dry Fruits', slug: 'dry-fruits', description: null, price: 80, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-051', category_id: 'cat-smoothies', name: 'Curd Protein', slug: 'curd-protein', description: null, price: 80, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-052', category_id: 'cat-smoothies', name: 'Berry Yogurt', slug: 'berry-yogurt', description: null, price: 80, image_url: null, active: true, sort_order: 3 },
  { id: 'mi-053', category_id: 'cat-smoothies', name: 'Peanut', slug: 'peanut', description: null, price: 80, image_url: null, active: true, sort_order: 4 },

  // Corn
  { id: 'mi-060', category_id: 'cat-corn', name: 'Masala Corn', slug: 'masala-corn', description: null, price: 30, image_url: null, active: true, sort_order: 1 },

  // Drinks
  { id: 'mi-070', category_id: 'cat-drinks', name: 'Chia', slug: 'chia', description: null, price: 50, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-071', category_id: 'cat-drinks', name: 'Iced Matcha', slug: 'iced-matcha', description: null, price: 120, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-072', category_id: 'cat-drinks', name: 'Ginger Elixir', slug: 'ginger-elixir', description: null, price: 40, image_url: null, active: true, sort_order: 3 },

  // No-Bake Dessert Bar
  { id: 'mi-080', category_id: 'cat-dessert-bar', name: 'Hurma Bar', slug: 'hurma-bar', description: null, price: 20, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-081', category_id: 'cat-dessert-bar', name: 'Knafeh Bites', slug: 'knafeh-bites', description: null, price: 30, image_url: null, active: true, sort_order: 2 },

  // Detox Shots
  { id: 'mi-090', category_id: 'cat-detox-shots', name: 'Ginger Shot', slug: 'ginger-shot', description: null, price: 30, image_url: null, active: true, sort_order: 1 },
  { id: 'mi-091', category_id: 'cat-detox-shots', name: 'Beetroot Shot', slug: 'beetroot-shot', description: null, price: 30, image_url: null, active: true, sort_order: 2 },
  { id: 'mi-092', category_id: 'cat-detox-shots', name: 'Green Shot', slug: 'green-shot', description: null, price: 30, image_url: null, active: true, sort_order: 3 },
];

// ── Servings ─────────────────────────────────────────────────
// Multi-serving items (Salads + Sprout Bowls) have two servings
// with distinct prices. All other items have a single serving
// whose price matches the menu_items.price field.

export const servings: Serving[] = [
  // Salads — two servings each
  { id: 'srv-010a', menu_item_id: 'mi-010', name: 'One Serving', multiplier: 1, price: 130, sort_order: 1 },
  { id: 'srv-010b', menu_item_id: 'mi-010', name: 'Two Servings', multiplier: 2, price: 190, sort_order: 2 },
  { id: 'srv-011a', menu_item_id: 'mi-011', name: 'One Serving', multiplier: 1, price: 160, sort_order: 1 },
  { id: 'srv-011b', menu_item_id: 'mi-011', name: 'Two Servings', multiplier: 2, price: 220, sort_order: 2 },
  { id: 'srv-012a', menu_item_id: 'mi-012', name: 'One Serving', multiplier: 1, price: 140, sort_order: 1 },
  { id: 'srv-012b', menu_item_id: 'mi-012', name: 'Two Servings', multiplier: 2, price: 200, sort_order: 2 },
  { id: 'srv-013a', menu_item_id: 'mi-013', name: 'One Serving', multiplier: 1, price: 190, sort_order: 1 },
  { id: 'srv-013b', menu_item_id: 'mi-013', name: 'Two Servings', multiplier: 2, price: 250, sort_order: 2 },

  // Sprout Bowls — two servings each
  { id: 'srv-030a', menu_item_id: 'mi-030', name: 'One Serving', multiplier: 1, price: 90, sort_order: 1 },
  { id: 'srv-030b', menu_item_id: 'mi-030', name: 'Two Servings', multiplier: 2, price: 140, sort_order: 2 },
  { id: 'srv-031a', menu_item_id: 'mi-031', name: 'One Serving', multiplier: 1, price: 90, sort_order: 1 },
  { id: 'srv-031b', menu_item_id: 'mi-031', name: 'Two Servings', multiplier: 2, price: 140, sort_order: 2 },
  { id: 'srv-032a', menu_item_id: 'mi-032', name: 'One Serving', multiplier: 1, price: 90, sort_order: 1 },
  { id: 'srv-032b', menu_item_id: 'mi-032', name: 'Two Servings', multiplier: 2, price: 140, sort_order: 2 },

  // All single-serving items
  ...(['mi-001','mi-002','mi-003','mi-004','mi-005','mi-006','mi-007','mi-020','mi-021','mi-022','mi-023','mi-040','mi-041','mi-042','mi-043','mi-050','mi-051','mi-052','mi-053','mi-060','mi-070','mi-071','mi-072','mi-080','mi-081','mi-090','mi-091','mi-092'].map((id, i) => {
    const item = menuItems.find((m) => m.id === id)!;
    return {
      id: `srv-default-${i}`,
      menu_item_id: id,
      name: '1 Serving',
      multiplier: 1,
      price: item.price,
      sort_order: 1,
    };
  })),
];

// ── Nutrition (PLACEHOLDER VALUES) ───────────────────────────
// Realistic estimates. Will be replaced with verified data.
// For multi-serving items, the "Two Servings" nutrition is
// approximately 1.5x the base (not 2x) to reflect realistic
// scaling of shared ingredients.

function n(
  id: string,
  menu_item_id: string,
  serving_id: string,
  cal: number,
  pro: number,
  carb: number,
  fat: number,
  fib: number,
  sug: number,
  sod: number,
): Nutrition {
  return { id, menu_item_id, serving_id, calories: cal, protein: pro, carbohydrates: carb, fat, fiber: fib, sugar: sug, sodium: sod };
}

export const nutrition: Nutrition[] = [
  // Meals
  n('nut-001', 'mi-001', 'srv-default-0', 280, 12, 32, 12, 4, 3, 420),
  n('nut-002', 'mi-002', 'srv-default-1', 220, 14, 18, 10, 2, 1, 380),
  n('nut-003', 'mi-003', 'srv-default-2', 340, 16, 30, 16, 8, 3, 520),
  n('nut-004', 'mi-004', 'srv-default-3', 260, 8, 34, 10, 6, 2, 480),
  n('nut-005', 'mi-005', 'srv-default-4', 320, 22, 12, 18, 3, 4, 590),
  n('nut-006', 'mi-006', 'srv-default-5', 380, 14, 32, 20, 7, 4, 640),
  n('nut-007', 'mi-007', 'srv-default-6', 300, 16, 24, 14, 3, 2, 510),

  // Salads — one serving
  n('nut-010a', 'mi-010', 'srv-010a', 220, 12, 18, 11, 5, 4, 340),
  n('nut-010b', 'mi-010', 'srv-010b', 340, 18, 27, 17, 8, 6, 520),
  n('nut-011a', 'mi-011', 'srv-011a', 240, 10, 28, 12, 8, 3, 420),
  n('nut-011b', 'mi-011', 'srv-011b', 370, 15, 42, 18, 12, 5, 640),
  n('nut-012a', 'mi-012', 'srv-012a', 200, 8, 22, 10, 6, 5, 280),
  n('nut-012b', 'mi-012', 'srv-012b', 310, 12, 33, 16, 10, 8, 430),
  n('nut-013a', 'mi-013', 'srv-013a', 280, 10, 26, 16, 8, 4, 360),
  n('nut-013b', 'mi-013', 'srv-013b', 430, 15, 40, 24, 12, 6, 550),

  // Protein Bowls
  n('nut-020', 'mi-020', 'srv-default-7', 320, 24, 28, 14, 8, 4, 480),
  n('nut-021', 'mi-021', 'srv-default-8', 180, 8, 20, 8, 6, 3, 280),
  n('nut-022', 'mi-022', 'srv-default-9', 260, 10, 42, 6, 8, 5, 320),
  n('nut-023', 'mi-023', 'srv-default-10', 220, 8, 38, 5, 6, 12, 180),

  // Sprout Bowls — one serving
  n('nut-030a', 'mi-030', 'srv-030a', 150, 6, 26, 2, 8, 2, 150),
  n('nut-030b', 'mi-030', 'srv-030b', 230, 9, 40, 3, 12, 3, 230),
  n('nut-031a', 'mi-031', 'srv-031a', 140, 7, 22, 2, 7, 2, 140),
  n('nut-031b', 'mi-031', 'srv-031b', 210, 11, 34, 3, 11, 3, 210),
  n('nut-032a', 'mi-032', 'srv-032a', 145, 7, 24, 1, 8, 2, 130),
  n('nut-032b', 'mi-032', 'srv-032b', 220, 10, 37, 2, 12, 3, 200),

  // Protein Sandwiches
  n('nut-040', 'mi-040', 'srv-default-11', 240, 12, 28, 8, 4, 3, 480),
  n('nut-041', 'mi-041', 'srv-default-12', 280, 12, 30, 10, 5, 4, 520),
  n('nut-042', 'mi-042', 'srv-default-13', 260, 14, 26, 10, 4, 3, 460),
  n('nut-043', 'mi-043', 'srv-default-14', 220, 14, 18, 10, 2, 2, 400),

  // Smoothies
  n('nut-050', 'mi-050', 'srv-default-15', 240, 6, 32, 8, 4, 22, 120),
  n('nut-051', 'mi-051', 'srv-default-16', 180, 12, 24, 4, 2, 16, 100),
  n('nut-052', 'mi-052', 'srv-default-17', 200, 6, 30, 5, 3, 20, 90),
  n('nut-053', 'mi-053', 'srv-default-18', 280, 12, 24, 14, 4, 8, 200),

  // Corn
  n('nut-060', 'mi-060', 'srv-default-19', 120, 4, 26, 2, 4, 5, 250),

  // Drinks
  n('nut-070', 'mi-070', 'srv-default-20', 90, 2, 18, 1, 4, 8, 50),
  n('nut-071', 'mi-071', 'srv-default-21', 60, 1, 10, 1, 2, 6, 40),
  n('nut-072', 'mi-072', 'srv-default-22', 30, 1, 6, 0, 1, 3, 10),

  // No-Bake Dessert Bar
  n('nut-080', 'mi-080', 'srv-default-23', 100, 2, 16, 4, 2, 12, 30),
  n('nut-081', 'mi-081', 'srv-default-24', 130, 3, 20, 5, 1, 10, 40),

  // Detox Shots
  n('nut-090', 'mi-090', 'srv-default-25', 20, 1, 5, 0, 0, 3, 5),
  n('nut-091', 'mi-091', 'srv-default-26', 25, 1, 6, 0, 1, 4, 8),
  n('nut-092', 'mi-092', 'srv-default-27', 15, 1, 3, 0, 1, 2, 5),
];

// ── Micronutrients (PLACEHOLDER VALUES) ──────────────────────

function micro(id: string, menu_item_id: string, serving_id: string, name: string, amount: number, unit: string): Micronutrient {
  return { id, menu_item_id, serving_id, nutrient_name: name, amount, unit };
}

export const micronutrients: Micronutrient[] = [
  // Meals
  micro('mic-001-1', 'mi-001', 'srv-default-0', 'Calcium', 120, 'mg'),
  micro('mic-001-2', 'mi-001', 'srv-default-0', 'Iron', 2.1, 'mg'),
  micro('mic-002-1', 'mi-002', 'srv-default-1', 'Vitamin B12', 0.8, 'mcg'),
  micro('mic-002-2', 'mi-002', 'srv-default-1', 'Iron', 1.8, 'mg'),
  micro('mic-003-1', 'mi-003', 'srv-default-2', 'Calcium', 180, 'mg'),
  micro('mic-003-2', 'mi-003', 'srv-default-2', 'Iron', 3.2, 'mg'),
  micro('mic-003-3', 'mi-003', 'srv-default-2', 'Vitamin C', 15, 'mg'),
  micro('mic-004-1', 'mi-004', 'srv-default-3', 'Iron', 2.8, 'mg'),
  micro('mic-004-2', 'mi-004', 'srv-default-3', 'Folate', 60, 'mcg'),
  micro('mic-005-1', 'mi-005', 'srv-default-4', 'Calcium', 200, 'mg'),
  micro('mic-005-2', 'mi-005', 'srv-default-4', 'Vitamin C', 12, 'mg'),
  micro('mic-006-1', 'mi-006', 'srv-default-5', 'Calcium', 160, 'mg'),
  micro('mic-006-2', 'mi-006', 'srv-default-5', 'Iron', 2.4, 'mg'),
  micro('mic-006-3', 'mi-006', 'srv-default-5', 'Vitamin K', 48, 'mcg'),
  micro('mic-007-1', 'mi-007', 'srv-default-6', 'Calcium', 220, 'mg'),
  micro('mic-007-2', 'mi-007', 'srv-default-6', 'Iron', 1.6, 'mg'),

  // Salads
  micro('mic-010a-1', 'mi-010', 'srv-010a', 'Calcium', 140, 'mg'),
  micro('mic-010a-2', 'mi-010', 'srv-010a', 'Vitamin C', 18, 'mg'),
  micro('mic-010b-1', 'mi-010', 'srv-010b', 'Calcium', 210, 'mg'),
  micro('mic-010b-2', 'mi-010', 'srv-010b', 'Vitamin C', 27, 'mg'),
  micro('mic-011a-1', 'mi-011', 'srv-011a', 'Iron', 3.4, 'mg'),
  micro('mic-011a-2', 'mi-011', 'srv-011a', 'Folate', 80, 'mcg'),
  micro('mic-011b-1', 'mi-011', 'srv-011b', 'Iron', 5.1, 'mg'),
  micro('mic-011b-2', 'mi-011', 'srv-011b', 'Folate', 120, 'mcg'),
  micro('mic-012a-1', 'mi-012', 'srv-012a', 'Iron', 2.2, 'mg'),
  micro('mic-012a-2', 'mi-012', 'srv-012a', 'Vitamin C', 22, 'mg'),
  micro('mic-012a-3', 'mi-012', 'srv-012a', 'Vitamin E', 2.8, 'mg'),
  micro('mic-012b-1', 'mi-012', 'srv-012b', 'Iron', 3.3, 'mg'),
  micro('mic-012b-2', 'mi-012', 'srv-012b', 'Vitamin C', 33, 'mg'),
  micro('mic-012b-3', 'mi-012', 'srv-012b', 'Vitamin E', 4.2, 'mg'),
  micro('mic-013a-1', 'mi-013', 'srv-013a', 'Potassium', 520, 'mg'),
  micro('mic-013a-2', 'mi-013', 'srv-013a', 'Vitamin E', 3.5, 'mg'),
  micro('mic-013b-1', 'mi-013', 'srv-013b', 'Potassium', 780, 'mg'),
  micro('mic-013b-2', 'mi-013', 'srv-013b', 'Vitamin E', 5.3, 'mg'),

  // Protein Bowls
  micro('mic-020-1', 'mi-020', 'srv-default-7', 'Calcium', 180, 'mg'),
  micro('mic-020-2', 'mi-020', 'srv-default-7', 'Iron', 4.2, 'mg'),
  micro('mic-020-3', 'mi-020', 'srv-default-7', 'Potassium', 620, 'mg'),
  micro('mic-020-4', 'mi-020', 'srv-default-7', 'Vitamin C', 35, 'mg'),
  micro('mic-020-5', 'mi-020', 'srv-default-7', 'Vitamin A', 120, 'mcg'),
  micro('mic-021-1', 'mi-021', 'srv-default-8', 'Vitamin K', 80, 'mcg'),
  micro('mic-021-2', 'mi-021', 'srv-default-8', 'Folate', 60, 'mcg'),
  micro('mic-022-1', 'mi-022', 'srv-default-9', 'Iron', 3.8, 'mg'),
  micro('mic-022-2', 'mi-022', 'srv-default-9', 'Magnesium', 95, 'mg'),
  micro('mic-023-1', 'mi-023', 'srv-default-10', 'Iron', 2.0, 'mg'),
  micro('mic-023-2', 'mi-023', 'srv-default-10', 'Magnesium', 60, 'mg'),

  // Sprout Bowls
  micro('mic-030a-1', 'mi-030', 'srv-030a', 'Iron', 2.6, 'mg'),
  micro('mic-030a-2', 'mi-030', 'srv-030a', 'Calcium', 80, 'mg'),
  micro('mic-030b-1', 'mi-030', 'srv-030b', 'Iron', 3.9, 'mg'),
  micro('mic-030b-2', 'mi-030', 'srv-030b', 'Calcium', 120, 'mg'),
  micro('mic-031a-1', 'mi-031', 'srv-031a', 'Iron', 2.4, 'mg'),
  micro('mic-031a-2', 'mi-031', 'srv-031a', 'Folate', 50, 'mcg'),
  micro('mic-031b-1', 'mi-031', 'srv-031b', 'Iron', 3.6, 'mg'),
  micro('mic-031b-2', 'mi-031', 'srv-031b', 'Folate', 75, 'mcg'),
  micro('mic-032a-1', 'mi-032', 'srv-032a', 'Vitamin C', 20, 'mg'),
  micro('mic-032a-2', 'mi-032', 'srv-032a', 'Folate', 55, 'mcg'),
  micro('mic-032b-1', 'mi-032', 'srv-032b', 'Vitamin C', 30, 'mg'),
  micro('mic-032b-2', 'mi-032', 'srv-032b', 'Folate', 83, 'mcg'),

  // Protein Sandwiches
  micro('mic-040-1', 'mi-040', 'srv-default-11', 'Calcium', 100, 'mg'),
  micro('mic-040-2', 'mi-040', 'srv-default-11', 'Vitamin C', 8, 'mg'),
  micro('mic-041-1', 'mi-041', 'srv-default-12', 'Calcium', 140, 'mg'),
  micro('mic-041-2', 'mi-041', 'srv-default-12', 'Iron', 2.0, 'mg'),
  micro('mic-042-1', 'mi-042', 'srv-default-13', 'Vitamin B12', 0.6, 'mcg'),
  micro('mic-042-2', 'mi-042', 'srv-default-13', 'Iron', 1.8, 'mg'),
  micro('mic-043-1', 'mi-043', 'srv-default-14', 'Vitamin B12', 1.0, 'mcg'),
  micro('mic-043-2', 'mi-043', 'srv-default-14', 'Iron', 1.5, 'mg'),

  // Smoothies
  micro('mic-050-1', 'mi-050', 'srv-default-15', 'Iron', 1.8, 'mg'),
  micro('mic-050-2', 'mi-050', 'srv-default-15', 'Magnesium', 50, 'mg'),
  micro('mic-051-1', 'mi-051', 'srv-default-16', 'Calcium', 180, 'mg'),
  micro('mic-051-2', 'mi-051', 'srv-default-16', 'Vitamin B12', 0.8, 'mcg'),
  micro('mic-052-1', 'mi-052', 'srv-default-17', 'Vitamin C', 15, 'mg'),
  micro('mic-052-2', 'mi-052', 'srv-default-17', 'Calcium', 100, 'mg'),
  micro('mic-053-1', 'mi-053', 'srv-default-18', 'Iron', 1.4, 'mg'),
  micro('mic-053-2', 'mi-053', 'srv-default-18', 'Magnesium', 40, 'mg'),

  // Corn
  micro('mic-060-1', 'mi-060', 'srv-default-19', 'Vitamin C', 8, 'mg'),
  micro('mic-060-2', 'mi-060', 'srv-default-19', 'Folate', 40, 'mcg'),

  // Drinks
  micro('mic-070-1', 'mi-070', 'srv-default-20', 'Iron', 1.6, 'mg'),
  micro('mic-070-2', 'mi-070', 'srv-default-20', 'Magnesium', 30, 'mg'),
  micro('mic-071-1', 'mi-071', 'srv-default-21', 'Vitamin C', 10, 'mg'),
  micro('mic-071-2', 'mi-071', 'srv-default-21', 'Potassium', 120, 'mg'),
  micro('mic-072-1', 'mi-072', 'srv-default-22', 'Vitamin C', 8, 'mg'),

  // No-Bake Dessert Bar
  micro('mic-080-1', 'mi-080', 'srv-default-23', 'Iron', 0.8, 'mg'),
  micro('mic-081-1', 'mi-081', 'srv-default-24', 'Calcium', 40, 'mg'),

  // Detox Shots
  micro('mic-090-1', 'mi-090', 'srv-default-25', 'Vitamin C', 10, 'mg'),
  micro('mic-091-1', 'mi-091', 'srv-default-26', 'Iron', 1.0, 'mg'),
  micro('mic-092-1', 'mi-092', 'srv-default-27', 'Vitamin C', 12, 'mg'),
];

// ── Ingredients ──────────────────────────────────────────────
// Derived from the five items that have descriptions. For items
// without descriptions, we list the ingredient implied by the name.

function ing(id: string, menu_item_id: string, name: string, sort: number): Ingredient {
  return { id, menu_item_id, ingredient_name: name, sort_order: sort };
}

export const ingredients: Ingredient[] = [
  // Meals
  ing('ing-001-1', 'mi-001', 'Corn', 1),
  ing('ing-001-2', 'mi-001', 'Cheese', 2),
  ing('ing-001-3', 'mi-001', 'Wrap', 3),
  ing('ing-002-1', 'mi-002', 'Egg', 1),
  ing('ing-002-2', 'mi-002', 'Wrap', 2),
  ing('ing-003-1', 'mi-003', 'Tahini', 1),
  ing('ing-003-2', 'mi-003', 'Paneer', 2),
  ing('ing-003-3', 'mi-003', 'Fresh Greens', 3),
  ing('ing-004-1', 'mi-004', 'Chickpea', 1),
  ing('ing-004-2', 'mi-004', 'Herbs', 2),
  ing('ing-005-1', 'mi-005', 'Paneer', 1),
  ing('ing-005-2', 'mi-005', 'Peri Peri Spice', 2),
  ing('ing-006-1', 'mi-006', 'Hummus', 1),
  ing('ing-006-2', 'mi-006', 'Lettuce', 2),
  ing('ing-006-3', 'mi-006', 'Sesame', 3),
  ing('ing-007-1', 'mi-007', 'Paneer', 1),
  ing('ing-007-2', 'mi-007', 'Cheese', 2),
  ing('ing-007-3', 'mi-007', 'Roll', 3),

  // Salads
  ing('ing-010-1', 'mi-010', 'Paneer', 1),
  ing('ing-010-2', 'mi-010', 'Corn', 2),
  ing('ing-011-1', 'mi-011', 'Chickpeas', 1),
  ing('ing-011-2', 'mi-011', 'Chimichurri', 2),
  ing('ing-012-1', 'mi-012', 'Walnut', 1),
  ing('ing-012-2', 'mi-012', 'Zest', 2),
  ing('ing-012-3', 'mi-012', 'Fresh Greens', 3),
  ing('ing-013-1', 'mi-013', 'Avocado', 1),
  ing('ing-013-2', 'mi-013', 'Lettuce', 2),
  ing('ing-013-3', 'mi-013', 'Tahini', 3),

  // Protein Bowls
  ing('ing-020-1', 'mi-020', 'Lettuce', 1),
  ing('ing-020-2', 'mi-020', 'Chickpea', 2),
  ing('ing-020-3', 'mi-020', 'Paneer', 3),
  ing('ing-021-1', 'mi-021', 'Lettuce', 1),
  ing('ing-022-1', 'mi-022', 'Quinoa', 1),
  ing('ing-023-1', 'mi-023', 'Oats', 1),

  // Sprout Bowls
  ing('ing-030-1', 'mi-030', 'Ragi Sprouts', 1),
  ing('ing-031-1', 'mi-031', 'Black Pea Sprouts', 1),
  ing('ing-032-1', 'mi-032', 'Mung Bean Sprouts', 1),

  // Protein Sandwiches
  ing('ing-040-1', 'mi-040', 'Paneer', 1),
  ing('ing-040-2', 'mi-040', 'Peri Peri Spice', 2),
  ing('ing-041-1', 'mi-041', 'Greek Filling', 1),
  ing('ing-041-2', 'mi-041', 'Bread', 2),
  ing('ing-042-1', 'mi-042', 'Poached Egg', 1),
  ing('ing-042-2', 'mi-042', 'Bread', 2),
  ing('ing-043-1', 'mi-043', 'Egg', 1),
  ing('ing-043-2', 'mi-043', 'Cheese', 2),

  // Smoothies
  ing('ing-050-1', 'mi-050', 'Dry Fruits', 1),
  ing('ing-050-2', 'mi-050', 'Milk', 2),
  ing('ing-051-1', 'mi-051', 'Curd', 1),
  ing('ing-051-2', 'mi-051', 'Protein', 2),
  ing('ing-052-1', 'mi-052', 'Berry', 1),
  ing('ing-052-2', 'mi-052', 'Yogurt', 2),
  ing('ing-053-1', 'mi-053', 'Peanut', 1),
  ing('ing-053-2', 'mi-053', 'Milk', 2),

  // Corn
  ing('ing-060-1', 'mi-060', 'Corn', 1),
  ing('ing-060-2', 'mi-060', 'Masala', 2),

  // Drinks
  ing('ing-070-1', 'mi-070', 'Chia Seeds', 1),
  ing('ing-070-2', 'mi-070', 'Water', 2),
  ing('ing-071-1', 'mi-071', 'Matcha', 1),
  ing('ing-071-2', 'mi-071', 'Ice', 2),
  ing('ing-072-1', 'mi-072', 'Ginger', 1),

  // No-Bake Dessert Bar
  ing('ing-080-1', 'mi-080', 'Hurma', 1),
  ing('ing-081-1', 'mi-081', 'Knafeh', 1),

  // Detox Shots
  ing('ing-090-1', 'mi-090', 'Ginger', 1),
  ing('ing-091-1', 'mi-091', 'Beetroot', 1),
  ing('ing-092-1', 'mi-092', 'Green Vegetables', 1),
];

// ── Dietary Tags ─────────────────────────────────────────────

function tag(id: string, menu_item_id: string, t: string): DietaryTag {
  return { id, menu_item_id, tag: t };
}

export const dietaryTags: DietaryTag[] = [
  // Meals
  tag('dt-001-1', 'mi-001', 'Vegetarian'),
  tag('dt-002-1', 'mi-002', 'Egg'),
  tag('dt-003-1', 'mi-003', 'Vegetarian'),
  tag('dt-003-2', 'mi-003', 'High Protein'),
  tag('dt-004-1', 'mi-004', 'Vegan'),
  tag('dt-004-2', 'mi-004', 'High Fiber'),
  tag('dt-005-1', 'mi-005', 'Vegetarian'),
  tag('dt-005-2', 'mi-005', 'High Protein'),
  tag('dt-006-1', 'mi-006', 'Vegetarian'),
  tag('dt-006-2', 'mi-006', 'High Fiber'),
  tag('dt-007-1', 'mi-007', 'Vegetarian'),

  // Salads
  tag('dt-010-1', 'mi-010', 'Vegetarian'),
  tag('dt-010-2', 'mi-010', 'High Protein'),
  tag('dt-011-1', 'mi-011', 'Vegan'),
  tag('dt-011-2', 'mi-011', 'High Fiber'),
  tag('dt-012-1', 'mi-012', 'Vegetarian'),
  tag('dt-013-1', 'mi-013', 'Vegetarian'),
  tag('dt-013-2', 'mi-013', 'High Fiber'),

  // Protein Bowls
  tag('dt-020-1', 'mi-020', 'Vegetarian'),
  tag('dt-020-2', 'mi-020', 'High Protein'),
  tag('dt-020-3', 'mi-020', 'High Fiber'),
  tag('dt-021-1', 'mi-021', 'Vegetarian'),
  tag('dt-021-2', 'mi-021', 'Low Calorie'),
  tag('dt-022-1', 'mi-022', 'Vegetarian'),
  tag('dt-022-2', 'mi-022', 'High Fiber'),
  tag('dt-023-1', 'mi-023', 'Vegetarian'),
  tag('dt-023-2', 'mi-023', 'High Fiber'),

  // Sprout Bowls
  tag('dt-030-1', 'mi-030', 'Vegan'),
  tag('dt-030-2', 'mi-030', 'High Fiber'),
  tag('dt-031-1', 'mi-031', 'Vegan'),
  tag('dt-031-2', 'mi-031', 'High Fiber'),
  tag('dt-032-1', 'mi-032', 'Vegan'),
  tag('dt-032-2', 'mi-032', 'High Fiber'),

  // Protein Sandwiches
  tag('dt-040-1', 'mi-040', 'Vegetarian'),
  tag('dt-040-2', 'mi-040', 'High Protein'),
  tag('dt-041-1', 'mi-041', 'Vegetarian'),
  tag('dt-042-1', 'mi-042', 'Egg'),
  tag('dt-042-2', 'mi-042', 'High Protein'),
  tag('dt-043-1', 'mi-043', 'Egg'),
  tag('dt-043-2', 'mi-043', 'High Protein'),

  // Smoothies
  tag('dt-050-1', 'mi-050', 'Vegetarian'),
  tag('dt-051-1', 'mi-051', 'Vegetarian'),
  tag('dt-051-2', 'mi-051', 'High Protein'),
  tag('dt-052-1', 'mi-052', 'Vegetarian'),
  tag('dt-053-1', 'mi-053', 'Vegetarian'),
  tag('dt-053-2', 'mi-053', 'High Protein'),

  // Corn
  tag('dt-060-1', 'mi-060', 'Vegan'),
  tag('dt-060-2', 'mi-060', 'Gluten-Free'),

  // Drinks
  tag('dt-070-1', 'mi-070', 'Vegan'),
  tag('dt-070-2', 'mi-070', 'Gluten-Free'),
  tag('dt-071-1', 'mi-071', 'Vegan'),
  tag('dt-071-2', 'mi-071', 'Antioxidant'),
  tag('dt-072-1', 'mi-072', 'Vegan'),
  tag('dt-072-2', 'mi-072', 'Detox'),

  // No-Bake Dessert Bar
  tag('dt-080-1', 'mi-080', 'Vegetarian'),
  tag('dt-081-1', 'mi-081', 'Vegetarian'),

  // Detox Shots
  tag('dt-090-1', 'mi-090', 'Vegan'),
  tag('dt-090-2', 'mi-090', 'Detox'),
  tag('dt-091-1', 'mi-091', 'Vegan'),
  tag('dt-091-2', 'mi-091', 'Detox'),
  tag('dt-092-1', 'mi-092', 'Vegan'),
  tag('dt-092-2', 'mi-092', 'Detox'),
];

// ── Allergens ────────────────────────────────────────────────
// Only confirmed allergens based on ingredients. Not invented.

function alg(id: string, menu_item_id: string, a: string): Allergen {
  return { id, menu_item_id, allergen: a };
}

export const allergens: Allergen[] = [
  // Dairy
  alg('alg-001-1', 'mi-001', 'Dairy'),
  alg('alg-003-1', 'mi-003', 'Dairy'),
  alg('alg-005-1', 'mi-005', 'Dairy'),
  alg('alg-006-1', 'mi-006', 'Sesame'),
  alg('alg-007-1', 'mi-007', 'Dairy'),
  alg('alg-010-1', 'mi-010', 'Dairy'),
  alg('alg-012-1', 'mi-012', 'Tree Nuts'),
  alg('alg-013-1', 'mi-013', 'Dairy'),
  alg('alg-020-1', 'mi-020', 'Dairy'),
  alg('alg-040-1', 'mi-040', 'Dairy'),
  alg('alg-041-1', 'mi-041', 'Dairy'),
  alg('alg-043-1', 'mi-043', 'Dairy'),
  alg('alg-043-2', 'mi-043', 'Egg'),
  alg('alg-042-1', 'mi-042', 'Egg'),
  alg('alg-050-1', 'mi-050', 'Tree Nuts'),
  alg('alg-051-1', 'mi-051', 'Dairy'),
  alg('alg-052-1', 'mi-052', 'Dairy'),
  alg('alg-053-1', 'mi-053', 'Peanuts'),
  alg('alg-080-1', 'mi-080', 'Tree Nuts'),
  alg('alg-081-1', 'mi-081', 'Dairy'),

  // Gluten (from wraps/bread)
  alg('alg-001-2', 'mi-001', 'Gluten'),
  alg('alg-002-1', 'mi-002', 'Gluten'),
  alg('alg-007-2', 'mi-007', 'Gluten'),
  alg('alg-040-2', 'mi-040', 'Gluten'),
  alg('alg-041-2', 'mi-041', 'Gluten'),
  alg('alg-042-2', 'mi-042', 'Gluten'),
];

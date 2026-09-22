-- Add temporarily_unavailable column to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS temporarily_unavailable boolean NOT NULL DEFAULT false;

-- Customer RLS should still show items that are temporarily unavailable
-- (they're visible but marked as unavailable), so no policy change needed.
-- The active flag controls visibility; temporarily_unavailable is a display status.

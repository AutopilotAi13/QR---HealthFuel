/*
# Create Personalized Nutrition early-access submissions

1. New Tables
- `personalized_nutrition_early_access`
- `id` (uuid, primary key): unique submission identifier.
- `name` (text): visitor's name.
- `email` (text): visitor's email address.
- `age` (integer): visitor's age, bounded from 1 through 120.
- `gender` (text): selected gender option.
- `goal` (text): selected nutrition goal.
- `phone` (text): optional phone number.
- `created_at` (timestamptz): submission timestamp.

2. Data Integrity
- Required fields have NOT NULL constraints.
- Gender and goal values are restricted to the options shown by the form.
- A case-insensitive unique index on email prevents duplicate early-access submissions.

3. Security
- Row Level Security is enabled.
- Anonymous and authenticated visitors can INSERT submissions only.
- SELECT, UPDATE, and DELETE privileges are revoked from public client roles.
- No public policy exposes submitted personal details.

4. Important Notes
- This table is added to the existing production Supabase project used by the QR menu.
- The customer form must confirm a successful INSERT before showing the thank-you state.
*/

CREATE TABLE IF NOT EXISTS public.personalized_nutrition_early_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 320),
  age integer NOT NULL CHECK (age BETWEEN 1 AND 120),
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  goal text NOT NULL CHECK (goal IN ('Weight Loss', 'Weight Gain', 'Maintenance', 'General Fitness')),
  phone text CHECK (phone IS NULL OR char_length(btrim(phone)) BETWEEN 7 AND 32),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.personalized_nutrition_early_access ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS personalized_nutrition_early_access_email_key
  ON public.personalized_nutrition_early_access (lower(btrim(email)));

REVOKE SELECT, UPDATE, DELETE ON public.personalized_nutrition_early_access FROM anon, authenticated;
GRANT INSERT ON public.personalized_nutrition_early_access TO anon, authenticated;

DROP POLICY IF EXISTS "public_insert_personalized_nutrition_early_access" ON public.personalized_nutrition_early_access;
CREATE POLICY "public_insert_personalized_nutrition_early_access"
  ON public.personalized_nutrition_early_access
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
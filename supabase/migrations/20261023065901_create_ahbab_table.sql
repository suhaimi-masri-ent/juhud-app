/*
# Create ahbab table (single-tenant, no auth)

1. New Tables
- `ahbab`
  - `id` (uuid, primary key)
  - `fullname` (text, not null)
  - `created_at` (timestamp, defaults to now)

2. Security
- Enable RLS on `ahbab`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS ahbab (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ahbab ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON ahbab TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_ahbab" ON ahbab;
CREATE POLICY "anon_select_ahbab" ON ahbab FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ahbab" ON ahbab;
CREATE POLICY "anon_insert_ahbab" ON ahbab FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ahbab" ON ahbab;
CREATE POLICY "anon_update_ahbab" ON ahbab FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ahbab" ON ahbab;
CREATE POLICY "anon_delete_ahbab" ON ahbab FOR DELETE
  TO anon, authenticated USING (true);


-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Allow public insert access" ON public.sensor_data;
DROP POLICY IF EXISTS "Allow public read access" ON public.sensor_data;

-- Recreate as permissive policies (default)
CREATE POLICY "Allow public read access"
  ON public.sensor_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access"
  ON public.sensor_data
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


CREATE POLICY "Allow public read access permissive"
  ON public.sensor_data
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access permissive"
  ON public.sensor_data
  AS PERMISSIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

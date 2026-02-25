DROP POLICY IF EXISTS "Allow public read access" ON public.sensor_data;
DROP POLICY IF EXISTS "Allow public insert access" ON public.sensor_data;
DROP POLICY IF EXISTS "Allow public read access permissive" ON public.sensor_data;
DROP POLICY IF EXISTS "Allow public insert access permissive" ON public.sensor_data;

CREATE POLICY "anon_select" ON public.sensor_data AS PERMISSIVE FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.sensor_data AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_select" ON public.sensor_data AS PERMISSIVE FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert" ON public.sensor_data AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);
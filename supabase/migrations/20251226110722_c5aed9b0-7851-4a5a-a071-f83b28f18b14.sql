-- Create sensor_data table to store IoT sensor readings
CREATE TABLE public.sensor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gas1 NUMERIC NOT NULL DEFAULT 0,
  gas2 NUMERIC NOT NULL DEFAULT 0,
  gas3 NUMERIC NOT NULL DEFAULT 0,
  gas4 NUMERIC NOT NULL DEFAULT 0,
  temperature NUMERIC NOT NULL DEFAULT 0,
  humidity NUMERIC NOT NULL DEFAULT 0,
  distance NUMERIC NOT NULL DEFAULT 0,
  gas1_status TEXT NOT NULL DEFAULT 'SAFE',
  gas2_status TEXT NOT NULL DEFAULT 'SAFE',
  gas3_status TEXT NOT NULL DEFAULT 'SAFE',
  gas4_status TEXT NOT NULL DEFAULT 'SAFE',
  alert_flag BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (IoT sensors can post without auth)
CREATE POLICY "Allow public read access" 
ON public.sensor_data 
FOR SELECT 
USING (true);

-- Create policy for public insert access (ESP32 can post data)
CREATE POLICY "Allow public insert access" 
ON public.sensor_data 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for sensor_data table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;

-- Create index for faster queries on created_at
CREATE INDEX idx_sensor_data_created_at ON public.sensor_data(created_at DESC);
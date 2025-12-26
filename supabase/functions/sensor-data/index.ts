import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gas threshold for danger classification (adjust based on your sensors)
const GAS_THRESHOLD = 400;

function classifyGasLevel(value: number): string {
  return value > GAS_THRESHOLD ? 'DANGER' : 'SAFE';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      // POST /api/sensor-data - Receive sensor data from ESP32
      const body = await req.json();
      console.log('Received sensor data:', body);

      const { gas1, gas2, gas3, gas4, temperature, humidity, distance } = body;

      // Classify gas levels
      const gas1_status = classifyGasLevel(gas1 || 0);
      const gas2_status = classifyGasLevel(gas2 || 0);
      const gas3_status = classifyGasLevel(gas3 || 0);
      const gas4_status = classifyGasLevel(gas4 || 0);

      // Check if any gas level is in danger
      const alert_flag = [gas1_status, gas2_status, gas3_status, gas4_status].includes('DANGER');

      const { data, error } = await supabase
        .from('sensor_data')
        .insert({
          gas1: gas1 || 0,
          gas2: gas2 || 0,
          gas3: gas3 || 0,
          gas4: gas4 || 0,
          temperature: temperature || 0,
          humidity: humidity || 0,
          distance: distance || 0,
          gas1_status,
          gas2_status,
          gas3_status,
          gas4_status,
          alert_flag,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting sensor data:', error);
        throw error;
      }

      console.log('Sensor data inserted successfully:', data);

      return new Response(
        JSON.stringify({ success: true, data, alert_flag }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sensor-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
